import React, { useState } from "react";
import {
  Flex,
  Box,
  Button,
  Text,
  IconButton,
  Tooltip,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import {
  HiOutlineTrash,
  HiOutlineEyeOff,
  HiOutlinePencil,
} from "react-icons/hi";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import { useClipboard } from "@chakra-ui/react";

//For Proxy Pattern Implementation
import { RealData, ProxyData } from "../proxy/DataClasses";

const CardDetailRow = ({
  label,
  value,
  isUnmasked,
  maskedValue,
  onCopy,
  hasCopied,
}) => (
  <Flex mt={4} justifyContent="space-between" alignItems="center">
    <Text fontWeight="bold">{label}:</Text>
    <Text>{isUnmasked ? value : maskedValue}</Text>
    <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
      <IconButton
        icon={hasCopied ? <Text>✔</Text> : <Text>📋</Text>}
        onClick={onCopy}
        size="sm"
      />
    </Tooltip>
  </Flex>
);

const CardContainer = ({ card, uid, isUnmasked, onDelete }) => {
  const { cardNumber, cvv, expiryDate, name, id } = card;

  // Create instances of ProxyData for masking/unmasking
  const cardNumberProxy = new ProxyData(new RealData(cardNumber));
  const cvvProxy = new ProxyData(new RealData(cvv));

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    cardNumber,
    cvv,
    expiryDate,
    name,
  });

  const showToast = useShowToast();

  // Clipboard hooks
  const { hasCopied: hasCopiedCardNumber, onCopy: onCopyCardNumber } =
    useClipboard(
      isUnmasked ? cardNumberProxy.unmask() : cardNumberProxy.mask()
    );
  const { hasCopied: hasCopiedCvv, onCopy: onCopyCvv } = useClipboard(
    isUnmasked ? cvvProxy.unmask() : cvvProxy.mask()
  );
  const { hasCopied: hasCopiedExpiry, onCopy: onCopyExpiry } =
    useClipboard(expiryDate);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, `users/${uid}/cards`, id));
      showToast("Success", "Card deleted successfully.", "success");
      onDelete(id);
    } catch (error) {
      console.log("Error: Failed to delete card.");
    }
  };

  const handleEdit = async () => {
    try {
      const cardRef = doc(firestore, `users/${uid}/cards`, id);
      await updateDoc(cardRef, editValues);
      showToast("Success", "Card updated successfully.", "success");
      setIsEditing(false);
    } catch (error) {
      showToast("Error", "Failed to update card.", "error");
    }
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box
      border="1px solid #e0e0e0"
      p={6}
      borderRadius="lg"
      mb={6}
      width={400}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      backgroundColor="white"
    >
      <Text fontSize={24} fontWeight="bold">
        {name}
      </Text>
      <CardDetailRow
        label="Card Number"
        value={cardNumberProxy.unmask()}
        isUnmasked={isUnmasked}
        maskedValue={cardNumberProxy.mask()}
        onCopy={onCopyCardNumber}
        hasCopied={hasCopiedCardNumber}
      />
      <CardDetailRow
        label="CVV"
        value={cvvProxy.unmask()}
        isUnmasked={isUnmasked}
        maskedValue={cvvProxy.mask()}
        onCopy={onCopyCvv}
        hasCopied={hasCopiedCvv}
      />
      <CardDetailRow
        label="Expiration Date"
        value={expiryDate}
        isUnmasked={true}
        maskedValue={expiryDate}
        onCopy={onCopyExpiry}
        hasCopied={hasCopiedExpiry}
      />

      <Flex mt={4} justifyContent="space-between" alignItems="center">
        <Tooltip label="Edit Card" aria-label="Edit Card">
          <IconButton
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditing(true)}
            size="sm"
            colorScheme="blue"
          />
        </Tooltip>
        <Tooltip label="Delete Card" aria-label="Delete Card">
          <IconButton
            icon={<HiOutlineTrash />}
            onClick={handleDelete}
            size="sm"
            colorScheme="red"
          />
        </Tooltip>
      </Flex>

      {/* Modal for Editing Card */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              placeholder="Name"
              mb={4}
              value={editValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Card Number"
              value={editValues.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value)}
            />
            <Input
              placeholder="CVV"
              mt={4}
              value={editValues.cvv}
              onChange={(e) => handleChange("cvv", e.target.value)}
            />
            <Input
              placeholder="Expiry Date"
              mt={4}
              value={editValues.expiryDate}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEdit}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CardContainer;

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

const CardContainer = ({ card, uid, isUnmasked, onDelete }) => {
  const { cardNumber, cvv, expiryDate, caption, id } = card;
  const [isEditing, setIsEditing] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState(cardNumber);
  const [newCvv, setNewCvv] = useState(cvv);
  const [newExpiryDate, setNewExpiryDate] = useState(expiryDate);
  const [newCaption, setNewCaption] = useState(caption);
  const { hasCopied: hasCopiedCardNumber, onCopy: onCopyCardNumber } =
    useClipboard(isUnmasked ? cardNumber : "**** **** **** ****");
  const { hasCopied: hasCopiedCvv, onCopy: onCopyCvv } = useClipboard(
    isUnmasked ? cvv : "****"
  );
  const { hasCopied: hasCopiedExpiry, onCopy: onCopyExpiry } =
    useClipboard(expiryDate);
  const { hasCopied: hasCopiedCaption, onCopy: onCopyCaption } =
    useClipboard(caption);
  const showToast = useShowToast();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, `users/${uid}/creditCards`, id));
      showToast("Success", "Card deleted successfully.", "success");
      onDelete(id); // Call the onDelete function passed from parent to update UI immediately
    } catch (error) {
      showToast("Error", "Failed to delete card.", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const cardRef = doc(firestore, `users/${uid}/creditCards`, id);
      await updateDoc(cardRef, {
        cardNumber: newCardNumber,
        cvv: newCvv,
        expiryDate: newExpiryDate,
        caption: newCaption,
      });
      showToast("Success", "Card updated successfully.", "success");
      setIsEditing(false); // Close the modal after editing
    } catch (error) {
      showToast("Error", "Failed to update card.", "error");
    }
  };

  return (
    <Box
      border="1px solid #e0e0e0"
      p={6}
      borderRadius="lg"
      mb={6}
      width={300}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      backgroundColor="white"
    >
      <Text fontWeight="bold">Card Number:</Text>
      <Text>{isUnmasked ? cardNumber : "**** **** **** ****"}</Text>

      <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
        <IconButton
          icon={hasCopiedCardNumber ? <Text>✔</Text> : <Text>📋</Text>}
          onClick={onCopyCardNumber}
          size="sm"
        />
      </Tooltip>

      <Text mt={2}>
        <Text fontWeight="bold">CVV:</Text>
        {isUnmasked ? cvv : "****"}
      </Text>

      <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
        <IconButton
          icon={hasCopiedCvv ? <Text>✔</Text> : <Text>📋</Text>}
          onClick={onCopyCvv}
          size="sm"
        />
      </Tooltip>

      <Text mt={2}>
        <Text fontWeight="bold">Expiry Date:</Text>
        {expiryDate}
      </Text>

      <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
        <IconButton
          icon={hasCopiedExpiry ? <Text>✔</Text> : <Text>📋</Text>}
          onClick={onCopyExpiry}
          size="sm"
        />
      </Tooltip>

      <Text mt={2}>
        <Text fontWeight="bold">Caption:</Text>
        {caption}
      </Text>

      <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
        <IconButton
          icon={hasCopiedCaption ? <Text>✔</Text> : <Text>📋</Text>}
          onClick={onCopyCaption}
          size="sm"
        />
      </Tooltip>

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
        <ModalContent bg={"white"} border={"1px solid gray"}>
          {" "}
          {/* Light background */}
          <ModalHeader>Edit Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              placeholder="Card Number"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
            />
            <Input
              placeholder="CVV"
              mt={4}
              value={newCvv}
              onChange={(e) => setNewCvv(e.target.value)}
            />
            <Input
              placeholder="Expiry Date"
              mt={4}
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
            />
            <Input
              placeholder="Caption"
              mt={4}
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleEdit}
              isLoading={false} // Loading state could be managed here
            >
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

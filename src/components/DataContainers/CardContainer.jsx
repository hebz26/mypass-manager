import React, { useState } from "react";
import { Box, Text, IconButton, Tooltip, Flex } from "@chakra-ui/react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import { RealData, ProxyData } from "../proxy/DataClasses";
import EditModal from "../modals/EditModal";

const CardDetailRow = ({ label, value, isUnmasked, maskedValue, onCopy }) => (
  <Flex mt={4} justifyContent="space-between" alignItems="center">
    <Text fontWeight="bold">{label}:</Text>
    <Text>{isUnmasked ? value : maskedValue}</Text>
    <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
      <IconButton icon={<Text>📋</Text>} onClick={onCopy} size="sm" />
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
  const { copyToClipboard } = useCopyToClipboard();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, `users/${uid}/cards`, id));
      showToast("Success", "Card deleted successfully.", "success");
      onDelete(id);
    } catch (error) {
      showToast("Error", "Failed to delete card.", "error");
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
        onCopy={() =>
          copyToClipboard(
            isUnmasked ? cardNumberProxy.unmask() : cardNumberProxy.mask()
          )
        }
      />
      <CardDetailRow
        label="CVV"
        value={cvvProxy.unmask()}
        isUnmasked={isUnmasked}
        maskedValue={cvvProxy.mask()}
        onCopy={() =>
          copyToClipboard(isUnmasked ? cvvProxy.unmask() : cvvProxy.mask())
        }
      />
      <CardDetailRow
        label="Expiration Date"
        value={expiryDate}
        isUnmasked={true}
        maskedValue={expiryDate}
        onCopy={() => copyToClipboard(expiryDate)}
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

      {/* Editable Form Modal */}
      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        editValues={editValues}
        onSave={handleEdit}
        onChange={handleChange}
        fields={[
          { name: "name", placeholder: "Name" },
          { name: "cardNumber", placeholder: "Card Number" },
          { name: "cvv", placeholder: "CVV" },
          { name: "expiryDate", placeholder: "Expiration Date" },
        ]}
      />
    </Box>
  );
};

export default CardContainer;

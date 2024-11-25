import React, { useState } from "react";
import { Box, Text, IconButton, Tooltip, Flex } from "@chakra-ui/react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import { RealData, ProxyData } from "../proxy/DataClasses";
import EditModal from "../modals/EditModal";

const NoteDetailRow = ({ label, value, isUnmasked, maskedValue, onCopy }) => (
  <Flex mt={4} justifyContent="space-between" alignItems="center">
    <Text fontWeight={"bold"}>{label}:</Text>
    <Text>{isUnmasked ? value : maskedValue}</Text>
    <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
      <IconButton icon={<Text>📋</Text>} onClick={onCopy} size="sm" />
    </Tooltip>
  </Flex>
);

const NoteContainer = ({ note, uid, isUnmasked, onDelete }) => {
  const { title, content, id } = note;
  const contentProxy = new ProxyData(new RealData(content));
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title,
    content,
  });
  const showToast = useShowToast();
  const { copyToClipboard } = useCopyToClipboard();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, `users/${uid}/notes`, id));
      showToast("Success", "Note deleted successfully.", "success");
      onDelete(id);
    } catch (error) {
      console.log("Failed to delete note");
    }
  };

  const handleEdit = async () => {
    try {
      const noteRef = doc(firestore, `users/${uid}/notes`, id);
      await updateDoc(noteRef, editValues);
      showToast("Success", "Note updated successfully.", "success");
      setIsEditing(false);
    } catch (error) {
      showToast("Error", "Failed to update note.", "error");
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
        {title}
      </Text>
      <NoteDetailRow
        label="Content"
        value={contentProxy.unmask()}
        isUnmasked={isUnmasked}
        maskedValue={contentProxy.mask()}
        onCopy={() =>
          copyToClipboard(
            isUnmasked ? contentProxy.unmask() : contentProxy.mask()
          )
        }
      />

      <Flex mt={4} justifyContent="space-between" alignItems="center">
        <Tooltip label="Edit Note" aria-label="Edit Note">
          <IconButton
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditing(true)}
            size="sm"
            colorScheme="blue"
          />
        </Tooltip>
        <Tooltip label="Delete Note" aria-label="Delete Note">
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
          { field: "title", placeholder: "Note Title" },
          { field: "content", placeholder: "Content" },
        ]}
      />
    </Box>
  );
};

export default NoteContainer;

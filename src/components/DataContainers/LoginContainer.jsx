import React, { useState } from "react";
import { Box, Text, IconButton, Tooltip, Flex } from "@chakra-ui/react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import { RealData, ProxyData } from "../proxy/DataClasses";
import EditModal from "../modals/EditModal";

const LoginDetailRow = ({ label, value, isUnmasked, maskedValue, onCopy }) => (
  <Flex mt={4} justifyContent="space-between" alignItems="center">
    <Text fontWeight="bold">{label}:</Text>
    <Text>{isUnmasked ? value : maskedValue}</Text>
    <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
      <IconButton icon={<Text>📋</Text>} onClick={onCopy} size="sm" />
    </Tooltip>
  </Flex>
);

const LoginContainer = ({ login, uid, isUnmasked, onDelete }) => {
  const { url, username, password, name, id } = login;

  // Create instances of ProxyData for masking/unmasking
  const usernameProxy = new ProxyData(new RealData(username));
  const passwordProxy = new ProxyData(new RealData(password));

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name,
    url,
    username,
    password,
  });

  const showToast = useShowToast();
  const { copyToClipboard } = useCopyToClipboard();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, `users/${uid}/logins`, id));
      showToast("Success", "Login deleted successfully.", "success");
      onDelete(id);
    } catch (error) {
      console.log("Failed to delete login.");
    }
  };

  const handleEdit = async () => {
    try {
      const loginRef = doc(firestore, `users/${uid}/logins`, id);
      await updateDoc(loginRef, editValues);
      showToast("Success", "Login updated successfully.", "success");
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to update login");
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
      <LoginDetailRow
        label="Username"
        value={usernameProxy.unmask()}
        isUnmasked={isUnmasked}
        maskedValue={usernameProxy.mask()}
        onCopy={() =>
          copyToClipboard(
            isUnmasked ? usernameProxy.unmask() : usernameProxy.mask()
          )
        }
      />
      <LoginDetailRow
        label="Password"
        value={passwordProxy.unmask()}
        isUnmasked={isUnmasked}
        maskedValue={passwordProxy.mask()}
        onCopy={() =>
          copyToClipboard(
            isUnmasked ? passwordProxy.unmask() : passwordProxy.mask()
          )
        }
      />
      <LoginDetailRow
        label="URL"
        value={url}
        isUnmasked={true}
        maskedValue={url}
        onCopy={() => copyToClipboard(url)}
      />

      <Flex mt={4} justifyContent="space-between" alignItems="center">
        <Tooltip label="Edit Login" aria-label="Edit Login">
          <IconButton
            icon={<HiOutlinePencil />}
            onClick={() => setIsEditing(true)}
            size="sm"
            colorScheme="blue"
          />
        </Tooltip>
        <Tooltip label="Delete Login" aria-label="Delete Login">
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
          { name: "name", placeholder: "Website Name" },
          { name: "username", placeholder: "Username" },
          { name: "password", placeholder: "Password" },
          { name: "url", placeholder: "URL" },
        ]}
      />
    </Box>
  );
};

export default LoginContainer;

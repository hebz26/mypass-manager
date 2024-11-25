import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";

const LoginModal = ({ onClose, onItemCreated, isLoading, setIsLoading }) => {
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  const handleLoginCreation = async () => {
    const newLogin = { name, username, password, url };

    try {
      setIsLoading(true);
      await addDoc(
        collection(firestore, `users/${authUser.uid}/logins`),
        newLogin
      );
      showToast("Success", "Login created successfully.", "success");
      onItemCreated();
      onClose();
      resetForm();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setUrl("");
    setName("");
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={"white"} border={"1px solid gray"}>
        <ModalHeader>Add Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="Website Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleLoginCreation}
            isLoading={isLoading}
            isDisabled={!username || !password || !url || !name}
          >
            Create Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;

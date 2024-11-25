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

const NoteModal = ({ onClose, onItemCreated, isLoading, setIsLoading }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  const handleNoteCreation = async () => {
    const newNote = { title, content };

    try {
      setIsLoading(true);
      await addDoc(
        collection(firestore, `users/${authUser.uid}/notes`),
        newNote
      );
      showToast("Success", "Note created successfully.", "success");
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
    setTitle("");
    setContent("");
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={"white"} border={"1px solid gray"}>
        <ModalHeader>Add Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            mb={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleNoteCreation}
            isLoading={isLoading}
            isDisabled={!title || !content}
          >
            Create Note
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NoteModal;

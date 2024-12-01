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

const CardModal = ({ onClose, onItemCreated, isLoading, setIsLoading }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  const handleCardCreation = async () => {
    const newCard = { cardNumber, expiryDate, cvv, name };

    try {
      setIsLoading(true);
      await addDoc(
        collection(firestore, `users/${authUser.uid}/cards`),
        newCard
      );
      showToast("Success", "Card created successfully.", "success");
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
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setName("");
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={"white"} border={"1px solid gray"}>
        <ModalHeader>Create Card</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="Card Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength={16}
            mb={4}
          />
          <Input
            placeholder="MM/DD/YYYY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            maxLength={10}
            mb={4}
          />
          <Input
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength={3}
            mb={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleCardCreation}
            isLoading={isLoading}
            isDisabled={!cardNumber || !cvv || !expiryDate || !name}
          >
            Create Card
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;

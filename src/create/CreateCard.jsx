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
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useShowToast from "../hooks/useShowToast";

const CreateCard = ({ onCardCreated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  const handleCardCreation = async () => {
    if (!authUser) {
      showToast("Error", "You must be logged in to create a card.", "error");
      return;
    }

    const newCard = {
      cardNumber,
      cvv,
      expiryDate,
      caption,
      createdAt: Date.now(),
      createdBy: authUser.uid,
    };

    try {
      setIsLoading(true);
      await addDoc(
        collection(firestore, `users/${authUser.uid}/creditCards`),
        newCard
      );
      showToast("Success", "Card created successfully.", "success");
      onCardCreated(); // Notify parent to refresh the card list
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
    setCvv("");
    setExpiryDate("");
    setCaption("");
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap={4}
        color={"whiteAlpha.900"}
        bgColor={"blue.400"}
        width={200}
        onClick={onOpen}
        cursor="pointer"
        borderRadius={6}
        p={2}
        justifyContent="center"
      >
        <Text>Add Card</Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={"white"} border={"1px solid gray"}>
          <ModalHeader>Create Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={16}
              mb={4}
            />
            <Input
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              maxLength={5}
              mb={4}
            />
            <Input
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={3}
              mb={4}
            />
            <Input
              placeholder="Card Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleCardCreation}
              isLoading={isLoading}
              isDisabled={!cardNumber || !cvv || !expiryDate || !caption}
            >
              Create Card
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCard;

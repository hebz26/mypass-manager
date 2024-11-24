import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import CardModal from "../components/modals/CardModal";
// Import other modals that we need here

const CreateItem = ({ collectionType, onItemCreated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const renderModal = () => {
    switch (collectionType) {
      case "cards":
        return (
          <CardModal
            onClose={onClose}
            onItemCreated={onItemCreated}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      default:
        return null;
    }
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
        <Text fontWeight={"bold"}>
          Add {collectionType.charAt(0).toUpperCase() + collectionType.slice(1)}
        </Text>
      </Box>

      {isOpen && renderModal()}
    </>
  );
};

export default CreateItem;

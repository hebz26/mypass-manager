import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Button,
  ModalOverlay,
  ModalContent,
  Input,
} from "@chakra-ui/react";

const EditModal = ({
  isOpen,
  onClose,
  editValues,
  onSave,
  onChange,
  fields,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit {fields?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {fields?.map((field, index) => (
            <Input
              key={index}
              placeholder={field.placeholder}
              value={editValues[field.name]}
              onChange={(e) => onChange(field.name, e.target.value)}
              mb={4}
            />
          ))}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormLabel,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useShowToast from "../hooks/useShowToast";
import IdentityDetailRow from "../components/DataContainers/IdentityDetailRow";
import "../styles/Tab.css";

const IdentityPage = () => {
  const { uid } = useAuthStore((state) => state.user);
  const [ssn, setSsn] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiration, setPassportExpiration] = useState("");
  const [isUnmasked, setIsUnmasked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSsn, setEditSsn] = useState(""); // Separate state for modal inputs
  const [editLicenseNumber, setEditLicenseNumber] = useState("");
  const [editLicenseExpiration, setEditLicenseExpiration] = useState("");
  const [editPassportNumber, setEditPassportNumber] = useState("");
  const [editPassportExpiration, setEditPassportExpiration] = useState("");

  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadUserData = async () => {
    if (!uid) return;
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setSsn(data.ssn || "");
      setLicenseNumber(data.licenseNumber || "");
      setLicenseExpiration(data.licenseExpiration || "");
      setPassportNumber(data.passportNumber || "");
      setPassportExpiration(data.passportExpiration || "");
      // Initialize the modal values
      setEditSsn(data.ssn || "");
      setEditLicenseNumber(data.licenseNumber || "");
      setEditLicenseExpiration(data.licenseExpiration || "");
      setEditPassportNumber(data.passportNumber || "");
      setEditPassportExpiration(data.passportExpiration || "");
    }
  };

  const saveUserData = async () => {
    if (!uid) return;
    setIsLoading(true);
    try {
      // Save the updated data
      await setDoc(
        doc(firestore, "users", uid),
        {
          ssn: editSsn,
          licenseNumber: editLicenseNumber,
          licenseExpiration: editLicenseExpiration,
          passportNumber: editPassportNumber,
          passportExpiration: editPassportExpiration,
        },
        { merge: true }
      );
      // Update the main values after saving
      setSsn(editSsn);
      setLicenseNumber(editLicenseNumber);
      setLicenseExpiration(editLicenseExpiration);
      setPassportNumber(editPassportNumber);
      setPassportExpiration(editPassportExpiration);

      showToast("Success", "Data saved successfully.", "success");
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Error saving data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      loadUserData();
    }
  }, [uid]);

  const handleUnmaskAll = () => {
    setIsUnmasked(true);
    setTimeout(() => {
      setIsUnmasked(false);
    }, 5000); // Automatically re-mask after 5 seconds
  };

  if (!uid) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <div className="tab-page">
      <Box>
        <Text as="h1" fontSize="4xl" mb={4}>
          My Identity
        </Text>
        <div className="buttons">
          <Button
            onClick={onOpen} // Open the modal
            colorScheme="blue"
          >
            Edit Identity Information
          </Button>
          <button className="unmask-button" onClick={handleUnmaskAll}>
            Unmask All
          </button>
        </div>
        <div className="identity-container">
          <IdentityDetailRow
            label="SSN"
            value={ssn}
            onChange={setSsn}
            isUnmasked={isUnmasked}
          />

          <IdentityDetailRow
            label="License Number"
            value={licenseNumber}
            onChange={setLicenseNumber}
            isUnmasked={isUnmasked}
          />

          <IdentityDetailRow
            label="License Expiration"
            value={licenseExpiration}
            onChange={setLicenseExpiration}
            isUnmasked={isUnmasked}
          />

          <IdentityDetailRow
            label="Passport Number"
            value={passportNumber}
            onChange={setPassportNumber}
            isUnmasked={isUnmasked}
          />

          <IdentityDetailRow
            label="Passport Expiration"
            value={passportExpiration}
            onChange={setPassportExpiration}
            isUnmasked={isUnmasked}
          />
        </div>
      </Box>

      {/* Modal for Editing */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Identity Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel htmlFor="ssn">SSN</FormLabel>
            <Input
              id="ssn"
              value={editSsn}
              onChange={(e) => setEditSsn(e.target.value)}
              isRequired
            />

            <FormLabel htmlFor="licenseNumber" mt={4}>
              License Number
            </FormLabel>
            <Input
              id="licenseNumber"
              value={editLicenseNumber}
              onChange={(e) => setEditLicenseNumber(e.target.value)}
              isRequired
            />

            <FormLabel htmlFor="licenseExpiration" mt={4}>
              License Expiration
            </FormLabel>
            <Input
              id="licenseExpiration"
              value={editLicenseExpiration}
              onChange={(e) => setEditLicenseExpiration(e.target.value)}
              isRequired
            />

            <FormLabel htmlFor="passportNumber" mt={4}>
              Passport Number
            </FormLabel>
            <Input
              id="passportNumber"
              value={editPassportNumber}
              onChange={(e) => setEditPassportNumber(e.target.value)}
              isRequired
            />

            <FormLabel htmlFor="passportExpiration" mt={4}>
              Passport Expiration
            </FormLabel>
            <Input
              id="passportExpiration"
              value={editPassportExpiration}
              onChange={(e) => setEditPassportExpiration(e.target.value)}
              isRequired
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={saveUserData}
              isLoading={isLoading}
              colorScheme="blue"
            >
              Save
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default IdentityPage;

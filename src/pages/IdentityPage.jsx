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
  const [identityData, setIdentityData] = useState({
    ssn: "",
    licenseNumber: "",
    licenseExpiration: "",
    passportNumber: "",
    passportExpiration: "",
  });
  const [editIdentityData, setEditIdentityData] = useState({ ...identityData });
  const [isUnmasked, setIsUnmasked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadUserData = async () => {
    if (!uid) return;
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const userData = {
        ssn: data.ssn || "",
        licenseNumber: data.licenseNumber || "",
        licenseExpiration: data.licenseExpiration || "",
        passportNumber: data.passportNumber || "",
        passportExpiration: data.passportExpiration || "",
      };
      setIdentityData(userData);
      setEditIdentityData(userData); // Initialize modal edit values
    }
  };

  const saveUserData = async () => {
    if (!uid) return;
    setIsLoading(true);
    try {
      await setDoc(doc(firestore, "users", uid), editIdentityData, {
        merge: true,
      });
      setIdentityData(editIdentityData); // Update main values
      showToast("Success", "Data saved successfully.", "success");
      onClose();
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Error saving data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) loadUserData();
  }, [uid]);

  const handleUnmaskAll = () => {
    setIsUnmasked(true);
    setTimeout(() => setIsUnmasked(false), 5000);
  };

  const handleInputChange = (e, field) => {
    setEditIdentityData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const renderDetailRow = (label, value, onChange) => (
    <IdentityDetailRow
      label={label}
      value={value}
      onChange={onChange}
      isUnmasked={isUnmasked}
    />
  );

  if (!uid) return <Text>Loading user data...</Text>;

  return (
    <div className="tab-page">
      <Box>
        <Text as="h1" fontSize="4xl" mb={4}>
          My Identity
        </Text>
        <div className="buttons">
          <Button onClick={onOpen} colorScheme="blue">
            Edit Identity Information
          </Button>
          <button className="unmask-button" onClick={handleUnmaskAll}>
            Unmask All
          </button>
        </div>
        <div className="identity-container">
          {[
            "ssn",
            "licenseNumber",
            "licenseExpiration",
            "passportNumber",
            "passportExpiration",
          ].map((field) => (
            <IdentityDetailRow
              key={field} // Add a unique key here
              label={
                field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")
              }
              value={identityData[field]}
              onChange={(value) =>
                setIdentityData((prev) => ({ ...prev, [field]: value }))
              }
              isUnmasked={isUnmasked}
            />
          ))}
        </div>
      </Box>

      {/* Modal for Editing */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Identity Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {[
              { field: "ssn", label: "SSN" },
              { field: "licenseNumber", label: "License Number" },
              { field: "licenseExpiration", label: "License Expiration" },
              { field: "passportNumber", label: "Passport Number" },
              { field: "passportExpiration", label: "Passport Expiration" },
            ].map(({ field, label }) => (
              <div key={field} style={{ marginBottom: "16px" }}>
                {" "}
                {/* Add key here */}
                <FormLabel htmlFor={field}>{label}</FormLabel>
                <Input
                  id={field}
                  value={editIdentityData[field]}
                  onChange={(e) => handleInputChange(e, field)}
                  isRequired
                  style={{ display: "block", width: "100%" }}
                />
              </div>
            ))}
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

import React, { useEffect, useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import { firestore } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import CreateItem from "../create/CreateItem";
import LoginContainer from "../components/DataContainers/LoginContainer";
import useShowToast from "../hooks/useShowToast";
import "../styles/Tab.css";

const LoginsPage = () => {
  const [logins, setLogins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unmaskAll, setUnmaskAll] = useState(false);
  const { uid } = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const userLoginsCollectionRef = collection(
      firestore,
      `users/${uid}/logins`
    );
    const unsubscribe = onSnapshot(
      userLoginsCollectionRef,
      (snapshot) => {
        const fetchedLogins = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogins(fetchedLogins);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching logins:", error);
        setIsLoading(false);
      }
    );
    return unsubscribe;
  }, [uid]);

  const handleUnmaskAll = () => {
    setUnmaskAll(true);
    setTimeout(() => {
      setUnmaskAll(false);
    }, 5000); // Hide after 5 seconds
  };

  return (
    <div className="tab-page">
      <Box>
        <Text as="h1" fontSize="4xl" mb={4}>
          My Logins
        </Text>
        <div className="buttons">
          <CreateItem collectionType="logins" onItemCreated={() => {}} />
          <button className="unmask-button" onClick={handleUnmaskAll}>
            Unmask All Logins
          </button>
        </div>
        <div className="all-cards-container">
          {isLoading ? (
            <Text>Loading...</Text>
          ) : logins.length === 0 ? (
            <Text>No logins available</Text>
          ) : (
            <Flex className="cards-container">
              {logins.map((login) => (
                <LoginContainer
                  key={login.id}
                  login={login}
                  uid={uid}
                  isUnmasked={unmaskAll}
                  className="card"
                />
              ))}
            </Flex>
          )}
        </div>
      </Box>
    </div>
  );
};

export default LoginsPage;

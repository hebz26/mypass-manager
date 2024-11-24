import React, { useEffect, useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import { firestore } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import CreateItem from "../create/CreateItem";
import CardContainer from "../components/DataContainers/CardContainer";
import useShowToast from "../hooks/useShowToast";
import "../styles/Tab.css";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unmaskAll, setUnmaskAll] = useState(false);
  const { uid } = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const userCardsCollectionRef = collection(firestore, `users/${uid}/cards`);
    const unsubscribe = onSnapshot(
      userCardsCollectionRef,
      (snapshot) => {
        const fetchedCards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(fetchedCards);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching cards:", error);
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
          My Cards
        </Text>
        <div className="buttons">
          <CreateItem
            collectionType="cards"
            onItemCreated={() => {
              // This callback is no longer necessary to manually update cards state
              // because Firestore's real-time listener will automatically handle
            }}
          />
          <button className="unmask-button" onClick={handleUnmaskAll}>
            Unmask All Cards
          </button>
        </div>
        <div className="all-cards-container">
          {isLoading ? (
            <Text>Loading...</Text>
          ) : cards.length === 0 ? (
            <Text>No cards available</Text>
          ) : (
            <Flex className="cards-container">
              {cards.map((card) => (
                <CardContainer
                  key={card.id}
                  card={card}
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

export default CardsPage;

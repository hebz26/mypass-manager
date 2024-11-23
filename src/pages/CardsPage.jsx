import React, { useEffect, useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import { firestore } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import CreateCard from "../create/CreateCard"; // Import CreateCard
import CardContainer from "../components/DataContainers/CardContainer";
import useShowToast from "../hooks/useShowToast";
import "../styles/Tab.css";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unmaskAll, setUnmaskAll] = useState(false); // State to control unmasking all cards
  const { uid } = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const userCardsCollectionRef = collection(
      firestore,
      `users/${uid}/creditCards`
    );
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
    }, 30000); // Hide after 30 seconds
  };

  return (
    <div className="tab-page">
      <Box>
        <Text as="h1" fontSize="4xl" mb={4}>
          My (Credit/Debit) Cards
        </Text>

        {/* Render CreateCard Modal */}
        <CreateCard onCardCreated={() => console.log("Card added")} />

        {/* Button to Unmask All Cards */}
        <Button onClick={handleUnmaskAll} colorScheme="blue" mb={4}>
          Unmask All Cards
        </Button>

        <Box mt={6}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : cards.length === 0 ? (
            <Text>No cards available</Text>
          ) : (
            <Flex direction="column" gap={4}>
              {cards.map((card) => (
                <CardContainer
                  key={card.id}
                  card={card}
                  uid={uid}
                  isUnmasked={unmaskAll} // Pass unmaskAll state to each CardContainer
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default CardsPage;

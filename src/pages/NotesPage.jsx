import React, { useEffect, useState } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import { firestore } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import CreateItem from "../create/CreateItem";
import NoteContainer from "../components/DataContainers/NoteContainer";
import useShowToast from "../hooks/useShowToast";
import "../styles/Tab.css";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unmaskAll, setUnmaskAll] = useState(false);
  const { uid } = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const userNotesCollectionRef = collection(firestore, `users/${uid}/notes`);
    const unsubscribe = onSnapshot(
      userNotesCollectionRef,
      (snapshot) => {
        const fetchedNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(fetchedNotes);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching notes:", error);
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
          My Notes
        </Text>
        <div className="buttons">
          <CreateItem collectionType="notes" onItemCreated={() => {}} />
          <button className="unmask-button" onClick={handleUnmaskAll}>
            Unmask All Notes
          </button>
        </div>
        <div className="all-cards-container">
          {isLoading ? (
            <Text>Loading...</Text>
          ) : notes.length === 0 ? (
            <Text>No notes available</Text>
          ) : (
            <Flex className="cards-container">
              {notes.map((note) => (
                <NoteContainer
                  key={note.id}
                  note={note}
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

export default NotesPage;

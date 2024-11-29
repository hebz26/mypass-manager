import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const useFirebase = () => {
  const db = getFirestore();

  const findUserByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        throw new Error("User not found");
      }

      const userData = querySnapshot.docs[0].data();
      console.log("User data fetched:", { email, userData });
      return { userData };
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  };

  const validateAnswer = async (email, questionField, answer) => {
    try {
      const { userData } = await findUserByEmail(email);
      console.log("Validating:", {
        questionField,
        expected: userData[questionField]?.trim().toLowerCase(),
        provided: answer.trim().toLowerCase(),
      });
      return (
        userData[questionField]?.trim().toLowerCase() ===
        answer.trim().toLowerCase()
      );
    } catch (error) {
      console.error("Error validating answer:", error);
      return false;
    }
  };

  const getPassword = async (email) => {
    try {
      const { userData } = await findUserByEmail(email);
      return userData.masterPassword;
    } catch (error) {
      console.error("Error retrieving password:", error);
      throw error;
    }
  };

  return {
    findUserByEmail,
    validateAnswer,
    getPassword,
  };
};

export default useFirebase;

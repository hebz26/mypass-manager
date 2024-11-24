import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);

  const signup = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      showToast("Error", "Please fill all the fields", "error");
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser && error) {
        showToast("Error", error.message, "error");
        return;
      }
      if (newUser) {
        const userDoc = {
          uid: newUser.user.uid,
          email: inputs.email,
          securityQuestions: [
            {
              question: inputs.securityQuestion1,
              answer: inputs.securityAnswer1,
            },
            {
              question: inputs.securityQuestion2,
              answer: inputs.securityAnswer2,
            },
            {
              question: inputs.securityQuestion3,
              answer: inputs.securityAnswer3,
            },
          ],
          preferences: {
            autoLockMinutes: 5,
            clipboardTimeout: 2,
          },
          ssn: "",
          licenseNumber: "",
          licenseExpiration: "",
          passportNumber: "",
          passportExpiration: "",
          createdAt: Date.now(),
          lastLogin: Date.now(),
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        if (userDoc) {
          localStorage.setItem("user-info", JSON.stringify(userDoc));
          loginUser(userDoc);
        } else {
          console.error("User document is invalid:", userDoc);
        }
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;

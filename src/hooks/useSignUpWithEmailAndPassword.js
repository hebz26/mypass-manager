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
          securityAnswer1: inputs.securityAnswer1,
          securityAnswer2: inputs.securityAnswer2,
          securityAnswer3: inputs.securityAnswer3,
          ssn: "",
          masterPassword: inputs.password,
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

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { PasswordBuilder, PasswordDirector } from "./PasswordBuilder"; // Import both PasswordBuilder and PasswordDirector
import useWeakPasswordObserver from "./WeakPasswordObserver"; // Import WeakPasswordObserver
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword"; // Assuming the signup hook

const Signup = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    securityAnswer1: "",
    securityAnswer2: "",
    securityAnswer3: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signup } = useSignUpWithEmailAndPassword();

  // using the WeakPasswordObserver hook to check for weak passwords
  const isWeakPassword = useWeakPasswordObserver(inputs.password);

  // passwoed generator logic using PasswordDirector and PasswordBuilder (Builder Pattern)
  const generateStrongPassword = () => {
    const passwordBuilder = new PasswordBuilder();
    const passwordDirector = new PasswordDirector(passwordBuilder);  // Create director with builder
    const generatedPassword = passwordDirector.buildStrongPassword();  // Build the password
    setInputs({ ...inputs, password: generatedPassword }); // Set the generated password
  };

  const handleSubmit = () => {
    // check if all necessary fields are filled
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.securityAnswer1 ||
      !inputs.securityAnswer2 ||
      !inputs.securityAnswer3
    ) {
      alert("Please fill all the fields.");
      return; // stip submission if any field is empty
    }

    // proceed with signup logic, passing inputs to the signup function
    signup(inputs);
  };

  return (
    <>
      <Input
        placeholder="Email"
        fontSize={14}
        type="email"
        size={"sm"}
        value={inputs.email}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
      />

      <InputGroup>
        <Input
          placeholder="Password"
          fontSize={14}
          type={showPassword ? "text" : "password"}
          value={inputs.password}
          size={"sm"}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        />
        <InputRightElement h="full">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      {/* weak password warning */}
      {isWeakPassword && (
        <Alert
          status="warning"
          fontSize={12}
          p={2}
          borderRadius={4}
          variant="subtle"
          colorScheme="yellow"
          mb={2}
        >
          <AlertIcon />
          Password must be at least 8 characters, with a mix of uppercase, lowercase, numbers, and symbols.
        </Alert>
      )}

      {/* password generator */}
      <Button
        onClick={generateStrongPassword}
        colorScheme="blue"
        size={"sm"}
        fontSize={14}
        variant="outline"
      >
        Suggest Strong Password
      </Button>

      <Input
        placeholder="What is your mother's maiden name?"
        fontSize={14}
        size={"sm"}
        value={inputs.securityAnswer1}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer1: e.target.value })
        }
      />
      <Input
        placeholder="What is the name of your first school?"
        fontSize={14}
        size={"sm"}
        value={inputs.securityAnswer2}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer2: e.target.value })
        }
      />
      <Input
        placeholder="What city were you born in?"
        fontSize={14}
        size={"sm"}
        value={inputs.securityAnswer3}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer3: e.target.value })
        }
      />

      {/* displays any signup error */}
      {error && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error.message}
        </Alert>
      )}

      <Button
        w={"full"}
        colorScheme="blue"
        size={"sm"}
        fontSize={14}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </>
  );
};

export default Signup;

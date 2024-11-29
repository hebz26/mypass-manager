import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  Select,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";
import PasswordBuilder from "../../utils/PasswordBuilder";
import WeakPasswordObserver from "../../utils/WeakPasswordObserver";

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

  // Observer pattern to warn about weak passwords
  const [passwordWarning, setPasswordWarning] = useState(null);

  useEffect(() => {
    const observer = new WeakPasswordObserver();
    observer.subscribe((message) => setPasswordWarning(message));
    observer.checkPassword(inputs.password);
    return () => observer.unsubscribe(); // Cleanup subscription
  }, [inputs.password]);

  const suggestPassword = () => {
    try {
      const builder = new PasswordBuilder()
        .setLength(12) // Customize length as needed
        .addUppercase()
        .addNumbers()
        .addSymbols();
      const strongPassword = builder.build();
      setInputs({ ...inputs, password: strongPassword });
      setPasswordWarning(null); // Clear any warnings for the suggested password
    } catch (error) {
      alert("Error generating password: " + error.message);
    }
  };

  const handleSubmit = () => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.securityAnswer1 ||
      !inputs.securityAnswer2 ||
      !inputs.securityAnswer3
    ) {
      alert("Please fill all the fields.");
      return;
    }

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

      <Button
        w={"full"}
        size={"sm"}
        fontSize={14}
        colorScheme="teal"
        onClick={suggestPassword}
      >
        Suggest Strong Password
      </Button>

      {passwordWarning && (
        <Alert status="warning" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {passwordWarning}
        </Alert>
      )}

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

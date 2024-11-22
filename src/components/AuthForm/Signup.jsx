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
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const Signup = () => {
  const securityQuestions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your favorite food?",
    "What is the name of your first school?",
  ];

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    securityQuestion1: "",
    securityAnswer1: "",
    securityQuestion2: "",
    securityAnswer2: "",
    securityQuestion3: "",
    securityAnswer3: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signup } = useSignUpWithEmailAndPassword();

  const handleSubmit = () => {
    // Check if all necessary fields are filled
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.securityAnswer1 ||
      !inputs.securityAnswer2 ||
      !inputs.securityAnswer3
    ) {
      // Show a toast or alert if fields are missing
      alert("Please fill all the fields.");
      return;
    }

    // Trigger signup with the inputs
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

      {/* Security Question 1 */}
      <Select
        placeholder="Select a security question"
        size={"sm"}
        value={inputs.securityQuestion1}
        onChange={(e) =>
          setInputs({ ...inputs, securityQuestion1: e.target.value })
        }
      >
        {securityQuestions.map((question, index) => (
          <option key={index} value={question}>
            {question}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Your answer"
        fontSize={14}
        size={"sm"}
        value={inputs.securityAnswer1}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer1: e.target.value })
        }
      />

      {/* Security Question 2 */}
      <Select
        placeholder="Select a security question"
        size={"sm"}
        value={inputs.securityQuestion2}
        onChange={(e) =>
          setInputs({ ...inputs, securityQuestion2: e.target.value })
        }
      >
        {securityQuestions.map((question, index) => (
          <option key={index} value={question}>
            {question}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Your answer"
        fontSize={14}
        size={"sm"}
        value={inputs.securityAnswer2}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer2: e.target.value })
        }
      />

      {/* Security Question 3 */}
      <Select
        placeholder="Select a security question"
        size={"sm"}
        value={inputs.securityQuestion3}
        onChange={(e) =>
          setInputs({ ...inputs, securityQuestion3: e.target.value })
        }
      >
        {securityQuestions.map((question, index) => (
          <option key={index} value={question}>
            {question}
          </option>
        ))}
      </Select>
      <Input
        placeholder="Your answer"
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

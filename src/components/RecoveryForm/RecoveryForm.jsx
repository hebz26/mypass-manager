import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Alert,
  AlertIcon,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import useFirebase from "../../hooks/useFirebase";
import { useNavigate } from "react-router-dom";

const RecoveryForm = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions] = useState([
    "What is your mother's maiden name?",
    "What is the name of your first school?",
    "What city were you born in?",
  ]);

  const firebase = useFirebase();
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setError("Email is required.");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const validateAnswer = () => {
    if (!currentAnswer) {
      setError("Answer cannot be empty.");
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async () => {
    setError("");
    if (!validateEmail()) return;

    try {
      console.log("Validating email...");
      const user = await firebase.findUserByEmail(email);
      if (!user) {
        throw new Error("Email not found.");
      }
      setStep("question");
      setQuestionIndex(0);
    } catch (err) {
      setError(err.message || "Error validating email.");
    }
  };

  const handleAnswerSubmit = async () => {
    setError("");
    if (!validateAnswer()) return;

    try {
      console.log(`Validating answer for question ${questionIndex + 1}...`);
      const isValid = await firebase.validateAnswer(
        email,
        `securityAnswer${questionIndex + 1}`,
        currentAnswer
      );

      if (!isValid) {
        throw new Error("Incorrect answer. Please try again.");
      }

      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1);
        setCurrentAnswer("");
      } else {
        const retrievedPassword = await firebase.getPassword(email);
        setPassword(`Your master password is: ${retrievedPassword}`);
        setStep("success");
      }
    } catch (err) {
      setError(err.message || "Error validating answer.");
    }
  };

  const handleReturnToLogin = () => {
    navigate("/auth");
  };

  const renderStepContent = () => {
    switch (step) {
      case "email":
        return (
          <>
            <Text mb={4} textAlign="center" fontSize="xl" fontWeight="bold">
              Recover Master Password
            </Text>
            <Input
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="sm"
            />
            <Button
              mt={4}
              colorScheme="blue"
              size="sm"
              onClick={handleEmailSubmit}
              width="full"
            >
              Submit Email
            </Button>
          </>
        );
      case "question":
        return (
          <>
            <Text mb={2}>
              {`Question ${questionIndex + 1} of ${questions.length}`}
            </Text>
            <Text mb={4}>{questions[questionIndex]}</Text>
            <Input
              placeholder="Enter your answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              size="sm"
            />
            <Button
              mt={4}
              colorScheme="blue"
              size="sm"
              onClick={handleAnswerSubmit}
              width="full"
            >
              Submit Answer
            </Button>
          </>
        );
      case "success":
        return (
          <>
            <Alert status="success" fontSize={14} borderRadius={4} p={2}>
              <AlertIcon />
              {password}
            </Alert>
            <Button
              mt={4}
              colorScheme="blue"
              size="sm"
              onClick={handleReturnToLogin}
              width="full"
            >
              Return to Login Page
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100vw"
      bg="gray.100"
      p={4}
      position="relative"
    >
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="link"
        colorScheme="blue"
        onClick={handleReturnToLogin}
        position="absolute"
        top={4}
        left={4}
        fontSize="lg"
        fontWeight="medium"
        color="blue.500"
      >
        Back to Login
      </Button>

      <Box
        w="full"
        maxW="400px"
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        p={8}
      >
        {error && (
          <Alert status="error" fontSize={14} borderRadius={4} p={2} mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        {renderStepContent()}
      </Box>
    </Flex>
  );
};

export default RecoveryForm;

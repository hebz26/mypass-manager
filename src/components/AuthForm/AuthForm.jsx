import { Box, Flex, Text, VStack, Divider } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100vw"
      bg="gray.100"
      p={4}
    >
      <Box
        w="full"
        maxW="400px"
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        p={8}
      >
        <VStack spacing={6} w="full">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {isLogin ? "Welcome Back" : "Join Us"}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {isLogin
              ? "Sign in to your account to continue."
              : "Create an account to get started."}
          </Text>

          {isLogin ? <Login /> : <Signup />}

          <Flex align="center" w="full" my={4}>
            <Divider borderColor="gray.300" />
            <Text
              fontSize="sm"
              color="gray.500"
              px={3}
              bg="white"
              zIndex={1}
              fontWeight="medium"
            >
              OR
            </Text>
            <Divider borderColor="gray.300" />
          </Flex>

          <Text fontSize="sm" color="gray.500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Text
              as="span"
              color="blue.500"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Text>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default AuthForm;

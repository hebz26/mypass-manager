import { Container, Flex, VStack, Box } from "@chakra-ui/react";
import AuthForm from "../components/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      <AuthForm />
    </Flex>
  );
};

export default AuthPage;

import { Flex } from "@chakra-ui/react";
import AuthForm from "../components/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"}>
      <AuthForm />
    </Flex>
  );
};

export default AuthPage;

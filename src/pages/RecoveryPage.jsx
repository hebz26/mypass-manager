import { Flex } from "@chakra-ui/react";
import RecoveryForm from "../components/RecoveryForm/RecoveryForm";

const RecoveryPage = () => {
  return (
    <Flex
      minH={"100vh"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <RecoveryForm />
    </Flex>
  );
};

export default RecoveryPage;

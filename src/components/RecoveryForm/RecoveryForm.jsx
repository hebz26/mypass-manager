import { Box, Flex } from "@chakra-ui/react";

const RecoveryForm = () => {
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
        Write the form here.
      </Box>
    </Flex>
  );
};

export default RecoveryForm;

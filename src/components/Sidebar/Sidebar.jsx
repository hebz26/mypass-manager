import { Box, Button, Flex, VStack, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const Sidebar = () => {
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <Box
      as="nav"
      w="250px"
      h="100vh"
      bg="gray.100"
      color="black"
      position="fixed"
      left="0"
      top="0"
      p="4"
      display="flex"
      flexDirection="column"
    >
      {/* Sidebar Header */}
      <Box mb="6" textAlign="center">
        <Text fontSize="xl" fontWeight="bold" color="blue.600">
          MyPass
        </Text>
      </Box>

      {/* Sidebar Links */}
      <VStack spacing={4} align="stretch">
        <Link
          as={RouterLink}
          to="/"
          p="2"
          borderRadius="md"
          _hover={{ bg: "blue.200", color: "black" }}
          _active={{ bg: "blue.300" }}
        >
          Home
        </Link>
        <Link
          as={RouterLink}
          to="/logins"
          p="2"
          borderRadius="md"
          _hover={{ bg: "blue.200", color: "black" }}
          _active={{ bg: "blue.300" }}
        >
          Logins
        </Link>
        <Link
          as={RouterLink}
          to="/identity"
          p="2"
          borderRadius="md"
          _hover={{ bg: "blue.200", color: "black" }}
          _active={{ bg: "blue.300" }}
        >
          Identity
        </Link>
        <Link
          as={RouterLink}
          to="/cards"
          p="2"
          borderRadius="md"
          _hover={{ bg: "blue.200", color: "black" }}
          _active={{ bg: "blue.300" }}
        >
          Cards
        </Link>
        <Link
          as={RouterLink}
          to="/secure-notes"
          p="2"
          borderRadius="md"
          _hover={{ bg: "blue.200", color: "black" }}
          _active={{ bg: "blue.300" }}
        >
          Secure Notes
        </Link>
      </VStack>

      {/* Logout Button */}
      <Flex mt="auto" pt="4" borderTop="1px solid lightgray">
        <Button
          leftIcon={<BiLogOut />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          w="full"
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default Sidebar;

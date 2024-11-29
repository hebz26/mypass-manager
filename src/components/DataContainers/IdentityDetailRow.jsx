import React from "react";
import { Box, Flex, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { ProxyData, RealData } from "../proxy/DataClasses";
import useCopyToClipboard from "../../hooks/useCopyToClipboard"; // Make sure you're using the hook

const IdentityDetailRow = ({ label, value, isUnmasked }) => {
  const realData = new RealData(value);
  const proxyData = new ProxyData(realData);

  const displayValue = isUnmasked ? proxyData.unmask() : proxyData.mask();
  const { copyToClipboard } = useCopyToClipboard(); // Using the custom hook

  return (
    <Box mt={4}>
      <Flex alignItems="center">
        <Text fontWeight="bold" width={200}>
          {label}:
        </Text>
        <Flex alignItems="center">
          <Text fontSize="lg" color="gray.700" mr={2}>
            {displayValue}
          </Text>
          <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
            <IconButton
              icon={<Text>📋</Text>} // Clipboard icon using Text
              onClick={() => copyToClipboard(displayValue)} // Copy the display value
              size="sm"
              variant="ghost"
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default IdentityDetailRow;

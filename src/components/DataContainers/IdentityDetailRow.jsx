import React, { useState, useEffect } from "react";
import { Box, Flex, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { ProxyData, RealData } from "../proxy/DataClasses";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import { ExpirationNotifier, DateObserver } from "../observer-exp/Exp-Observer";

const IdentityDetailRow = ({ label, value, isUnmasked }) => {
  const realData = new RealData(value);
  const proxyData = new ProxyData(realData);

  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const { copyToClipboard } = useCopyToClipboard();

  // Apply the observer pattern if the label includes "expir"
  useEffect(() => {
    if (label.toLowerCase().includes("expir")) {
      const expirationNotifier = new ExpirationNotifier();
      const dateObserver = new DateObserver(setIsExpiringSoon);
      expirationNotifier.registerObserver(dateObserver);
      expirationNotifier.setExpirationDate(value); // Set the expiration date

      return () => {
        expirationNotifier.unregisterObserver(dateObserver); // Clean up observer on unmount
      };
    }
  }, [label, value]);

  const displayValue = isUnmasked ? proxyData.unmask() : proxyData.mask();

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
          {isExpiringSoon && (
            <Text fontSize="lg" color="red.500">
              Expiring soon
            </Text>
          )}
          <Tooltip label="Copy to Clipboard" aria-label="Copy to Clipboard">
            <IconButton
              icon={<Text>📋</Text>}
              onClick={() => copyToClipboard(displayValue)}
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

import React, { useState, useEffect } from "react";
import { Flex, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { ExpirationNotifier, DateObserver } from "../observer-exp/Exp-Observer";

const CardDetailRow = ({ label, value, isUnmasked, maskedValue, onCopy }) => {
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

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

  // Determine the value to display, either masked or unmasked
  const displayValue = isUnmasked ? value : maskedValue;

  return (
    <Flex mt={4} justifyContent="space-between" alignItems="center">
      <Text fontWeight="bold">{label}:</Text>
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
          <IconButton icon={<Text>📋</Text>} onClick={onCopy} size="sm" />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default CardDetailRow;

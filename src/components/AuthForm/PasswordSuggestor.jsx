import React from "react";
import PasswordBuilder from "./PasswordBuilder";

const PasswordSuggestor = ({ onPasswordGenerate }) => {
  const suggestPassword = () => {
    const passwordBuilder = new PasswordBuilder();
    const strongPassword = passwordBuilder
      .setLength(12)
      .addUppercase()
      .addNumbers()
      .addSymbols()
      .build();

    onPasswordGenerate(strongPassword.password);
  };

  return (
    <Button
      colorScheme="teal"
      size="sm"
      fontSize={14}
      onClick={suggestPassword}
    >
      Suggest Strong Password
    </Button>
  );
};

export default PasswordSuggestor;

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

// Password validation regex for strong passwords
const passwordValidationRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Password strength levels
const passwordStrengthLevels = {
  weak: { color: "red", label: "Weak" },
  medium: { color: "yellow", label: "Medium" },
  strong: { color: "green", label: "Strong" },
};

const generateStrongPassword = () => {
  const length = 12; // Password length
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numericChars = "0123456789";
  const specialChars = "@$!%*?&";
  
  // Combine all character sets
  const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;
  
  // Ensure the password meets the requirements by adding at least one character from each set
  let password = "";
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += numericChars[Math.floor(Math.random() * numericChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest of the password length with random characters from all sets
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to ensure randomness
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  
  return password;
};

const Signup = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    securityAnswer1: "",
    securityAnswer2: "",
    securityAnswer3: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // For password validation error
  const [passwordStrength, setPasswordStrength] = useState(""); // For password strength
  const [generatedPassword, setGeneratedPassword] = useState(""); // For generated password

  const { loading, error, signup } = useSignUpWithEmailAndPassword();

  // Handle password input change and update password strength
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setInputs({ ...inputs, password });
    checkPasswordStrength(password);
  };

  // Check the strength of the password
  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (passwordValidationRegex.test(password)) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  };

  // Handle submit form
  const handleSubmit = () => {
    // Check if all fields are filled out
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.securityAnswer1 ||
      !inputs.securityAnswer2 ||
      !inputs.securityAnswer3
    ) {
      alert("Please fill all the fields.");
      return;
    }

    // Check if the password is strong
    if (!passwordValidationRegex.test(inputs.password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters."
      );
      return;
    }

    // Reset password error if password is valid
    setPasswordError("");

    // Trigger signup with the input data
    signup(inputs);
  };

  // Handle password generation
  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setInputs({ ...inputs, password: newPassword });
    setGeneratedPassword(newPassword);
    setPasswordStrength(""); // Reset password strength after generation
  };

  return (
    <>
      <Input
        placeholder="Email"
        fontSize={14}
        type="email"
        size="sm"
        value={inputs.email}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        mb={3}
      />

      {/* Password guidelines message */}
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "gray" }}>
        To consider your password strong, it should:
        <ul style={{ margin: "5px 0 5px 20px", fontSize: "12px" }}>
          <li>Contain at least 8 characters</li>
          <li>Include both uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character (e.g., @$!%*?&)</li>
        </ul>
      </div>

      <InputGroup mb={3}>
        <Input
          placeholder="Password"
          fontSize={14}
          type={showPassword ? "text" : "password"}
          value={inputs.password}
          size="sm"
          onChange={handlePasswordChange}
        />
        <InputRightElement h="full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      {/* Password strength indicator */}
      {inputs.password && (
        <Progress
          value={passwordStrength === "strong" ? 100 : passwordStrength === "medium" ? 60 : 30}
          colorScheme={passwordStrengthLevels[passwordStrength]?.color}
          size="sm"
          mb={3}
        />
      )}

      {/* Password strength label */}
      {passwordStrength && (
        <div style={{ color: passwordStrengthLevels[passwordStrength]?.color, marginBottom: "8px" }}>
          {passwordStrengthLevels[passwordStrength]?.label}
        </div>
      )}

      {passwordError && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4} mb={3}>
          <AlertIcon fontSize={12} />
          {passwordError}
        </Alert>
      )}

      {/* Security Questions */}
      <Input
        placeholder="What is your mother's maiden name?"
        fontSize={14}
        size="sm"
        value={inputs.securityAnswer1}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer1: e.target.value })
        }
        mb={3}
      />
      <Input
        placeholder="What is the name of your first school?"
        fontSize={14}
        size="sm"
        value={inputs.securityAnswer2}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer2: e.target.value })
        }
        mb={3}
      />
      <Input
        placeholder="What city were you born in?"
        fontSize={14}
        size="sm"
        value={inputs.securityAnswer3}
        onChange={(e) =>
          setInputs({ ...inputs, securityAnswer3: e.target.value })
        }
        mb={3}
      />

      {/* Password Generation Button (below Password input) */}
      <Button
        size="sm"
        colorScheme="teal"
        onClick={handleGeneratePassword}
        mb={3}
      >
        Generate Strong Password
      </Button>
      {generatedPassword && (
        <Input
          value={generatedPassword}
          isReadOnly
          fontSize={14}
          mb={3}
        />
      )}

      <Button
        isLoading={loading}
        loadingText="Signing up..."
        onClick={handleSubmit}
        colorScheme="blue"
        size="sm"
      >
        Sign Up
      </Button>

      {/* Error message */}
      {error && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4} mt={3}>
          <AlertIcon fontSize={12} />
          {error.message || "An error occurred."}
        </Alert>
      )}
    </>
  );
};

export default Signup;


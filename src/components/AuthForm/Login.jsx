import { Alert, AlertIcon, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin.js";

// Abstract Mediator
class AbstractMediator {
  registerColleague(name, colleague) {
    throw new Error(
      "registerColleague method must be implemented by subclass."
    );
  }

  notify(name, value) {
    throw new Error("notify method must be implemented by subclass.");
  }
}

// Abstract Colleague
class Colleague {
  constructor(mediator) {
    this.mediator = mediator;
  }

  notifyMediator() {
    throw new Error("notifyMediator method must be implemented by subclass.");
  }
}

// Concrete Mediator
class Mediator extends AbstractMediator {
  constructor() {
    super();
    this.colleagues = {};
    this.inputs = {};
    this.onStateChange = null;
  }

  registerColleague(name, colleague) {
    this.colleagues[name] = colleague;
    this.inputs[name] = colleague.value;
  }

  notify(name, value) {
    this.inputs[name] = value;
    this._evaluateState();
  }

  _evaluateState() {
    if (this.onStateChange) {
      const allFilled = Object.values(this.inputs).every(
        (input) => input !== ""
      );
      this.onStateChange(allFilled);
    }
  }
}

// Concrete Colleague: InputField
class InputField extends Colleague {
  constructor(mediator, name, value) {
    super(mediator);
    this.name = name;
    this.value = value;
  }

  setValue(value) {
    this.value = value;
    this.notifyMediator();
  }

  notifyMediator() {
    this.mediator.notify(this.name, this.value);
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { loading, error, login } = useLogin();

  const mediator = new Mediator();

  // Instantiate Colleagues
  const emailField = new InputField(mediator, "email", email);
  const passwordField = new InputField(mediator, "password", password);

  // Register colleagues with the mediator
  mediator.registerColleague("email", emailField);
  mediator.registerColleague("password", passwordField);

  // Set state change callback
  mediator.onStateChange = (allFilled) => {
    setIsButtonDisabled(!allFilled);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    emailField.setValue(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    passwordField.setValue(value);
  };

  return (
    <>
      <Input
        name="email"
        placeholder="Email"
        fontSize={14}
        type="email"
        size="sm"
        value={email}
        onChange={handleEmailChange}
      />
      <Input
        name="password"
        placeholder="Password"
        fontSize={14}
        size="sm"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      {error && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error.message}
        </Alert>
      )}
      <Button
        w="full"
        colorScheme="blue"
        size="sm"
        fontSize={14}
        isLoading={loading}
        isDisabled={isButtonDisabled}
        onClick={() => login({ email, password })}
      >
        Log in
      </Button>
    </>
  );
};

export default Login;

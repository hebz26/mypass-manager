import React from "react";
import "../styles/Home.css";

const HomePage = () => {
  return (
    <div className="container">
      <img src="lock.png" alt="lock icon" width={100} />
      <h1 className="title">Welcome to Your Secure Vault</h1>
      <p className="paragraph1">
        Your personal vault is here to safeguard all your sensitive information
        in one secure and easily accessible location.{" "}
        <span>
          Use the sidebar to navigate through the different sections and choose
          where you'd like to manage your data.
        </span>{" "}
        Whether it's login credentials, payment card details, identity
        documents, or essential notes, you can organize and store it all with
        peace of mind.
      </p>
      <p className="paragraph2">
        Our vault is designed with your privacy and convenience in mind,
        featuring robust encryption to protect your data and intuitive tools for
        seamless management. You can rely on the vault to help you stay
        organized while ensuring that your sensitive information remains
        confidential.
      </p>
      <p className="paragraph2">
        <span>
          Your data will be masked by default for an added layer of security,
          and you’ll have the option to unmask it temporarily for easy copying
          or reference. After one minute, the data will automatically re-mask,{" "}
        </span>
        ensuring your privacy is maintained.
      </p>
      <p className="paragraph2">
        In addition to its security features, the vault offers a streamlined
        user experience. Categories like logins, payment methods, and identity
        details make it simple to locate, add, and update your stored
        information. With just a few clicks, you can access or modify your data,
        keeping everything up-to-date.
      </p>
    </div>
  );
};

export default HomePage;

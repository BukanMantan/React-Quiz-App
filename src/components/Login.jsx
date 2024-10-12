import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Login component to handle user login and registration
const Login = () => {
  const [username, setUsername] = useState(""); // Stores the entered username
  const [password, setPassword] = useState(""); // Stores the entered password
  const [error, setError] = useState(""); // Stores error messages (e.g., invalid password)
  const [passwordVisible, setPasswordVisible] = useState(false); // Controls whether the password is visible

  const navigate = useNavigate(); // Hook for navigating between pages

  // useEffect hook to log all users stored in localStorage when the page loads
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve users from localStorage or initialize as an empty array
    console.log("All registered users:");
    users.forEach((user, index) => {
      console.log(
        `User ${index + 1}: Username = ${user.username}, Password = ${
          user.password
        }`
      ); // Log each user’s details
    });
  }, []);

  // Function to validate if the password meets the required criteria
  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Requires at least 8 characters, 1 number, 1 special character
    return regex.test(password); // Returns true if the password matches the criteria
  };

  // Function to handle user login or registration
  const handleLogin = () => {
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include at least 1 number, and 1 special character."
      ); // Displays error if the password doesn't meet criteria
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve users from localStorage

    // Check if the username already exists
    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
      // If user exists, check if the password matches
      if (existingUser.password === password) {
        console.log("Login successful");
        localStorage.setItem("currentUser", username); // Save the current user to localStorage
        navigate("/quiz"); // Navigate to the quiz page after successful login
      } else {
        setError("Incorrect password. Please try again."); // Display error for wrong password
      }
    } else {
      // If user does not exist, register a new user
      const newUser = { username, password }; // Create a new user object
      users.push(newUser); // Add the new user to the users array
      localStorage.setItem("users", JSON.stringify(users)); // Store updated users array in localStorage
      localStorage.setItem("currentUser", username); // Save the current user to localStorage
      navigate("/quiz"); // Navigate to the quiz page
    }
  };

  // Function to toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggles between showing and hiding the password
  };

  return (
    <div className="login-container">
      <h2>Login to Start the Quiz</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username} // Binds the input field to the username state
        onChange={(e) => setUsername(e.target.value)} // Updates the username state when the user types
        className="input-field"
      />
      <div className="password-container">
        <input
          type={passwordVisible ? "text" : "password"} // Toggles between plain text and password masking
          placeholder="Enter your password"
          value={password} // Binds the input field to the password state
          onChange={(e) => setPassword(e.target.value)} // Updates the password state when the user types
          className="input-field"
        />
        <button
          type="button"
          className="eye-btn"
          onClick={togglePasswordVisibility} // Toggles password visibility when the button is clicked
        >
          {passwordVisible ? "Hide Password" : "Show Password"}
        </button>
      </div>
      <button
        onClick={handleLogin} // Calls the login function when clicked
        className="login-btn"
        disabled={!username || !password} // Disables the button if either username or password is empty
      >
        Login
      </button>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Displays error messages if there is any */}
    </div>
  );
};

export default Login; // Exporting the Login component for use in other parts of the app

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    console.log("All registered users:");
    users.forEach((user, index) => {
      console.log(
        `User ${index + 1}: Username = ${user.username}, Password = ${
          user.password
        }`
      );
    });
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = () => {
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include at least 1 number, and 1 special character."
      );
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
      if (existingUser.password === password) {
        console.log("Login successful");
        localStorage.setItem("currentUser", username);
        navigate("/quiz");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } else {
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);
      navigate("/quiz");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      <h2>Login to Start the Quiz</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <div className="password-container">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button
          type="button"
          className="eye-btn"
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? "Hide Password" : "Show Password"}
        </button>
      </div>
      <button
        onClick={handleLogin}
        className="login-btn"
        disabled={!username || !password}
      >
        Login
      </button>
      {error && <p className="error-message">{error}</p>}{" "}
    </div>
  );
};

export default Login;

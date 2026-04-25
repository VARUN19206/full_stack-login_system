import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register";

    const dataToSend = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : formData;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        // 👉 After successful login
        if (isLogin) {
          setIsLoggedIn(true);
          setUsername(data.user.name); // from backend
        }

        // reset form
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      setMessage("Server error");
    }
  }

  // 🔥 AFTER LOGIN SCREEN
  if (isLoggedIn) {
    return (
      <div className="welcome-container">
        <h1>
          Hello {username} 👋 <br />
          Welcome to Chitradurga
        </h1>

        <button
          className="logout-btn"
          onClick={() => setIsLoggedIn(false)}
        >
          Logout
        </button>
      </div>
    );
  }

  // 🔐 LOGIN / REGISTER SCREEN
  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="message">{message}</p>

        <p className="switch-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default App;
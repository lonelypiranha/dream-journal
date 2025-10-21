import logo from "./static/logo.png";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "./signUp";
import "./auth.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function SignIn(props) {
  const [valid, setValid] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    document.getElementById("see").checked = false;
  }
  const showPassword = () => {
    let typePass = document.getElementById("password");

    if (typePass.type === "password") {
      typePass.type = "text";
    } else {
      typePass.type = "password";
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    document.getElementById("see").checked = false;

    try {
      const result = await fetch(`${API_BASE_URL}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (result.status == 404) {
        setValid(false);
        setError("User not found");
      } else if (result.status == 401) {
        setValid(false);
        setError("Incorrect password");
      } else if (!result.ok) {
        setValid(false);
        throw new Error(`HTTP error! Status: ${result.status}`);
      } else {
        setValid(true);
        const resultParsed = await result.json();
        props.setUser(resultParsed.data.user);
        localStorage.setItem("token", resultParsed.data.token);

        const result2 = await fetch(`${API_BASE_URL}/api/v1/dbOperations/dbFetchDream`, {
          headers: { Authorization: `Bearer ${resultParsed.data.token}` },
        });
        if (result2.ok) {
          const dreams = await result2.json();
          props.setDreams([]);
          for (let i = 0; i < dreams.dreamList.length; i++) {
            props.setDreams((prevDreams) => [
              dreams.dreamList[i],
              ...prevDreams,
            ]);
          }
        }

        navigate("/Profile");
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <header className="App-header">
        <img id="logo" alt="logo" src={logo} />
        Traumerei
      </header>
      <div className="signInUp">
        <p className="Sign">Sign In</p>
        {!valid && <div className="warning">{error}</div>}
        <div className="formDIV">
          <form className="signUpForm" onSubmit={handleSubmit}>
            <label id="labelEmail" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required={true}
              placeholder="example@gmail.com"
            ></input>
            <label id="labelPassword" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required={true}
              placeholder="123123"
              onChange={handleChange}
            ></input>
            <label id="labelSee">
              <input
                type="checkbox"
                name="see"
                id="see"
                required={false}
                onClick={showPassword}
              ></input>
              Show password
            </label>
            <button class="signInButton">Sign In</button>
          </form>
          <p className="noAccount">
            Don't have an account?{" "}
            <Link to="/SignUp">
              <span className="signHyperlink">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignIn;

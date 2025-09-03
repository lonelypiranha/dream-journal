import { Routes, Route } from "react-router-dom";
import SignIn from "./signIn";
import SignUp from "./signUp";
import Community from "./Community";
import Dreams from "./Dreams";
import AddDream from "./AddDream";
import Statistics from "./Statistics";
import Profile from "./Profile";
import FullAnalysis from "./FullAnalysis";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [dreams, setDreams] = useState([]);
  const [user, setUser] = useState({});
  const colors = {
    Drama: "#147e74",
    Adventure: "#a21939",
    Horror: "#6e417c",
    Fantasy: "#192849",
    "Science Fiction": "#2868c6",
    Comedy: "#b5d17d",
    Realistic: "#e2c372",
    Abstract: "#6eb687",
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newUser = await fetch("/api/v1/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (newUser.ok) {
      const newUserJSON = await newUser.json();

      setUser(newUserJSON.data);
    }

    const result = await fetch("/api/v1/dbOperations/dbFetchDream", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.ok) {
      const dreams = await result.json();
      for (let i = 0; i < dreams.dreamList.length; i++) {
        setDreams((prevDreams) => [
        dreams.dreamList[i],
          ...prevDreams,
        ]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<SignIn setUser={setUser} setDreams={setDreams} />}
        ></Route>
        <Route
          path="/SignUp"
          element={<SignUp setUser={setUser} setDreams={setDreams} />}
        ></Route>
        <Route path="/Community" element={<Community />}></Route>
        <Route
          path="/Dreams"
          element={<Dreams colors={colors} dreams={dreams} setDreams={setDreams}/>}
        ></Route>
        <Route
          path="/AddDream"
          element={<AddDream setDreams={setDreams} user={user} />}
        ></Route>
        <Route path="/Statistics" element={<Statistics />}></Route>
        <Route path="Profile" element={<Profile user={user} setUser={setUser} setDreams={setDreams}/>}></Route>
        <Route path="/FullAnalysis" element={<FullAnalysis />}></Route>
      </Routes>
    </div>
  );
}

export default App;

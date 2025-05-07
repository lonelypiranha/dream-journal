import { Routes, Route } from "react-router-dom"
import Community from "./Community"
import Dreams from "./Dreams"
import AddDream from "./AddDream"
import Statistics from "./Statistics"
import Profile from "./Profile"
import FullAnalysis from "./FullAnalysis"
import { useState } from "react"

function App() {
    const [dreams, setDreams] = useState([]);
    const colors = {
        "Drama": "#147e74",
        "Adventure": "#a21939",
        "Horror": "#6e417c",
        "Fantasy": "#192849",
        "Science Fiction": "#2868c6",
        "Comedy": "#b5d17d",
        "Realistic": "#eddbad",
        "Abstract": "#6eb687"
    }

  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Community />}></Route>
            <Route path="/Dreams" element={<Dreams colors={colors} dreams={dreams}/>}></Route>
            <Route path="/AddDream" element={<AddDream setDreams={setDreams}/>}></Route>
            <Route path="/Statistics" element={<Statistics />}></Route>
            <Route path="Profile" element={<Profile />}></Route>
            <Route path="/FullAnalysis" element={<FullAnalysis />}></Route>
        </Routes>

    </div>
  );
}

export default App;

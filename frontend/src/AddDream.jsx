import HeaderAndNavBar from "./HeaderAndNavBar";
import analyze from "./static/search.png";
import save from "./static/save.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./AddDream.css";
import test from "./static/tesimg.png";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function AddDream(props) {
  let navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState("Analyze Dream");
  const [saved, setSaved] = useState(0);
  const [saveButton, setSaveButton] = useState("Save Dream");
  const [dream, setDream] = useState({});
  const AIResponse = useRef(null);

  useEffect(() => {
    setSaved(0);
    setSaveButton("Save Dream");
  }, [dream.dreamAnalysis, dream.dreamContent, dream.dreamTitle]);

  useEffect(() => {
    if (dream.dreamAnalysis !== "" && AIResponse.current !== null) {
      const yCoord =
        AIResponse.current.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: yCoord,
        behavior: "smooth",
      });
    }
  }, [dream.dreamAnalysis]);

  const responseGenerate = async (prompt, title) => {
    const result = await fetch(`${API_BASE_URL}/api/v1/aiResponse/aiAnalysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    if (result.ok) {
      const airespond = await result.json(); // Parse the JSON response body
      console.log(airespond);
      setDream((prevDream) => ({
        ...prevDream,
        dreamContent: prompt,
        dreamAnalysis: airespond.result1,
        dreamGenre: airespond.result2,
        dreamTitle: title,
        dreamImage: airespond.image,
      }));
      setSubmitStatus("Submit");
    } else {
      setSubmitStatus("Retry");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitStatus("Waiting");
    const formData = new FormData(e.currentTarget);
    responseGenerate(formData.get("dreamDesc"), formData.get("dreamTitle"));
  }

  async function saveDream() {
    if (!saved) {
      setSaveButton("Saving...");
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveButton("Unable to save");
        return;
      }
      const result = await fetch(`${API_BASE_URL}/api/v1/dbOperations/dbAddDream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dreamContent: dream.dreamContent,
          dreamTitle: dream.dreamTitle,
          dreamGenre: dream.dreamGenre,
          dreamAnalysis: dream.dreamAnalysis,
          dreamImage: dream.dreamImage,
        }),
      });

      if (result.ok) {
        const dreamJSON = await result.json();
        setSaved(1);
        setSaveButton("Dream Saved!");
        props.setDreams((prevDreams) => [dreamJSON.data[0], ...prevDreams]);
        props.setUser(dreamJSON.updatedUser);
      } else {
        setSaveButton("Unable to save");
      }
    } else {
      alert("Dream already saved!");
    }
  }

  return (
    <>
      <HeaderAndNavBar />

      <form onSubmit={handleSubmit} className="dreamDescription">
        <label id="label1" htmlFor="title">
          Enter a title for your dream:
        </label>
        <input
          name="dreamTitle"
          id="title"
          required={true}
          placeholder="My Dream"
        ></input>
        <label id="label2" htmlFor="desc">
          Describe your dream:
        </label>
        <textarea
          name="dreamDesc"
          id="desc"
          required={true}
          placeholder="I dreamed I was flying..."
        ></textarea>
        <button class="analyzeButton">
          <img class="analyzeIcon" src={analyze} alt="analyze dream" />
          {submitStatus}
        </button>
      </form>
      {dream.dreamAnalysis && dream.dreamGenre && (
        <>
          <div id="AI" ref={AIResponse}>
            {dream.dreamAnalysis}
            <p>Genre: {dream.dreamGenre}</p>
            {dream.dreamImage && (
              <img
                id="aiImg"
                src={`data:image/png;base64,${dream.dreamImage}`}
              />
            )}
          </div>
          <button class="analyzeButton" onClick={saveDream}>
            <img class="analyzeIcon" src={save} alt="save dream" />
            {saveButton}
          </button>
        </>
      )}
    </>
  );
}

export default AddDream;

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
  }, [dream.dreamAnalysis, dream.dreamContent, dream.dreamTitle])

  useEffect(() => {
    if (dream.dreamAnalysis !== "" && AIResponse.current !== null) {
        const yCoord = AIResponse.current.getBoundingClientRect().top + window.scrollY
        window.scroll({
            top: yCoord,
            behavior: "smooth"
        })
    }
}, [dream.dreamAnalysis])

  const responseGenerate = async (prompt, title) => {
    // const result = await fetch("/api/ai", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({input: prompt})
    //   })

    //   if (result.ok) {
    //     const airespond = await result.json(); // Parse the JSON response body
    //     console.log(airespond);
    // setDream((prevDream) => ({
    //              ...prevDream,
    //              dreamContent: prompt,
    //              dreamAnalysis: airespond.result1,
    //              dreamGenre: airespond.result2,
    //              dreamTitle: title,
    //         }))
    //     setSubmitStatus("Submit");
    //     props.setDreams(prevDreams => [{dreamContent: prompt,
    //         dreamAnalysis: airespond.result1, dreamGenre: airespond.result2}, ...prevDreams])
    //   } else {
    //     setSubmitStatus("Retry");
    //   }



    const result = await fetch("/api/v1/dbOperations/dbAddDream", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({dreamContent: prompt, dreamTitle: title, dreamGenre: title, dreamAnalysis: prompt, dreamImage: test})
      });

      if (result.ok) {
        const airespond = await result.json(); // Parse the JSON response body
        setSubmitStatus("Submit");
      } else {
        setSubmitStatus("Retry");
      }
    
    setDream((prevDream) => ({
      ...prevDream,
      dreamContent: prompt,
      dreamAnalysis: prompt,
      dreamGenre: "Science",
      dreamTitle: title,
      dreamImage: test,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitStatus("Waiting");
    const formData = new FormData(e.currentTarget);
    responseGenerate(formData.get("dreamDesc"), formData.get("dreamTitle"));
  }

  function saveDream() {
    if (!saved) {
        setSaved(1);
        setSaveButton("Dream Saved!");
        props.setDreams((prevDreams) => [
            dream,
            ...prevDreams,
          ]);
    }
    else {
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
            {dream.dreamImage && <img id="aiImg" src={dream.dreamImage} />}
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

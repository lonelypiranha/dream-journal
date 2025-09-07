import HeaderAndNavBar from "./HeaderAndNavBar";
import { useLocation } from "react-router-dom";
import "./FullPost.css";

function FullPost() {
  const location = useLocation();

  const postedDate = location.state.postedDate;
  const newDate = new Date(postedDate);
  const formattedDate = newDate.toDateString();

  return (
    <>
      <HeaderAndNavBar />
      <h1 className="DA">Dream Analysis</h1>
      <div id="AI2">
        <p id="usernamePost">{location.state.username} posted:</p>
        <p id='title2'>{location.state.title}</p>
        <p className='descC'>{formattedDate}</p>
        <p class='descB'>Genre: {location.state.genre}</p>
        <img id="aiImg2" src={`data:image/png;base64,${location.state.image}`} />
        <p class='descA'>{location.state.content}</p>
        <p class='descB'>AI Analysis: </p>
        <p class='descA'>{location.state.analysis}</p>
        
      </div>
    </>
  );
}

export default FullPost;

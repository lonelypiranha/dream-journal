import HeaderAndNavBar from "./HeaderAndNavBar";
import Dropdown from "./Dropdown";
import FullAnalysis from "./FullAnalysis";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Dreams.css";

function Dreams(props) {
  const dreamEntries = props.dreams.map((dr) => {
    let color = { backgroundColor: props.colors[dr.genre] };

    let titleCol;
    let descCol;
    let dateColor;
    let bright;
    if (
      dr.genre === "Adventure" ||
      dr.genre === "Drama" ||
      dr.genre === "Fantasy" ||
      dr.genre === "Science Fiction" ||
      dr.genre === "Horror"
    ) {
      titleCol = "brightTitle";
      descCol = "brightDesc";
      dateColor = "brightDate";
      bright = true;
    } else {
      titleCol = "darkTitle";
      descCol = "darkDesc";
      dateColor = "darkDate";
      bright = false;
    }

    const createDate = dr.createdAt;
    const newDate = new Date(createDate);
    const formattedDate = newDate.toLocaleDateString("en-GB");

    return (
      <div style={{ position: "relative" }}>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to="/FullAnalysis"
          state={dr
          }
        >
          <span style={color} className="entry">
            <p className={dateColor}>{formattedDate}</p>
            <p className={titleCol}>{dr.title}</p>
            <p className={descCol}>Genre: {dr.genre} </p>
            <p className={descCol}>{dr.content} </p>
          </span>
        </Link>
        <Dropdown brightness={bright} dream={dr} dreams={props.dreams} setDreams={props.setDreams}/>
      </div>
    );
  });
  return (
    <div className="contents">
      <HeaderAndNavBar />
      {dreamEntries}
      {props.dreams.length == 0 && (
        <h2 id="noDreams">There are no dreams posted yet.</h2>
      )}
    </div>
  );
}

export default Dreams;

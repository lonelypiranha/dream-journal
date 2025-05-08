import HeaderAndNavBar from './HeaderAndNavBar';
import FullAnalysis from "./FullAnalysis"
import {useLocation} from 'react-router-dom';
import {Link} from "react-router-dom";
import './Dreams.css';

function Dreams(props) {
    const dreamEntries = props.dreams.map((dr) => {
    let color = { backgroundColor: props.colors[dr.dreamGenre] };


    let titleCol;
    let descCol;
    if (dr.dreamGenre === "Adventure" || dr.dreamGenre === "Drama" || dr.dreamGenre === "Fantasy" || dr.dreamGenre === "Science Fiction" || dr.dreamGenre === "Horror") {
        titleCol = "brightTitle";
        descCol = "brightDesc";
    }
    else {
        titleCol = "darkTitle";
        descCol = "darkDesc";
    }

    


    return <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/FullAnalysis" state={{content: dr.dreamContent, genre: dr.dreamGenre, analysis: dr.dreamAnalysis, title: dr.dreamTitle, image: dr.dreamImage}}>
    <span style={color} className='entry'>
        <p className={titleCol}>{dr.dreamTitle} </p>
        <p className={descCol}>Genre: {dr.dreamGenre} </p>
        <p className={descCol}>{dr.dreamContent} </p>
    </span>
    </Link> }
    );
  return (
    <div className='contents'>
    <HeaderAndNavBar />
    {dreamEntries}
    {props.dreams.length == 0 && <h2 id="noDreams">There are no dreams posted yet.</h2>}
    </div>
  );
}

export default Dreams;

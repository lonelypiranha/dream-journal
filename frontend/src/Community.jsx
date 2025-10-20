import HeaderAndNavBar from './HeaderAndNavBar';
import { useState } from "react";
import { useEffect } from "react";
import {Link} from "react-router-dom";
import "./Community.css";

function Community(props) {
    const [posts, setPosts] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
    
        const result = await fetch("/api/v1/dbOperations/dbFetchPost", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (result.ok) {
          const dreams = await result.json();
          for (let i = 0; i < dreams.dreamList.length; i++) {
            setPosts((prevPost) => [
            dreams.dreamList[i],
              ...prevPost,
            ]);
          }
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

      const dreamEntries = posts.map((dr) => {
        let color = { backgroundColor: props.colors[dr.genre] };
    
        let titleCol;
        let descCol;
        let dateColor;
        let nameColor;
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
          nameColor = "brightName";
          bright = true;
        } else {
          titleCol = "darkTitle";
          descCol = "darkDesc";
          dateColor = "darkDate";
          nameColor = "darkName";
          bright = false;
        }
    
        const postedDate = dr.postedDate;
        const newDate = new Date(postedDate);
        const formattedDate = newDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    
        return (
          <div style={{ position: "relative" }}>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/FullPost"
              state={dr
              }
            >
              <span style={color} className="entry">
                <p className={nameColor}>{dr.username} posted:</p>
                <p className={dateColor}>{formattedDate}</p>
                <p className={titleCol}>{dr.title}</p>
                <p className={descCol}>Genre: {dr.genre} </p>
                <p className={descCol}>{dr.content} </p>
              </span>
            </Link>
          </div>
        );
      });
      return (
        <div className="contents">
          <HeaderAndNavBar />
          {dreamEntries}
          {posts.length == 0 && (
            <h2 id="noDreams">There are no dreams posted yet.</h2>
          )}
        </div>
      );
}

export default Community;

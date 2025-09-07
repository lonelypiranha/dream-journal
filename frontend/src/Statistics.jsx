import HeaderAndNavBar from "./HeaderAndNavBar";
import "./Statistics.css";
import { useState } from "react";
import { useEffect } from "react";

function Statistics(props) {
  const [highGenre, setHighGenre] = useState("none");

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const stats = await fetch("/api/v1/stats/generateStats", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (stats.ok) {
      const statsJSON = await stats.json();
      if (statsJSON.isDbChanged) {
        props.setUser(statsJSON.updatedUser);
      }
      if (statsJSON.mostCommonGenre.length !== 0) {
        setHighGenre(statsJSON.mostCommonGenre[0]._id);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <HeaderAndNavBar />
      <div className="currStreak">
        <p className="descInfo">Current Dream Streak:</p>
        <p className="statNumber">{props.user.currentStreak}</p>
      </div>
      <div className="basicInfo">
        <div className="dreamCount">
          <p className="descInfo">Number of dreams logged:</p>
          <p className="statNumber">{props.dreams.length}</p>
        </div>
        <div className="highestGenre">
          <p className="descInfo">Most common dream genre:</p>
          <p className="statNumber">{highGenre}</p>
        </div>
        <div className="highestStreak">
          <p className="descInfo">Highest dream streak:</p>
          <p className="statNumber">{props.user.highestStreak}</p>
        </div>
      </div>
    </>
  );
}

export default Statistics;

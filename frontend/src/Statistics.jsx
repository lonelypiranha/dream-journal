import HeaderAndNavBar from "./HeaderAndNavBar";
import "./Statistics.css";
import { useState } from "react";
import { useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import "./react-calendar-heatmap.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { format } from "date-fns";

function Statistics(props) {
  const [highGenre, setHighGenre] = useState("none");
  const [selectedYear, setSelectedYear] = useState(0);
  const [valuesSelected, setValuesSelected] = useState([]);
  const [genreMap, setGenreMap] = useState([]);
  const [genreListForLine, setGenreListForLine] = useState([]);
  const [lineChartMap, setLineChartMap] = useState([]);

  const genres = [
    "Adventure",
    "Drama",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Comedy",
    "Realistic",
    "Abstract",
  ];

  const years = [];
  const firstYear = new Date(props.user.createdAt).getFullYear();
  const curr = new Date().getFullYear();
  for (let y = curr; y >= firstYear; y--) {
    years.push(y);
  }

  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function fillAndCumulative(data, genres) {
    const sorted = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Track running totals
    const totals = Object.fromEntries(genres.map((g) => [g, 0]));

    let total = 0;

    return sorted.map((entry) => {
      const cumulative = { date: entry.date, Total: total };
      for (const g of genres) {
        const value = entry[g] ?? 0;
        totals[g] += value;
        cumulative[g] = totals[g];
        cumulative.Total += value;
        total += value;
      }
      return cumulative;
    });
  }

  function aggregateDreamsByDay(dreams, genres, startYear, endYear) {
    const map = new Map();
    map.set(
      `${startYear}-01-01`,
      Object.fromEntries(genres.map((g) => [g, 0]))
    );
    if (endYear == curr) {
        map.set(format(new Date(), "yyyy-MM-dd"), Object.fromEntries(genres.map((g) => [g, 0])));
    }
    else {
    map.set(`${endYear}-12-31`, Object.fromEntries(genres.map((g) => [g, 0])));
    }

    for (const dream of dreams) {
      const date = format(new Date(dream.createdAt), "yyyy-MM-dd");
      if (!map.has(date)) {
        map.set(date, Object.fromEntries(genres.map((g) => [g, 0])));
      }
      const entry = map.get(date);
      if (genres.includes(dream.genre)) {
        entry[dream.genre] += 1;
      }
    }

    // Convert map to array
    return Array.from(map.entries()).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  }

  useEffect(() => {
    const valuesMap = new Map();
    const yearNow = new Date().getFullYear();
    props.dreams.forEach(({ createdAt }) => {
      const dateString = formatDate(new Date(createdAt));
      if (dateString.substring(0, 4) == yearNow) {
        if (valuesMap.has(dateString)) {
          valuesMap.set(dateString, valuesMap.get(dateString) + 1);
        } else {
          valuesMap.set(dateString, 1);
        }
      }
    });

    const values = Array.from(valuesMap, ([key, value]) => ({
      date: key,
      count: value,
    }));

    setSelectedYear(yearNow);
    setValuesSelected(values);

    const genreMap = new Map();

    props.dreams.forEach(({ genre }) => {
      if (genreMap.has(genre)) {
        genreMap.set(genre, genreMap.get(genre) + 1);
      } else {
        genreMap.set(genre, 1);
      }
    });
    const flattenedGenres = Array.from(genreMap, ([key, value]) => ({
      genre: key,
      count: value,
    }));

    setGenreMap(flattenedGenres);

    const dailyData = aggregateDreamsByDay(
      props.dreams,
      genres,
      firstYear,
      curr
    );
    const fullData = fillAndCumulative(dailyData, genres);
    setLineChartMap(fullData);

    let genreList = [];
    genres.forEach((genre) => {
      if (fullData[fullData.length - 1][genre] > 0) {
        genreList.push(genre);
      }
    });
    setGenreListForLine(genreList);
  }, [props.dreams]);

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

  const handleChange = (event) => {
    const thisYear = event.target.value;
    const valuesMap = new Map();
    props.dreams.forEach(({ createdAt }) => {
      const dateString = formatDate(new Date(createdAt));
      if (dateString.substring(0, 4) == thisYear) {
        if (valuesMap.has(dateString)) {
          valuesMap.set(dateString, valuesMap.get(dateString) + 1);
        } else {
          valuesMap.set(dateString, 1);
        }
      }
    });

    const values = Array.from(valuesMap, ([key, value]) => ({
      date: key,
      count: value,
    }));

    setSelectedYear(thisYear);
    setValuesSelected(values);
  };

  const handleChangePie = (event) => {
    const thisYear = event.target.value;

    const genreMap = new Map();
    if (thisYear === "OVERALL") {
      props.dreams.forEach(({ genre }) => {
        if (genreMap.has(genre)) {
          genreMap.set(genre, genreMap.get(genre) + 1);
        } else {
          genreMap.set(genre, 1);
        }
      });
    } else {
      props.dreams.forEach(({ genre, createdAt }) => {
        const dateString = formatDate(new Date(createdAt));
        if (dateString.substring(0, 4) == thisYear) {
          if (genreMap.has(genre)) {
            genreMap.set(genre, genreMap.get(genre) + 1);
          } else {
            genreMap.set(genre, 1);
          }
        }
      });
    }

    const values = Array.from(genreMap, ([key, value]) => ({
      genre: key,
      count: value,
    }));

    setGenreMap(values);
  };

  const handleChangeLine = (event) => {
    const thisYear = event.target.value;

    if (thisYear === "OVERALL") {
      const dailyData = aggregateDreamsByDay(
        props.dreams,
        genres,
        firstYear,
        curr
      );
      const fullData = fillAndCumulative(dailyData, genres);
      setLineChartMap(fullData);
      let genreList = [];
      genres.forEach((genre) => {
        if (fullData[fullData.length - 1][genre] > 0) {
          genreList.push(genre);
        }
      });
      setGenreListForLine(genreList);
    } else {
      const filteredDreams = props.dreams.filter(({ createdAt }) => {
        const dateString = formatDate(new Date(createdAt));
        return dateString.substring(0, 4) == thisYear;
      });
      const dailyData = aggregateDreamsByDay(
        filteredDreams,
        genres,
        thisYear,
        thisYear
      );
      const fullData = fillAndCumulative(dailyData, genres);
      setLineChartMap(fullData);
      let genreList = [];
      genres.forEach((genre) => {
        if (fullData[fullData.length - 1][genre] > 0) {
          genreList.push(genre);
        }
      });
      setGenreListForLine(genreList);
    }
  };

  const getTooltipDataAttrs = (value) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      "data-tip": `${value.date} has count: ${value.count}`,
    };
  };

  const determineColor = (genre) => {
    switch (genre.genre) {
      case "Adventure":
        return "#a21939";
      case "Drama":
        return "#147e74";
      case "Fantasy":
        return "#0751f5";
      case "Science Fiction":
        return "#2868c6";
      case "Horror":
        return "#c879e0";
      case "Comedy":
        return "#b5d17d";
      case "Realistic":
        return "#e2c372";
      case "Abstract":
        return "#6eb687";
      default:
        return "#D3D3D3"; // Default color for undefined genres
    }
  };

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

      <div className="heatMap">
        <h2 className="stat-headers">Dream Calendar</h2>
        <select onChange={handleChange} className="selection">
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <CalendarHeatmap
          startDate={new Date(`${selectedYear - 1}-12-31`)}
          endDate={new Date(`${selectedYear}-12-31`)}
          showWeekdayLabels={true}
          showOutOfRangeDays={false}
          values={valuesSelected}
          weekdayLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          tooltipDataAttrs={(value) => {
            getTooltipDataAttrs(value);
          }}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            } else {
              if (value.count >= 4) {
                return `color-scale-4`;
              }
              return `color-scale-${value.count}`;
            }
          }}
        />
        <ReactTooltip />
      </div>

      <h2 className="stat-headers">Genre Distribution</h2>
      <select onChange={handleChangePie} className="selectionGenre">
        <option>OVERALL</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <div style={{ width: "100%", height: 300, marginBottom: "50px" }}>
        {genreMap && genreMap.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={genreMap}
                cx="50%" // x position of center
                cy="50%" // y position of center
                outerRadius={100} // size of the pie
                fill="#8884d8"
                dataKey="count" // the field to use for values
                nameKey="genre" // the field to use for names
                label // show labels
              >
                {genreMap.map((genre, count) => (
                  <Cell
                    key={`cell-${count}`}
                    fill={determineColor(genre)}
                    stroke="#FFF39A"
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p
            style={{
              color: "#FFF39A",
            }}
          >
            No data available for the selected year.
          </p>
        )}
      </div>
      <h2 className="stat-headers">Dreams Over Time</h2>
      <select onChange={handleChangeLine} className="selectionGenre">
        <option>OVERALL</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div
        style={{
          width: "500px",
          height: 300,
          margin: "0 auto",
          marginTop: "20px",
        }}
      >
        {lineChartMap &&
        lineChartMap.length > 0 &&
        lineChartMap[lineChartMap.length - 1].Total > 0 ? (
          <ResponsiveContainer>
            <LineChart data={lineChartMap}>
              <XAxis dataKey="date" stroke="#FFF39A" />
              <YAxis stroke="#FFF39A" allowDecimals={false} />
              <Tooltip />
              <Legend />
              {genreListForLine.map((genre) => (
                <Line
                  key={genre}
                  type="monotone"
                  dataKey={genre}
                  stroke={determineColor({ genre })}
                />
              ))}
              <Line
                key="Total"
                type="monotone"
                dataKey="Total"
                stroke={determineColor("overall")}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p
            style={{
              color: "#FFF39A",
            }}
          >
            No data available for the selected year.
          </p>
        )}
      </div>
    </>
  );
}

export default Statistics;

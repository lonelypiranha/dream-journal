import React, { useState, useRef, useEffect } from "react";
import more from "./static/more_icon.png";
import more_blue from "./static/more_icon_blue.png";
import trash from "./static/trash-bin.png";
import post from "./static/send.png";
import unpost from "./static/send-2.png";
import "./Dropdown.css";
import "./Popup.css";

export default function Dropdown(props) {
  const [open, setOpen] = useState(false); // dropdown
  const [isOpen, setIsOpen] = useState(false); // pop-up
  const [finalOpen, setFinalOpen] = useState(false);
  const [popUpTitle, setPopUpTitle] = useState("");
  const [result, setResult] = useState("");
  const menuRef = useRef(null);

  let icon;
  let iconClass;
  if (props.brightness) {
    icon = more;
    iconClass = "dropdown-button-yellow";
  } else {
    icon = more_blue;
    iconClass = "dropdown-button-blue";
  }

  let postState;
  let postIcon;
  if (props.dream.posted) {
    postState = "Unpost dream";
    postIcon = unpost;
  } else {
    postState = "Post dream";
    postIcon = post;
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const result = await fetch("/api/v1/dbOperations/dbDeleteDream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dreamID: props.dream._id,
      }),
    });

    if (result.ok) {
      const dreamJSON = await result.json();
      setIsOpen(false);
      setResult("Dream deleted successfully!");
    } else {
      setResult("Unable to delete dream");
    }
    setFinalOpen(true);
  };

  const handlePost = async () => {
    const isPosted = props.dream.posted;
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const result = await fetch("/api/v1/dbOperations/dbChangePostStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dreamID: props.dream._id,
        postedOrNot: isPosted,
      }),
    });

    if (result.ok) {
      const dreamJSON = await result.json();
      setIsOpen(false);
      props.setDreams(
        props.dreams.map((dream) =>
          dream._id === props.dream._id ? dreamJSON.dreamObj : dream
        )
      );
      if (isPosted) {
        setResult("Successfully unposted dream!");
      } else {
        setResult("Successfully posted dream!");
      }
    } else {
      if (isPosted) {
        setResult("Unable to unpost dream");
      } else {
        setResult("Unable to post dream");
      }
    }
    setFinalOpen(true);
  };

  const openPopUp = (command) => {
    setIsOpen(true);
    if (command === "delete") {
      setPopUpTitle("Delete dream?");
    } else if (props.dream.posted) {
      setPopUpTitle("Unpost dream?");
    } else {
      setPopUpTitle("Post dream?");
    }
  };

  const handlePopUp = (command) => {
    if (command === "no") {
      setIsOpen(false);
    } else if (popUpTitle === "Delete dream?") {
      handleDelete();
    } else {
      handlePost();
    }
  };

  const handleResult = () => {
    setOpen(false);
    setFinalOpen(false);
    if (popUpTitle === "Delete dream?") {
      props.setDreams(
        props.dreams.filter((dream) => dream._id !== props.dream._id)
      );
    }
  };

  return (
    <div className="dropdown" ref={menuRef}>
      <button className={iconClass} onClick={() => setOpen(!open)}>
        <img className="more" src={icon} alt="more" />
      </button>
      {open && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item"
            onClick={() => {
              openPopUp("delete");
            }}
          >
            <img className="trash" src={trash} alt="delete" />
            Delete dream
          </button>
          <button
            className="dropdown-item"
            onClick={() => {
              openPopUp("changePostStatus");
            }}
          >
            <img className="post" src={postIcon} alt="postState" />
            {postState}
          </button>
        </div>
      )}
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{popUpTitle}</h2>
            <button className="options" onClick={() => handlePopUp("no")}>
              No
            </button>
            <button className="options" onClick={() => handlePopUp("yes")}>
              Yes
            </button>
          </div>
        </div>
      )}
      {finalOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{result}</h2>
            <button className="options" onClick={handleResult}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

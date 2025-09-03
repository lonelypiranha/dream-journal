import React, { useState, useRef, useEffect } from "react";
import more from "./static/more_icon.png";
import more_blue from "./static/more_icon_blue.png";
import trash from "./static/trash-bin.png";
import post from "./static/send.png";
import unpost from "./static/send-2.png";
import "./Dropdown.css";

export default function Dropdown(props) {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
        props.setDreams(props.dreams.filter(dream => dream._id !== props.dream._id));
      }
  };

  const handlePost = async () => {
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
          postedOrNot: props.dream.posted
        }),
      });

      if (result.ok) {
        const dreamJSON = await result.json();
        props.setDreams(props.dreams.map(dream => (dream._id === props.dream._id ? dreamJSON.dreamObj : dream)));
      }
  };

  return (
    <div className="dropdown" ref={menuRef}>
      <button className={iconClass} onClick={() => setOpen(!open)}>
        <img className="more" src={icon} alt="more" />
      </button>
      {open && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleDelete}>
            <img className="trash" src={trash} alt="more" />
            Delete dream
          </button>
          <button className="dropdown-item" onClick={handlePost}>
            <img className="post" src={postIcon} alt="more" />
            {postState}
          </button>
        </div>
      )}
    </div>
  );
}

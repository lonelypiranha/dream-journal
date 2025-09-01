import HeaderAndNavBar from "./HeaderAndNavBar";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const navigate = useNavigate();

  const createDate = props.user.createdAt;
  const newDate = new Date(createDate);
  const formattedDate = newDate.toDateString();

  const lastActive = props.user.lastActive;
  const newDate2 = new Date(lastActive);
  const formattedDate2 = newDate2.toDateString();

  function signOut() {
    localStorage.removeItem("token");
    props.setUser({});
    props.setDreams([]);
    navigate("/");
  }

  return (
    <>
      <HeaderAndNavBar />
      <div className="ProfileInfo">
        <p>Name: {props.user.name}</p>
        <p>Email: {props.user.email}</p>
        <p>Account created: {formattedDate}</p>
        <p>Last active: {formattedDate2}</p>
      </div>

      <button class="SignOut" onClick={signOut}>
        Sign Out
      </button>
    </>
  );
}

export default Profile;

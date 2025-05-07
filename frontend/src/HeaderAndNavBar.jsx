import logo from './static/logo.png';
import group from './static/group.png';
import dream from './static/dream.png';
import plus from './static/plus.png';
import chart from './static/line-chart.png';
import profile from './static/profile-user.png';
import {Link} from "react-router-dom";
import './App.css';

export default function headerAndNavBar() {
    return (
    <>
    <header className="App-header">
        <img id="logo" alt="logo" src={logo} />
        Traumerei
    </header>
    <hr></hr>
    <nav>
        <Link to="/" className='link'>
        <button class="navButton"> 
            <img class="navIconCommunity" src={group} alt="community" />
            Community
            </button>
        </Link>
        <Link to="/Dreams" className='link'>
        <button class="navButton"> 
            <img class="navIcons" src={dream} alt="my dream" />
            My Dreams 
            </button>
        </Link>
        <Link to="/AddDream" className='link'>
        <button class="navButton"> 
            <img class="navIcons" src={plus} alt="add dream" />
            Add a Dream 
            </button>
        </Link>
        <Link to="/Statistics" className='link'>
        <button class="navButton"> 
            <img class="navIcons" src={chart} alt="statistics" />
            Statistics 
            </button>
        </Link>
        <Link to="/Profile" className='link'>
        <button class="navButton"> 
            <img class="navIcons" src={profile} alt="community" />
            Profile 
            </button>
        </Link>
    </nav>
    </>
    );
}

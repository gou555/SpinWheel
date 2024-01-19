import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import '../Styles/Navbar.css';
import discord from '../Images/Discord.png';
import twitter from '../Images/Twitter.png';
const AppNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className='space-navbar px-4'>
            <Navbar.Brand href="#home" className='nav-brand me-4'>SeiSpace</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {/* <Nav.Link href="#spinWheel" className="nav-link-space me-2">$HUFFLE</Nav.Link> */}
                    {/* Add more Nav.Link here for other games in the future */}
                </Nav>
                <div className="navbar-images">
                    <img src={discord} alt="First Image" className="navbar-image" />
                    <a href="https://x.com/SeiSpaceHub?t=G_MTV2g73fLD0VaiWLoFGA&s=09"><img src={twitter} alt="Second Image" className="navbar-image" /></a>
                </div>
                <button className='electric-button me-4'>Connect</button>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;

import { Outlet, useLocation } from "react-router-dom"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import "./styles.css"
import logo from '../../images/logocrop.png'
import { useEffect, useState } from "react";

const EasyChefNav = () => {

    const location = useLocation();

    const [logged, setLogged] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("authToken") === null) {
            setLogged(false)
            return;
        }

        let formData = new FormData();

        formData.append('token', localStorage.getItem("authToken"))
        
        fetch("http://localhost:8000/accounts/verify/", {
            method: "POST",
            mode: 'cors',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                setLogged(true)
            } else {
                setLogged(false)
                localStorage.removeItem("authToken")
            }
        });
    }, [location] )

    return (
        <>
            <Navbar bg="secondary" expand="sm">
                <div className="container-fluid">
                    <Navbar.Brand href="/"><img width="50" height="50" src={logo} alt=""/>Easy Chef</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/my_recipes" className={location.pathname === '/my_recipes' ? 'active' : ''}>My Recipes</Nav.Link>
                        <Nav.Link href="/new_recipes" className={location.pathname === '/new_recipes' ? 'active' : ''}>New Recipe</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                    <div id="MyProfile_nav">
                        <NavDropdown title="My Profile" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/shopping_list">Shopping List</NavDropdown.Item>
                            <NavDropdown.Item href={logged ? "/edit_profile" : "/signup"}>{logged ? "Edit Profile" : "Signup"}</NavDropdown.Item>
                            <NavDropdown.Item href={logged ? "/logout" : "/login"}>{logged ? "Logout" : "Login"}</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </Navbar>
        <Outlet />
        </>
    )
}

export default EasyChefNav
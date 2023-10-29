import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { useEffect, useState } from "react";
import MyCreations from "../../components/MyCreations/MyCreations";
import Favourites from "../../components/Favourites/Favourites";
import History from "../../components/History/History";

import "./styles.css";

const checkLogged = (navigate) => {

    if (localStorage.getItem("authToken") === null) {
        navigate('/login')
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
        if (!response.ok) {
            localStorage.removeItem("authToken")
            navigate('/login')
        }
    });
}

const MyRecipes = () => {

    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('myc');

    useEffect( () => {
        checkLogged(navigate)
    }, [navigate])

    const tabSelect = (eventKey) => {
        setActiveTab(eventKey);
    };
    
    return (

        <>
            <Tab.Container activeKey={activeTab} onSelect={tabSelect}>

                <Nav justify bg="dark" variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="myc">My Creations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="fav">Favourited</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="his">History</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>

                    <Tab.Pane eventKey="myc">
                        <MyCreations/>
                    </Tab.Pane>

                    <Tab.Pane eventKey="fav">
                       <Favourites/>
                    </Tab.Pane>

                    <Tab.Pane eventKey="his">
                        <History />
                    </Tab.Pane>

                </Tab.Content>

            </Tab.Container>

        </>

    )
}

export default MyRecipes
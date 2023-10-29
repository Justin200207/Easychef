import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"

import "./styles.css"

const Login = () => {

    useEffect(() => {
        if (localStorage.getItem("authToken") === null) {
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
                navigate('/')
            }
        });
    })

    const navigate = useNavigate();

    var [error, setError] = useState("");

    var [cred, setCred] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formData = new FormData();

        formData.append('email', cred.email)
        formData.append('password', cred.password)

        const response = await fetch('http://localhost:8000/accounts/login/', {
            method: "POST",
            mode: "cors",
            body: formData
        })
        
        if (response.status !== 401) {
            response.json().then(data => {
                localStorage.setItem("authToken", data.access);
                return fetch('http://localhost:8000/accounts/edit/', {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("authToken")
                    }
                })
            })
            .then(response => response.json())
            .then(data => localStorage.setItem("ECid", data.id))
            .then(navigate("/"))
        } else {
            setError("Email or Password is incorrect")
        }

    }

    return (

        <>
            <form onSubmit={handleSubmit}>
                <div className="container-fluid row">

                    <div className="col-md-6 profile-edit-inputs px-0 bg-light bg-opacity-50 m-4 px-4 py-4">

                        <div className="mx-8 px-4">
                            <h2 className="">Login</h2>
                            <div className="form-group">
                                <label htmlFor="email_edit" className="col-form-label">Email</label>
                                <div className="">
                                    <input onChange={(e) => setCred({ ...cred, email: e.target.value })} name="email" type="email" className="form-control" id="email_edit" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="col-form-label">Password</label>
                                <div className="">
                                    <input onChange={(e) => setCred({ ...cred, password: e.target.value })} name="password" type="password" className="form-control" id="password" required />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary submit-button-top-margin" id="profile_submit">Login</button>

                            <div className="error-message">
                                <label className="col-form-label">{error}</label>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </>

    )
}

export default Login
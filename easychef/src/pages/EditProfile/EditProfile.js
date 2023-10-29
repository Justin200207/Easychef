import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import default_pp from "../../images/default_profile_pic.png"

import "./styles.css"
import UserContext from "../../contexts/UserContext"


const EditProfile = () => {

    const navigate = useNavigate();

    const {user, setUser} = useContext(UserContext)

    var [image, setImage] = useState(null)

    useEffect(() => {
        fetch('http://localhost:8000/accounts/edit/', {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken")
            }
        })
        .then(response => {
            if (!response.ok){
                navigate('/login')
            }
            return response.json()
        })
        .then(data => {setUser({email: data.email, first_name: data.first_name, last_name: data.last_name, phone_number: data.phone_number}); setImage(data.profile_pic)})
    }, [setUser, setImage, navigate])

    const handleImage = (event) => {
        setUser({ ...user, profile_pic: event.target.files[0]})
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            setImage(event.target.result);
        };

        reader.readAsDataURL(selectedFile);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let formData = new FormData();

        formData.append('email', user.email)
        formData.append('phone_number', user.phone_number)
        formData.append('first_name', user.first_name)
        formData.append('last_name', user.last_name)
        if (!(user.password === undefined)) {
            formData.append('password', user.password)
        }

        if (user.profile_pic) {
            formData.append('profile_pic', user.profile_pic, user.profile_pic.name)
        }

        fetch('http://localhost:8000/accounts/edit/', {
            method: "PATCH",
            mode: "cors",
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken")
            }
        }).then(response => {
            if (response.ok) {
                navigate('/');
            }
        })
    }

    return (

        <>
            <form onSubmit={handleSubmit}>
                <div className="container-fluid row">
                    <div className="col-md-3 text-center bg-light bg-opacity-50 mx-5 my-4 p-5" id="side_div_edit_profile">

                        {image ? 
                        (<img src={image} className="img-thumbnail" id="profilepic" alt="" />) :
                        ((<img src={default_pp} className="img-thumbnail" id="profilepic" alt="" />))
                        }

                        <div className="form-group center-that-works">
                            <label htmlFor="formFile" className="col-form-label ">Avatar Image</label>
                            <input onChange={handleImage} name="profilepicture" className="form-control" type="file" id="formFile" />
                        </div>

                    </div>

                    <div className="col-md-7 profile-edit-inputs px-0 bg-light bg-opacity-50 m-4 px-4 py-4">

                        <div className="mx-5 px-5">
                            <h2 className="">Edit Profile</h2>
                            <div className="form-group">
                                <label htmlFor="email_edit" className="col-form-label ">Email</label>
                                <div className="col-sm-10">
                                    <input onChange={(e) => setUser({ ...user, email: e.target.value })} name="email" type="email" className="form-control" id="email_edit" value={user.email} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="col-form-label ">Password</label>
                                <div className="col-sm-10">
                                    <input onChange={(e) => setUser({ ...user, password: e.target.value})} name="password" type="password" className="form-control" id="password" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstname_edit" className="col-form-label ">First Name</label>
                                <div className="col-sm-10">
                                    <input onChange={(e) => setUser({ ...user, first_name: e.target.value })} name="firstname" type="textbox" className="form-control" id="firstname_edit" value={user.first_name} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastname_edit" className="col-form-label ">Last Name</label>
                                <div className="col-sm-10">
                                    <input onChange={(e) => setUser({ ...user, last_name: e.target.value })} name="lastname" type="textbox" className="form-control" id="lastname_edit" value={user.last_name} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone_edit" className="col-form-label ">Phone Number</label>
                                <div className="col-sm-10" >
                                    <input type="tel" pattern="(?[0-9]{3})?-?[0-9]{3}-?[0-9]{4}" onChange={(e) => setUser({ ...user, phone_number: e.target.value })} name="phonenumber" className="form-control" id="phone_edit" value={user.phone_number} />
                                </div>
                            </div>
                            <button className="btn btn-primary submit-button-top-margin" id="profile_submit">Submit Changes</button>
                        </div>

                    </div>
                </div>
            </form>
        </>

    )

}

export default EditProfile
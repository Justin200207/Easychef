import addfav from "../../images/add_fav.png"
import favd from "../../images/added_fav.png"
import addcart from "../../images/shopping-bag-regular-24.png"
import cartd from "../../images/shopping-bag-solid-24.png"
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./styles.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Comment from '../../components/Comment/Comment';
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import Step from "../../components/Step/Step"
import { Card } from "react-bootstrap";

const checkLogged = () => {

    if (localStorage.getItem("authToken") === null) {
        return false;
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
            return false;
        } else {
            return true;
        }
    });
}

const sendAllImages = (images) => {
    var images_ids = []


    images.forEach((image) => {

        let formData = new FormData();
        formData.append('comment_image', image)
        fetch('http://localhost:8000/recipe/CreateRecipeCommentImage/', {
            method: "POST",
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken")
            }
        })
        .then(response => response.json())
        .then(data => {images_ids.push(data.id)})
    });
    return images_ids
}

const RecipePage = () => {

    const location = useLocation();
    const id = new URLSearchParams(location.search).get("id");

    const navigate = useNavigate();
    var [recipe, setRecipe] = useState();
    let url = "http://localhost:8000/recipe/" + id + "";

    var [logged, setLogged] = useState();

    const [rating, setRating] = useState();
    
    useEffect(() => {

        if (checkLogged() === false) {
            setLogged(false)
            fetch(url, {
                method: "GET",
                mode: "cors",
            })
                .then(response => {
                    if (!response.ok) {
                        navigate("/")
                    }
                    return response.json()
                })
                .then(data => {
                    setRecipe(data);
                    setRating(data.rating)
                    checkFav();
                })
        } else {
            setLogged(true)
            fetch(url, {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken")
                }
            })
                .then(response => {
                    if (!response.ok) {
                        navigate("/")
                    }
                    return response.json()
                })
                .then(data => {
                    setRecipe(data);
                    setRating(data.rating)
                    checkFav();
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    let images = []
    if (recipe != null && recipe.recipe_images.length > 0) {
        for (let i = 0; i < recipe.recipe_images.length; i++) {
            images.push(recipe.recipe_images[i].recipe_image)
        }
    }

    const [fav, setFav] = useState(false);

    useEffect(() => {
        checkFav();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe, fav])

    function sendFav() {
        const bdy = { recipe: recipe.id }
        const favurl = fav ? "http://localhost:8000/recipe/removefavourite/" + recipe.id : "http://localhost:8000/recipe/favourite/";
        const mtd = fav ? "DELETE" : "POST";
        console.log(mtd);
        fetch(favurl, {
            method: mtd,
            mode: "cors",
            body: JSON.stringify(bdy),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken")
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                } else {
                    setFav(!fav)
                }
            })
    }

    function checkFav() {
        if (recipe !== undefined) {
            console.log("Before fetch")
            fetch("http://localhost:8000/recipe/checkfavourite/" + recipe.id + "/", {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken")
                },
            })
                .then(response => {
                    console.log(response);
                    if (!response.ok) {
                        setFav(false)
                    } else {
                        setFav(true)
                    }
                })
        }
    }

    const [shop, setShop] = useState(false);

    useEffect(() => {
        checkShop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe, shop])

    function sendShop() {
        const bdy = { recipe: recipe.id }
        const shopurl = shop ? "http://localhost:8000/recipe/shoppinglistremove/" + recipe.id : "http://localhost:8000/recipe/shoppinglistadd/";
        const mtd = shop ? "DELETE" : "POST";
        console.log(mtd);
        fetch(shopurl, {
            method: mtd,
            mode: "cors",
            body: JSON.stringify(bdy),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken")
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                } else {
                    setShop(!shop)
                }
            })
    }

    function checkShop() {
        if (recipe !== undefined) {
            console.log("Before fetch")
            fetch("http://localhost:8000/recipe/checkshopping/" + recipe.id + "/", {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken")
                },
            })
                .then(response => {
                    console.log(response);
                    if (!response.ok) {
                        setShop(false)
                    } else {
                        setShop(true)
                    }
                })
        }
    }

    function sendRate() {
        const bdy = { rating: document.getElementById("rating").value, recipe: recipe.id }
        fetch("http://localhost:8000/recipe/rate/", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(bdy),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken")
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                }
                fetch(url, {
                    method: "GET",
                    mode: "cors",
                })
                    .then(response => {
                        if (!response.ok) {
                            navigate("/")
                        }
                        return response.json()
                    })
                    .then(data => {
                        setRating(data.rating);
                    })
            })
    }

    function editRecipe() {
        navigate("/recipes/edit/?id=" + recipe.id)
    }

    const deleteRecipe = () => {
        fetch("http://localhost:8000/recipe/"+recipe.id+"/delete/", {
            method: "DELETE",
            mode: "cors",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken")
            },
        })
        .then(response => {
            if (response.ok) {
                navigate("/my_recipes")
            }
        })
    }

    var [comText, setComText] = useState('')
    var [comImages, setComImages] = useState([])

    const [newComment] = useState(null);


    const textHandle = (event) => {
        setComText(event.target.value)
    }

    const imageHandle = (event) => {
        setComImages(Array.from(event.target.files))
    }

    function postComment() {

        function promiseSendComImages() {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    const comImagesID = sendAllImages(comImages)
                    resolve(comImagesID)
                }, 500);
            });
        }

        function promiseSetSendable(comImagesID) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    var sendable = {text: comText, add_comment_images: comImagesID}
                resolve(sendable);
                }, 500);
            });
        }



        promiseSendComImages()
        .then((comImagesID) => {promiseSetSendable(comImagesID)
            .then((sendable) => {

                fetch('http://localhost:8000/recipe/'+ recipe.id +'/new_comment/', {
                    method: "POST",
                    mode: "cors",
                    body: JSON.stringify(sendable),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("authToken")
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        navigate('/login')
                    }
                    return response.json()
                })
                .then(data => {
                    window.location.reload();
                })

            })
        })
        
    }

    return (

        <>
            {recipe != null ?
                <div className="row mt-4 width-25">
                    <div className="col-md-2 text-center mx-5 my-4 px-4 py-4 bg-light bg-opacity-50">
                        {images.length > 0 ? <ImageCarousel images={images} height={150} /> : <></>}
                        <h4>{recipe.name}</h4>
                        <h6>Creator: {recipe.owner.first_name}</h6>
                        {logged ? <button className="btn btn-primary submit-button-top-margin" style={{ "all": "unset", "cursor": "pointer" }} onClick={sendFav}><img height="20px" width="20px" src={fav ? favd : addfav} alt='' /></button> : <></>}
                        {logged ?<button className="btn btn-primary submit-button-top-margin" style={{ "all": "unset", "cursor": "pointer" }} onClick={sendShop}><img height="20px" width="20px" src={shop ? cartd : addcart} alt='' /></button>: <></>}
                        <p>{localStorage.getItem("ECid") == recipe.owner.id ? <button className="btn btn-primary submit-button-top-margin" onClick={editRecipe}>Edit</button> : <></>}
                        {localStorage.getItem("ECid") == recipe.owner.id ? <button className="btn btn-primary submit-button-top-margin" onClick={deleteRecipe}>Delete</button> : <></>}</p>
                        <p>{rating == null ? "Not Rated" : rating + "\u2606"}</p>
                        {logged ? <input type="number" placeholder="Rate..." min="1" max="5" id="rating" onKeyUp={e => { if (e.key === 'Enter') sendRate() }}></input> :<></>}
                        <h6>Favourites: {recipe.fav_counter}</h6>
                        <h6>Servings: {recipe.serving}</h6>
                        <h6>Prep Time: {recipe.prep_time}</h6>
                        <h6>Cook Time: {recipe.cooking_time}</h6>
                        <h6>Diet:</h6>
                        <ul>
                        {recipe.diets.map((diet, index) => (
                            <li key={index}>{diet.name} </li>
                        ))}
                        </ul>
                        <h6>Cuisine: {recipe.cuisine}</h6>
                        <h6>Ingredients</h6>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient.ingredient.name} {ingredient.quantity} {ingredient.measure_type}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-8 text-black mx-5">
                        <div className="col-md-10 px-4 py-4 bg-light bg-opacity-50">
                            <h6>Steps</h6>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <div className="col-sm-20" style={{
                                    "marginTop": "10px",
                                    "display": "grid",
                                    "gridTemplateColumns": "repeat(1, 1fr)",
                                    "gap": "10px",
                                    "gridAutoFlow": "row"
                                }}>
                                    {recipe.steps.map((step, index) => (
                                        <Step num={index + 1} key={index} step={step} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 text-black m-5">
                        <div className="col-md-10 px-4 py-4 bg-light bg-opacity-50">
                            <h4>
                                Comments
                            </h4>
                            <div id="wrapper">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <div className='commentContainer' id="comments">
                                        {logged ? 
                                        <Card style={{ width: "18rem" }}>
                                            <textarea onChange={textHandle} style={{ "resize": "none" }} className="form-text" id="commentText" rows="8"></textarea>
                                            <input onChange={imageHandle} className="form-control" id="CommentImages" type="file" multiple />
                                            <button style={{ "bottom": "0" }} className="btn btn-primary submit-button-top-margin" id="new_comment_button" onClick={postComment}>New Comment</button>
                                        </Card>
                                        : <></> }
                                        {recipe.comments.map((comment, index) => (
                                            <Comment key={index} comment={comment} />
                                        ))}
                                        {newComment}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                :
                <></>
            }
        </>

    )
}

export default RecipePage
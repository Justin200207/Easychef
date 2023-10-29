import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react"
import AsyncCreatableSelect from 'react-select/async-creatable'

import no_image from "../../images/no_image.png"
import RecipeStep from "./NewRecipeStep";
import NewIng from "./NewIng";

import "./styles.css"
import RecipeContext from "../../contexts/RecipeContext";

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

const convertToOptions = (inputs) => {
    var options = []
    inputs.forEach((input) => options.push({value: input.name, label: input.name}))
    return options
}

const convertFromOptions = (inputs) => {
    var options = []
    inputs.forEach((input) => options.push(input.value))
    return options
}

const stepImageToArray = (steps) => {
    var ret = []
    for (let i = 0; i < steps.length; i++) {
        ret.push(steps[i].add_step_images)
    }
    return ret;
}

// Sends all the images and returns the ids of all the images
// The ids are needed as they are sent when creating the recipe
const sendAllImages = (r_images, s_images) => {
    var r_images_ids = []

    r_images.forEach((image) => {
        let formData = new FormData();
        formData.append('recipe_image', image)
        fetch('http://localhost:8000/recipe/CreateRecipeImage/', {
            method: "POST",
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken")
            }
        })
        .then(response => response.json())
        .then(data => {r_images_ids.push(data.id)})
    });

    var s_images_ids = []

    s_images.forEach((images) => {

        var temp_ids = []

        images.forEach((image) => {
            let formData = new FormData();
            formData.append('step_image', image)
            fetch('http://localhost:8000/recipe/CreateRecipeStepImage/', {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken")
                }
            })
            .then(response => response.json())
            .then(data => {temp_ids.push(data.id)})
        })

        s_images_ids.push(temp_ids)
    });
    return [r_images_ids, s_images_ids]
}

const NewRecipes = () => {

    const navigate = useNavigate();

    const {recipe, setRecipe} = useContext(RecipeContext);

    const [steps, setSteps] = useState([]);
    const [steps_info] = useState([]);

    const [ings_boxes, setIngsBoxes] = useState([]);
    const [ings_info] = useState([]);

    var [live_images, setLiveImages] = useState([])
    var [live_converted, setLiveConverted] = useState([])
    var [live_converted_html, setLiveConvertedHtml] = useState([])

    useEffect( () => {
        // Make sure user is logged
        checkLogged(navigate)
    }, [navigate]);

    const promiseOptions = (input) => new Promise(
        (resolve) => {
            setTimeout(() => {
                if (input === '') {
                    input = '*'
                }
                fetch('http://localhost:8000/recipe/diets/'+input+'/', {
                    method: "GET",
                    mode: "cors",
                })
                .then(response => response.json())
                .then(data => resolve(convertToOptions(data.results)));
            }, 1000)
        }
    )

    const handleSubmit = async (event) => {
        event.preventDefault()

        function firstPromiseGetRecipe() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                const temp = recipe
            //console.log("First function executed");
            resolve(temp);
            }, 500);
        });
        }
        
        function secondPromiseGetImages() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                const temp2 = sendAllImages(live_images, stepImageToArray(steps_info))
                //console.log(temp2)
            //console.log("Second function executed");
            resolve(temp2);
            }, 500);
        });
        }
        
        function thirdPromiseSetNewRecipe(data1, data2) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var temp_steps = data1.steps
                for (let i = 0; i < data2[1].length; i++) {
                    temp_steps[i].add_step_images = data2[1][i]
                }
                //console.log(temp_steps)
                const send = {...data1, add_recipe_images: data2[0], steps: temp_steps}
            //console.log("Third function executed");
            resolve(send);
            }, 500);
        });
        }
        
        firstPromiseGetRecipe()
        .then((data1) => {secondPromiseGetImages()
            .then((data2) => {thirdPromiseSetNewRecipe(data1, data2)
                .then((data3) => {
                    
                    fetch('http://localhost:8000/recipe/new/', {
                        method: "POST",
                        mode: "cors",
                        body: JSON.stringify(data3),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + localStorage.getItem("authToken")
                        }
                    })
                    .then(response => {
                        if (response.status === 401) {
                            navigate('/login')
                        };
                        return response.json()
                    })
                    .then(data => navigate('/recipes/?id='+data.id))
            
                } )
            } ) 
        } )
        .catch(function(error) {
            console.error("Error: ", error);
        });

    }

    const handleClick = (event) => { // FOR DEBUG ONLY DELETE LATER
        event.preventDefault()

        console.log(recipe)
        // console.log(steps_info)
        // console.log(stepImageToArray(steps_info))
        // console.log(live_images)
        // console.log(live_converted_html)
    }

    const imageHandle = (event) => {
        setLiveImages([])
        setLiveConverted([])
        setLiveConvertedHtml([])
        var temp = Array.from(event.target.files)
        
        setLiveImages(temp)
        
        if (!temp){
            return;
        }
        temp.forEach((image) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                setLiveConverted(live_converted => [...live_converted, event.target.result])
                setLiveConvertedHtml(live_converted_html => [...live_converted_html,<img className="live_images" src={event.target.result} key={event.target.result.slice(0,1000)} alt=''></img>]);
            }
            reader.readAsDataURL(image);
        })
    }

    const nameHandle = (event) => {
        setRecipe({...recipe, name: event.target.value})
    }

    const servingHandle = (event) => {
        setRecipe({...recipe, serving: event.target.value})
    }

    const prepHandle = (event) => {
        setRecipe({...recipe, prep_time: event.target.value})
    }

    const cookingHandle = (event) => {
        setRecipe({...recipe, cooking_time: event.target.value})
    }

    const cuisineHandle = (event) => {
        setRecipe({...recipe, cuisine: event.target.value})
    }

    const dietsHandle = (choice) => {
        var temp = convertFromOptions(choice)
        var sendable = []
        temp.forEach((diet) => sendable.push({name: diet}))
        setRecipe({...recipe, diets: sendable})
    }
    
    const newStep = (event) => {
        event.preventDefault();
        steps_info.push({text:'', add_step_images: []})
        setRecipe({...recipe, steps: steps_info})
        setSteps(steps => [...steps, <RecipeStep key={steps.length} index={steps.length} steps={steps_info} />])
    }

    const rmStep = (event) => {
        event.preventDefault();
        steps_info.pop()
        setRecipe({...recipe, steps: steps_info})

        let temp = [...steps]
        temp.pop()
        setSteps(temp)
    }

    const newIngredient = (event) => {
        event.preventDefault()
        ings_info.push({ingredient: {name: ''}, quantity: '', measure_type: ''})
        setRecipe({...recipe, ingredients: ings_info})
        setIngsBoxes(ings_boxes => [...ings_boxes, <NewIng key={ings_boxes.length} index={ings_boxes.length} ings={ings_info} />])
    }

    const rmIngredient = (event) => {
        event.preventDefault()
        ings_info.pop()
        setRecipe({...recipe, ingredients: ings_info})

        let temp = [...ings_boxes]
        temp.pop()
        setIngsBoxes(temp)
    }

    return (

        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3 text-center bg-light bg-opacity-50 mx-5 my-4 p-4" id="side_div_new_recipe">

                        {live_converted[0] ?
                        <img src={live_converted[0]} className="img-thumbnail" id="profilepic" alt="" /> :
                        <img src={no_image} className="img-thumbnail" id="profilepic" alt="" />
                        }

                        <div className="form-group center-that-works">
                            <label htmlFor="formFile" className="col-form-label text-black">Recipe Image</label>
                            <input onChange={imageHandle} name="profilepicture" className="form-control" type="file" id="formFile" multiple/>
                        </div>

                        <div className="form-group center-that-works">
                            <label htmlFor="recipe_name_edit" className="col-form-label text-black">Name</label>
                            <div>
                                <input onChange={nameHandle} name="recipe_name" type="textbox" className="form-control" id="recipe_name_edit" required onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}/>
                            </div>
                        </div>

                        <div className="center-that-works">
                            <div className="home-made-flex">
                                <div className="form-group">
                                    <label htmlFor="serving_edit" className="col-form-label text-black">Serving</label>
                                    <div className="col-sm-10">
                                        <input onChange={servingHandle} name="serving" type="number" className="form-control" id="serving_edit" required onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}/>
                                    </div>
                                    <label htmlFor="time_edit" className="col-form-label text-black">Prep Time</label>
                                    <div className="col-sm-10">
                                        <input onChange={prepHandle} name="prep_time" type="number" className="form-control" id="time_edit" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}/>
                                    </div>
                                    <label htmlFor="time_edit" className="col-form-label text-black">Cooking Time</label>
                                    <div className="col-sm-10">
                                        <input onChange={cookingHandle} name="cooking_time" type="number" className="form-control" id="time_edit" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button  type="submit" className="btn btn-primary submit-button-top-margin" id="recipe_submit">Post Recipe</button>
                        {/* <button onClick={handleClick} className="btn btn-primary submit-button-top-margin">DEBUG</button> */}
                    </div>


                    <div className="col-md-7 home-made-flex px-0 bg-light bg-opacity-50 m-4 px-4">

                        <div className="col-md-5">
                            <div className="form-group">
                            <label htmlFor="cuisine_edit" className="col-form-label text-black">Cuisine</label>
                            <div className="col-sm-11">
                                <input onChange={cuisineHandle} name="cuisine" type="textbox" className="form-control" id="cuisine_edit" placeholder="Enter your cuisine" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }} />
                            </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="form-group">
                            <div className="col-sm-11">
                                <label htmlFor="diet_edit" className="col-form-label text-black">Diet</label>

                                <AsyncCreatableSelect id="diet_edit" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                name = {"diets"}
                                cacheOptions
                                defaultOptions
                                isMulti
                                placeholder="Enter Diets"
                                loadOptions={promiseOptions}
                                onChange={dietsHandle}
                                />

                            </div>
                            </div>
                        </div>


                        <div className="col-md-10">
                            <div className="form-group">
                            <label htmlFor="ingredients_edit" className="col-form-label text-black">Ingredients</label>

                            {ings_boxes}

                            <div>
                                <button onClick={newIngredient}>Add Ingredient</button>
                                {ings_info.length > 0 ? <button onClick={rmIngredient}>Remove Ingredient</button> : <></> }
                            </div>

                            </div>
                            <div id="steps" className="form-group">
                            <label className="col-form-label text-black" >Steps</label>

                            {steps}
                            
                            </div>
                            <div>
                                <button onClick={newStep}>Add Step</button>
                                {steps_info.length > 0 ? <button onClick={rmStep}>Remove Step</button> : <></> }
                            </div>
                        </div>

                    </div>

                    <div className="col-md-11 text-center bg-light bg-opacity-50 mx-5 my-4 p-4">
                        {live_converted_html}
                    </div>

                </div>
            </form>
        </>

    )
}

export default NewRecipes
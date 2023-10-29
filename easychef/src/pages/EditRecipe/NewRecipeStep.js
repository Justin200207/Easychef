import {useContext, useState} from "react"

import RecipeContext from "../../contexts/RecipeContext";

import "./styles.css"

const RecipeStep = ({index, steps, def, old}) => {

    const {recipe, setRecipe} = useContext(RecipeContext)

    var [imagesChanged, setImagesChanged] = useState(!old)

    var step_id = 'step'+index
    var file_id = 'stepFile'+index

    const prepHandle = (event) => {
        steps[index] = {...steps[index], prep_time: event.target.value}
        setRecipe({...recipe, steps: steps})
    }

    const cookingHandle = (event) => {
        steps[index] = {...steps[index], cooking_time: event.target.value}
        setRecipe({...recipe, steps: steps})
    }

    const textHandle = (event) => {
        steps[index] = {...steps[index], text: event.target.value}
        setRecipe({...recipe, steps: steps})
    }

    const imageHandle = (event) => {
        steps[index] = {...steps[index], add_step_images: Array.from(event.target.files)}
        setRecipe({...recipe, steps: steps})
        setImagesChanged(true)
    }

    return (
        <>
            <div className="col-sm-20">
                <h1 className="col-form-label text-black">Step {index + 1}:</h1>
                <div className="home-made-flex">
                    <div className="form-group">
                    <input onChange={prepHandle} defaultValue={def === undefined ? '' : def.prep_time === null ? '' : def.prep_time} type="number" className="form-control" placeholder="Prep Time" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}/>
                    </div>
                    <div className="form-group">
                    <input onChange={cookingHandle} defaultValue={def === undefined ? '' : def.cooking_time === null ? '' : def.cooking_time} type="number" className="form-control" placeholder="Cooking Time" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}/>
                    </div>
                </div>
                <textarea onChange={textHandle} defaultValue={def === undefined ? '' : def.text === null ? '' : def.text} className="form-control" id={step_id} rows="1" placeholder="Enter Step Details..." name="steps" required></textarea>
                <input onChange={imageHandle}  className="form-control" type="file" id={file_id} multiple />
                {!imagesChanged ? <h6>Previously uploaded images are saved</h6> : <></>}
            </div>
        </>
    )

}

export default RecipeStep

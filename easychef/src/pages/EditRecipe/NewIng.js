import {useContext} from "react"
import AsyncCreatableSelect from 'react-select/async-creatable'

import RecipeContext from "../../contexts/RecipeContext";

import "./styles.css"

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

const NewIng = ({index, ings, def}) => {

    const {recipe, setRecipe} = useContext(RecipeContext)

    const ingredientsHandle = (choice) => {
        var chosen = convertFromOptions([choice])[0]
        ings[index] = {...ings[index], ingredient: {name: chosen}}
        setRecipe({...recipe, ingredients: ings})
    }

    const  measureHandle = (event) => {
        ings[index] = {...ings[index], measure_type: event.target.value}
        setRecipe({...recipe, ingredients: ings})
    }

    const  quantityHandle = (event) => {
        ings[index] = {...ings[index], quantity: event.target.value}
        setRecipe({...recipe, ingredients: ings})
    }

    const promiseOptions = (input) => new Promise(
        (resolve) => {
            setTimeout(() => {
                if (input === '') {
                    input = '*'
                }
                fetch('http://localhost:8000/recipe/ingredients/'+input+'/', {
                    method: "GET",
                    mode: "cors",
                })
                .then(response => response.json())
                .then(data => resolve(convertToOptions(data.results)));
            }, 1000)
        }
    )

    return (
        <>
            <div id="ing_div">
                <AsyncCreatableSelect id="ingredients_edit" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}
                name = {"ingredients"}
                cacheOptions
                defaultOptions
                closeMenuOnSelect={false}
                placeholder="Enter Ingredients"
                defaultValue={def === undefined ? [] : convertToOptions([def.ingredient])}
                loadOptions={promiseOptions}
                onChange={ingredientsHandle}
                />
                <div className="home-made-flex">
                    <div className="form-group">
                    <input onChange={measureHandle} defaultValue={def === undefined ? '' : def.measure_type === null ? '' : def.measure_type} type="text" className="form-control" placeholder="Measure Type" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }} required/>
                    </div>
                    <div className="form-group">
                    <input onChange={quantityHandle} defaultValue={def === undefined ? '' : def.quantity === null ? '' : def.quantity} type="number" className="form-control" placeholder="Quantity" onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }} required/>
                    </div>
                </div>
            </div>
        </>
    )

}

export default NewIng

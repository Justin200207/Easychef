import { useEffect, useState } from 'react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';


const ingsInfoToArray = (ing_info) => {
    var ret = [] // [ str(name + quantity + measure_type), ... ]

    // These must correlate
    var temp_name = [] 
    var temp_measure = [] 
    var temp_quantity = []

    ing_info.forEach((rec) => {
        if (Array.isArray(rec)) {

            rec.forEach((ing) => {

                const name = ing.ingredient.name.toString();
                const measure = ing.measure_type.toString();
                const quantity = ing.quantity

                var found = false
                for (let index = 0; index < temp_name.length; index++) {
                    if (temp_name[index] === name && temp_measure[index] === measure) {
                        temp_quantity[index] = Math.round( (temp_quantity[index] + parseFloat(quantity)) * 100) /100
                        found = true
                    }
                }
                if (found === false) {
                    temp_name.push(name)
                    temp_measure.push(measure)
                    temp_quantity.push(Math.round(parseFloat(quantity) * 100) /100)
                }

            })

        }
    })

    for (let i = 0; i < temp_name.length; i++) {
        ret.push(temp_name[i]+ " " +temp_quantity[i]+ " " +temp_measure[i])
    }

    return ret
}

const ingsArrayToHtml = (array) => {
    var ret = []
    for (let i = 0; i < array.length; i++) {
        ret.push(<p key={i * 10000}>{array[i]}</p>)
    }
    return ret
}

const ShoppingCard = ({index, data, ing_info, update}) => {

    var [loaded, setLoaded] = useState(false)
    var [servings, setServings] = useState(data.serving)

    var [base_quantity] = useState([])

    useEffect(() => {
        if (loaded === false) {
            setLoaded(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (loaded === true) {
            // console.log(index)

            for (let i = 0; i < ing_info[index].length; i++) {
                const temp = Math.round( (ing_info[index][i].quantity / data.serving) * 100 ) / 100
                ing_info[index][i].quantity = temp

                base_quantity.push(temp)
            }
            setServings(1)
            update(ingsArrayToHtml(ingsInfoToArray(ing_info)))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded])


    const increaseHandler = (event) => {
        if (base_quantity !== null) {
            for (let i = 0; i < ing_info[index].length; i++) {
                ing_info[index][i].quantity = Math.round( (ing_info[index][i].quantity + base_quantity[i]) * 100 ) / 100
                // console.log(ing_info[index][i].quantity)
            }
            setServings(servings + 1)
            update(ingsArrayToHtml(ingsInfoToArray(ing_info)))
        }
    }

    const decreaseHandler = (event) => {
        if (servings > 0 && base_quantity !== null) {
            for (let i = 0; i < ing_info[index].length; i++) {
                ing_info[index][i].quantity = Math.round( (ing_info[index][i].quantity - base_quantity[i]) * 100 ) / 100
                // console.log(ing_info[index][i].quantity)
            }
            setServings(servings - 1)
            update(ingsArrayToHtml(ingsInfoToArray(ing_info)))
        }
    }

    return (
        <>
            {loaded ?
            <div  key={index}>
                <RecipeCard recipe={data} />
                <div className="number-buttons">
                    <button onClick={decreaseHandler} className="btn btn-primary">-</button>
                    <span className="badge bg-white text-dark mx-2 flex-fill text-center">{servings}</span>
                    <button onClick={increaseHandler} className="btn btn-primary">+</button>
                </div>
            </div>
            :
            <></>}
        </>
    )

}

export default ShoppingCard;
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles.css";
import { useEffect, useState } from 'react';


const ShoppingListCounter = ({ ingredients, ings, i }) => {
    useEffect(() => {
        if(ings != undefined){
            for(let i = 0; i < ingredients.length; i++){
                const k = ingredients[i].ingredient.name + " " + ingredients[i].measure_type;
                const v = ingredients[i].quantity
                ings[k] = v
                //setIngs(ings => ({...ings, [k]:v}));
            }
        }
    },[]);

    const [num, setNum] = useState(1);

    function increase(){
        setNum(num + 1)
    }

    function decrease(){
        if(num > 1){
            setNum(num - 1)
        }
    }

    return (
        <>  
        <div className="number-buttons">
            <button className="btn btn-primary" onClick={decrease}>-</button>
            <span className="badge bg-white text-dark mx-2 flex-fill text-center">{num}</span>
            <button className="btn btn-primary" onClick={increase}>+</button>
            </div>
        </>
    )
}

export default ShoppingListCounter
import { createContext, useState } from "react";

export const useIngredientContext = () => {
    const [ingredient, setIngredient] = useState({
        ingredient: {name: ''},
        quantity: '',
        measure_type: '',
    })

    return {
        ingredient,
        setIngredient,
    }
}

const IngredientContext = createContext({
    ingredient: {
        ingredient: {name: ''},
        quantity: '',
        measure_type: '',
    },
    setIngredient: () => {},
});

export default IngredientContext

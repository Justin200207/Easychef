import { createContext, useState } from "react";

export const useRecipeContext = () => {
    const [recipe, setRecipe] = useState({
        owner: '',
        name: '',
        rating: '',
        fav_counter: '',
        diets: [],
        cuisine: '',
        ingredients: [],
        serving: '',
        prep_time: null,
        cooking_time: null,
        steps: [],
        add_recipe_images: [], // POST only (id of images)
        recipe_images: [], // GET only
        comments: [], // GET only
    })

    return {
        recipe,
        setRecipe,
    }
}

const RecipeContext = createContext({
    recipe: {
        owner: '',
        name: '',
        rating: '',
        fav_counter: '',
        diets: [],
        cuisine: '',
        ingredients: [],
        serving: '',
        prep_time: '',
        cooking_time: '',
        steps: [],
        add_recipe_images: [], // POST only (id of images)
        recipe_images: [], // GET only
        comments: [], // GET only
    },
    setRecipe: () => {},
});

export default RecipeContext

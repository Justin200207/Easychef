import logo from "../../images/logo.png"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"
import SearchBar from '../../components/SearchBar/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RecipeCard from '../../components/RecipeCard/RecipeCard';

const HomePage = () => {

    const navigate = useNavigate();
    var [recipes, setRecipes] = useState([]);
    let url = "http://localhost:8000/recipe/search/";

    useEffect(() => {
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
                setRecipes(recipes => [])
                if (recipes.length === 0) {
                    for (let i = 0; i < 3; i++) {
                        setRecipes(recipes => [...recipes, <RecipeCard key={i} recipe={data["results"][i]} />]);
                    }
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (

        <>
            <img width="300" height="300" src={logo} alt="" />
            <SearchBar />
            <div className="cardContainer" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {recipes}
            </div>
        </>

    )
}

export default HomePage
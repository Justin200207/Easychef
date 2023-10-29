import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles.css";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";



const SearchBar = () => {
    const navigate = useNavigate();

    const [main, setMain] = useState('');
    const [type, setType] = useState('Recipe Name');
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [mpt, setMPT] = useState('');
    const [lpt, setLPT] = useState('');
    const [mct, setMCT] = useState('');
    const [lct, setLCT] = useState('');

    function handleMainChange(event){
        setMain(event.target.value)
    }

    function handleTypeChange(event){
        setType(event.target.value);
    }

    function handleDietChange(event){
        setDiet(event.target.value)
    }

    function handleCuisineChange(event){
        setCuisine(event.target.value);
    }

    function handleMPTChange(event){
        setMPT(event.target.value);
    }

    function handleLPTChange(event){
        setLPT(event.target.value);
    }

    function handleMCTChange(event){
        setMCT(event.target.value);
    }

    function handleLCTChange(event){
        setLCT(event.target.value);
    }

    const handleSubmit = () => {
            let url = "?";
            if(main !== ""){
                if (type === "Recipe Name"){
                    url += "name=" + main;
                }else if(type === "Creator Name"){
                    url += "owner=" + main;
                }else{
                    url += "ingredient=" + main;
                }
            }
            if(diet !== ""){url += "&diets=" + diet;}
            if(cuisine !== ""){url += "&cuisine=" + cuisine;}
            if(lpt !== ""){url += "&lpt=" + lpt}
            if(mpt !== ""){url += "&mpt=" + mpt}
            if(lct !== ""){url += "&lct=" + lct}
            if(mct !== ""){url += "&mct=" + mct}
            navigate("/search" + url);
    }
    

    return (
        <>  
        <div className="input-group text-center d-flex justify-content-center">
            <input type="text" className="searchBar mt-0" placeholder="Find a recipe..." onChange={handleMainChange} onKeyUp={e => {if (e.key === 'Enter') handleSubmit()}} />
            <span className="input-group-text mt-0">
                <div className="btn-group dropend">
                    <button className="btn btn-secondary barButton" data-bs-toggle="dropdown">
                        <img alt='Filter' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFxJREFUSEtjZKAxYKSx+QyjFhAM4eEZRP8J+hu/ApRQwRZENLeAQg+gah/wSCY2uHA6lJAPaG4BxfFByAd0tQA9uIhyHFGKoN6guQVkBRcpPhi1gKwQIKhp6McBACZ4Bhljo5edAAAAAElFTkSuQmCC" />
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <select className="dropdown-item form-select" defaultValue={'sel1'} onChange={handleTypeChange}>
                                <option disabled>Search By:</option>
                                <option id='sel1'>Recipe Name</option>
                                <option>Creator Name</option>
                                <option>Ingredient</option>
                            </select>
                        </li>
                        <li className="px-100">
                            <input className="form-control border-0  dropdown-item" type="text" placeholder='Diet...' onChange={handleDietChange} />
                        </li>
                        <li>
                            <input className="form-control border-0  dropdown-item" type="text" placeholder='Cuisine...' onChange={handleCuisineChange} />
                        </li>
                        <li>
                            <label className="form-label dropdown-item">Prep Time</label>
                        </li>
                        <li>
                            <div className="d-inline-block w-50">
                                <input type="number" className="form-control border-0" placeholder="Min." min="0" onChange={handleLPTChange} />
                            </div>
                            <div className="d-inline-block w-50">
                                <input type="number" className="form-control border-0" placeholder="Max" min="0" onChange={handleMPTChange} />
                            </div>
                        </li>
                        <li>
                            <label className="form-label dropdown-item">Cook Time</label>
                        </li>
                        <li>
                            <div className="d-inline-block w-50">
                                <input type="number" className="form-control border-0" placeholder="Min." min="0" onChange={handleLCTChange} />
                            </div>
                            <div className="d-inline-block w-50">
                                <input type="number" className="form-control border-0" placeholder="Max" min="0" onChange={handleMCTChange} />
                            </div>
                        </li>
                    </ul>
                    <button className="btn btn-secondary barButton" onClick={handleSubmit}>
                        <img alt='Search' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAASdJREFUSEvVlcENwjAMRX83gUmASYBJgEmASYBJgElAT7IlF5I0KukBX6qW2M/fdkynia2bOL5KgJmkjaSFpKWkh6SrpKekk70P5pcD7CXtCt7AzpI4V7QU4GIZ43iwrMkcRSjh6XC+r0qETwAlOZr8rQVP+QMhEZ4kkVUSARy+WzSyIruSoQYI5comEwFedxqIQ42hFtVZFRHghwkOpMZcRbYXEUB5KNO8dgTtPH6UCb8v+xVAwJdFTY58/OjjWdNgz9SnLtu3Vk2uAowdU9Rk+zb2ovn0+G2vumheVx9X3pF+C5fO10XcU0wQfeNZnKL449Cy88zXNqpZyNC6phS+rglKIBR5SeJOSkJa/OEUIS0AKIuQ3qppBXAIJe3tsZaA5HL8f8AbD75NGeBb0w4AAAAASUVORK5CYII=" />
                    </button>
                </div>
            </span>
        </div>
        </>
    )
}

export default SearchBar
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";

import RecipeCard from '../../components/RecipeCard/RecipeCard';


const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();


  var [recipes, setRecipes] = useState([]);

  const name = new URLSearchParams(location.search).get("name");
  const owner = new URLSearchParams(location.search).get("owner");
  const ingredient = new URLSearchParams(location.search).get("ingredient");
  const diet = new URLSearchParams(location.search).get("diets");
  const cuisine = new URLSearchParams(location.search).get("cuisine");
  const lpt = new URLSearchParams(location.search).get("lpt");
  const mpt = new URLSearchParams(location.search).get("mpt");
  const lct = new URLSearchParams(location.search).get("lct");
  const mct = new URLSearchParams(location.search).get("mct");

  const [loadMore, setBottomReached] = useState(false);
  let origionalURL = "http://localhost:8000/recipe/search/?";
  if (name != null) {
    origionalURL += "name=" + name;
  } else if (owner != null) {
    origionalURL += "owner=" + owner;
  } else if (ingredient != null){
    origionalURL += "ingredient=" + ingredient;
  }
  if (diet != null) { origionalURL += "&diet=" + diet; }
  if (cuisine != null) { origionalURL += "&cuisine=" + cuisine; }
  if (lpt != null) { origionalURL += "&lpt=" + lpt }
  if (mpt != null) { origionalURL += "&mpt=" + mpt }
  if (lct != null) { origionalURL += "&lct=" + lct }
  if (mct != null) { origionalURL += "&mct=" + mct }

  const [url, setURL] = useState(origionalURL);


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight === scrollHeight) {
      setBottomReached(true);
    } else {
      setBottomReached(false);
    }
  }

  const getCards = () => {
    if (url != null) {
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
          setURL(data["next"]);
          for (let i = 0; i < data.results.length; i++) {
            setRecipes(recipes => [...recipes, <RecipeCard key={i} recipe={data["results"][i]} />]);
          }
        })
    }
  }

  useEffect(() => {
    if (loadMore) {
      getCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore]);



  useEffect(() => {
    fetch(origionalURL, {
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
          setURL(data["next"]);
          for (let i = 0; i < data.results.length; i++) {
            setRecipes(recipes => [...recipes, <RecipeCard key={i} recipe={data["results"][i]} />]);
          }
        }
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (

    <>
      <div id="wrapper">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div className='cardContainer'>
            {recipes}
          </div>
        </div>
      </div>
    </>

  )
}

export default Search
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";

import RecipeCard from '../../components/RecipeCard/RecipeCard';


const MyCreations = () => {
  const navigate = useNavigate();


  var [recipes, setRecipes] = useState([]);

  const [loadMore, setBottomReached] = useState(false);
  let origionalURL = "http://localhost:8000/recipe/mycreations/";

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
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken")
        }
      })
        .then(response => {
          if (!response.ok) {
            navigate("/login")
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
      headers: {
        Authorization: "Bearer " + localStorage.getItem("authToken")
      }
    })
      .then(response => {
        if (!response.ok) {
          navigate("/login")
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

export default MyCreations
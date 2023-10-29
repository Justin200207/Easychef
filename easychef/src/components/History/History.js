import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";

import RecipeCard from '../../components/RecipeCard/RecipeCard';


const History = () => {
  const navigate = useNavigate();


  var [recipes, setRecipes] = useState([]);

  const [loadMore, setBottomReached] = useState(false);
  let origionalURL = "http://localhost:8000/recipe/history/";

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
            setRecipes(recipes => [...recipes, <div><RecipeCard key={i} recipe={data.results[i].rec_ob}/><h4>{data.results[i].interaction}</h4></div>]);
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
        setRecipes([])
        if (recipes.length === 0) {
          setURL(data["next"]);
          for (let i = 0; i < data.results.length; i++) {
            setRecipes(recipes => [...recipes, <div><RecipeCard key={i} recipe={data.results[i].rec_ob} /><h4>{data.results[i].interaction}</h4></div>]);
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

export default History
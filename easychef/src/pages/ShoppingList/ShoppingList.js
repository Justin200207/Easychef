import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";

import ShoppingCard from "./ShoppingCard";


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

                // console.log(name)

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

    // console.log(temp_name)
    // console.log(temp_measure)
    // console.log(temp_quantity)

    for (let i = 0; i < temp_name.length; i++) {
        ret.push(temp_name[i]+ " " +temp_quantity[i]+ " " +temp_measure[i])
    }

    // console.log(ret)

    return ret
}

const ingsArrayToHtml = (array) => {
    var ret = []
    for (let i = 0; i < array.length; i++) {
        ret.push(<p key={i * 10000}>{array[i]}</p>)
    }
    return ret
}

const ShoppingList = () => {
    const navigate = useNavigate();

    var [recipes, setRecipes] = useState([]);

    var [loaded, setLoaded] = useState(false)
    var [data, setData] = useState(null)

    var [ing_info] = useState([]);

    var [ing_info_html, setIngHtml] = useState([]);

    let url = "http://localhost:8000/recipe/shoppinglist/";

    useEffect(() => {
        if (loaded === false) {
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
                    setData(data)
                    setLoaded(true)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const showIng = () => {
        setIngHtml(ingsArrayToHtml(ingsInfoToArray(ing_info)))
    }

    useEffect(() => {
        if (loaded === true) {
            if (recipes.length === 0) {
                for (let i = 0; i < data.length; i++) {
                    ing_info.push(data[i].rec_ob.ingredients);
                    setRecipes(recipes => [...recipes,
                    <ShoppingCard key={i} index={i} data={data[i].rec_ob} ing_info={ing_info} update={setIngHtml}/>]
                    );
                }
            }
            showIng()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded])

    return (

      <>
        {loaded ?
          <div id="wrapper">
            <div style={{"float":"left"}}className="col-md-2 text-center mx-5 my-4 px-4 py-4">
            <div className="my-2 px-4 py-4 bg-light bg-opacity-50">
              <h3>Ingredients Needed</h3>
              {ing_info_html}
            </div>
            </div>
            <div style={{"float":"right"}}className="col-md-8 text-black mx-5">
              <div className="col-md-10 px-4 py-4">
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
            </div>
          </div>
          :
          <></>}
      </>

    )
}

export default ShoppingList
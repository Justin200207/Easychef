import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Card from 'react-bootstrap/Card';
import "./styles.css";

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import logo from '../../images/logo.png';

const RecipeCard = ({ recipe }) => {

    var [image, setImage] = useState(logo)

    useEffect( () => {
        if (recipe != null && recipe.recipe_images.length > 0) {
            setImage(recipe.recipe_images[0].recipe_image)
        }
    }, [recipe])

    return (
        <>  
            { recipe != null ?
            <Link className="linkUnstyleWhite" to={`/recipes/?id=${recipe.id}`}>
                <Card className="recCard" style={{ width: '18rem' }}>
                    <Card.Body className="text-center">
                    <div
                        className='mx-auto'
                        style={{
                            width: "90%",
                            height: "60%",
                            backgroundImage: `url(${image})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                        }}
                    />
                        <Card.Title>{recipe.name}</Card.Title>
                        <Card.Text>{recipe.rating == null ? "Not Rated" : recipe.rating + "\u2606"}</Card.Text>
                        <Card.Text>{recipe.prep_time == null ? "Prep: --" : "Prep: " + recipe.prep_time} | {recipe.cooking_time == null ? "Cook: --" : "Cook: " + recipe.cooking_time}</Card.Text>
                    </Card.Body>
                </Card>
            </Link>
            : 
            <></>
            }
        </>
    )
}

export default RecipeCard
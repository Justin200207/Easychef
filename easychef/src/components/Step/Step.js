import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Card from 'react-bootstrap/Card';
import ImageCarousel from "../ImageCarousel/ImageCarousel";

const Step = ({ step, num}) => {

    let images = []

    if (step != null && step.step_images.length > 0) {
        for(let i = 0; i < step.step_images.length; i++){
            images.push(step.step_images[i].step_image)
        }
    }

    return (
        <>  
            { step != null ?
                <Card className="recCard" style={{ width: '600px', "height": "fit-content"}}>
                    <Card.Body className="text-center">
                    { images.length > 0 ? 
                    <ImageCarousel images={images} height={150}></ImageCarousel> : <></>
                    }
                    <Card.Text>Prep Time : {step.prep_time} | Cooking Time : {step.cooking_time}</Card.Text>
                    <Card.Title>{num}. {step.text}</Card.Title>
                    </Card.Body>
                </Card>
            : 
            <></>
            }
        </>
    )
}

export default Step
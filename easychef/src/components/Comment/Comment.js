import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Card from 'react-bootstrap/Card';
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";

const Comment = ({ comment }) => {

    let images = []

    if (comment != null && comment.comment_images.length > 0) {
        for (let i = 0; i < comment.comment_images.length; i++) {
            images.push(comment.comment_images[i].comment_image)
        }
    }

    return (
        <>
            {comment != null ?
                <Card className="recCard" style={{ width: '18rem' }}>
                    <Card.Body className="text-center">
                        
                        <Card.Title><img src={comment.owner.profile_pic} height={"25px"}/>{comment.owner.first_name} {comment.owner.last_name} says...</Card.Title>
                        <Card.Text>{comment.text}</Card.Text>
                        {images.length > 0 ?
                            <ImageCarousel images={images} height={150}></ImageCarousel> : <></>
                        }
                    </Card.Body>
                </Card>
                :
                <></>
            }
        </>
    )
}

export default Comment
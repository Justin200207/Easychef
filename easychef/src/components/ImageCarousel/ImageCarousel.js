import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';

import logo from '../../images/logo.png';
import other from '../../images/no_image.png';
import './styles.css'


/* const Comment = ({ comment }) => { */

const ImageCarousel = ({images, height}) => {
  return (
    images !== undefined ?
    <Carousel>
        {images.map((img, index) =>(
            <Carousel.Item key={index}><div style={{"height": height + "px", "display": "flex", "justifyContent": "center"}}><img
            className="crslImg"
            src={img}
            alt="First slide"
          /></div></Carousel.Item>
        ))}
    </Carousel>
    :
    <></>
  );
}

export default ImageCarousel;





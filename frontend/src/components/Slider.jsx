import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/src/assets/img/s1.jpg",
  "/src/assets/img/s2.gif",
  "/src/assets/img/s3.jpg",
  "/src/assets/img/s4.jpg",
];

const HomeSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <div className="w-full mx-auto my-8">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx}>
            <img src={src} alt={`slide-${idx}`} className="w-full h-64 object-cover rounded-lg" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;
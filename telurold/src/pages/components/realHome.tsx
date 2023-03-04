import { useEffect, useState } from "react";
import ImageSlider from "./imageSlider";


interface Carousel {
    ID: number;
    url: string;
  }

const RealHome = () => {
    const [carousels, setCarousels] = useState<Carousel[]>([]);

    const slides = [
        {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2Fdownload.jpg?alt=media&token=409fd672-2a7d-4496-a674-00837bb494e3"}
    ];

    console.log(slides);
    
    //create function to get slides from firebase


    useEffect(() => {
        fetch('http://localhost:1234/getCarousel')
        .then((response) => response.json())
        .then((data) => {
            setCarousels(data.data);
            console.log("-----------------------");
            console.log(data.data)
            console.log(carousels);
            
            
        })
        .catch((error) => {
            console.error(error);
        });

        // carousels.forEach(carousel => {
        //     slides.push({url: carousel.url})
        // });
    }, []);

    console.log("++++++++++++++++++++");
    console.log(carousels);
    carousels.forEach(carousel => {
        slides.push({url: carousel.url})
    });
    
    



    // const slides = [
    //     // {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2FWIN_20221214_15_22_42_Pro.jpg?alt=media&token=2d9205e1-5330-4965-96eb-b16b12175919"},
    //     // {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2F58485741_p0.png?alt=media&token=f97c4830-584b-46e5-a84f-829b106b560e"},
    //     // {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2F232000.jpg?alt=media&token=ede72fa1-de91-4c7f-8a3e-53ff28bbd756"}
    // ]

    return (
        <div className="slider-container">
            <ImageSlider slides={slides} />
        </div>
    );
}
 
export default RealHome;
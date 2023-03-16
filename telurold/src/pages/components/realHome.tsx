import { useEffect, useState } from "react";
import ImageSlider from "./imageSlider";
import style from "../../styles/style.module.scss"
import PopularCategories from "./popularCategories";
import computer from "../../../assets/computer.png"
import laptop from "../../../assets/laptop.png"
import keyboard from "../../../assets/keyboard.png"

import appliances from "../../../assets/appliances.png"
import tv from "../../../assets/tv.png"
import headphone from "../../../assets/headphones.png"
import gaming from "../../../assets/console.png"
import network from "../../../assets/wifi-router.png"
import smart_home from "../../../assets/smart-home.png"
import office from "../../../assets/printer.png"
import software from "../../../assets/software.png"
import automotive from "../../../assets/automotive.png"
import home from "../../../assets/house.png"
import sport from "../../../assets/sport.png"
import drone from "../../../assets/camera-drone.png"
import ProductList from "./productsList";


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
        <div className={style.home_big_container}>
            <div className={style.top_home_page}>
                <div className={style.popular_container}>   
                    <PopularCategories logo={computer} title="Components & Storage" onHover={<RealHome/>} />
                    <PopularCategories logo={laptop} title="Computer Systems" onHover={<RealHome/>} />
                    <PopularCategories logo={keyboard} title="Computer Peripherals" onHover={<RealHome/>} />
                    <PopularCategories logo={appliances} title="Appliances" onHover={<RealHome/>} />
                    <PopularCategories logo={tv} title="TV & Home Theater" onHover={<RealHome/>} />
                    <PopularCategories logo={headphone} title="Electronics" onHover={<RealHome/>} />
                    <PopularCategories logo={gaming} title="Gaming & VR" onHover={<RealHome/>} />
                    <PopularCategories logo={network} title="Networking" onHover={<RealHome/>} />
                    <PopularCategories logo={smart_home} title="Smart Home & Security" onHover={<RealHome/>} />
                    <PopularCategories logo={office} title="Office Solutions" onHover={<RealHome/>} />
                    <PopularCategories logo={software} title="Software & Services" onHover={<RealHome/>} />
                    <PopularCategories logo={automotive} title="Automotive & Tools" onHover={<RealHome/>} />
                    <PopularCategories logo={home} title="Home & Outdoors" onHover={<RealHome/>} />
                    <PopularCategories logo={sport} title="Health & Sports" onHover={<RealHome/>} />
                    <PopularCategories logo={drone} title="Toys, Drones & Maker" onHover={<RealHome/>} />

                </div>

                <ImageSlider slides={slides} />

                {/* <div style={{
                    height: "1000px"
                }}></div> */}
            </div>

            <div className={style.bot_home_page}>
                <ProductList/>
            </div>
        </div>
    );
}
 
export default RealHome;
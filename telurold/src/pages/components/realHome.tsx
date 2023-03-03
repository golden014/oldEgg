import ImageSlider from "./imageSlider";

const RealHome = () => {

    //create function to get slides from firebase



    const slides = [
        {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2FWIN_20221214_15_22_42_Pro.jpg?alt=media&token=2d9205e1-5330-4965-96eb-b16b12175919", title: "tess"},
        {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2F58485741_p0.png?alt=media&token=f97c4830-584b-46e5-a84f-829b106b560e", title: "tessssss"},
        {url: "https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/carousel%2F232000.jpg?alt=media&token=ede72fa1-de91-4c7f-8a3e-53ff28bbd756", title: "ahsjdad"}
    ]

    return (
        <div className="slider-container">
            <ImageSlider slides={slides} />
        </div>
    );
}
 
export default RealHome;
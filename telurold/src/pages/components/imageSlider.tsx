import { useState } from 'react'
import style from "../../styles/style.module.scss"

interface ImageSliderObject {
    slides: {
        url: string;
      }[];
}

enum sliderType{
    ADD = "ADD",
    SUBTRACT = "SUBSTRACT"
}

const ImageSlider: React.FC <ImageSliderObject> = ({ slides }) => {

    let [currIdx, setCurrIdx] = useState(0)

    const setSliderIndex = (type:sliderType) => {
        switch (type) {
            case sliderType.ADD:
              if (currIdx < slides.length - 1) {
                setCurrIdx(currIdx + 1);
              }else if(currIdx === slides.length-1){
                  setCurrIdx(0);
              }
              break;
            case sliderType.SUBTRACT:
              if (currIdx > 0) {
                setCurrIdx(currIdx - 1);
              }else if(currIdx === 0){
                setCurrIdx(slides.length - 1)
              }
              break;
            default:
              break;
          }
      
    }
    
    return (  
        <div className={style.slider_container} >
            <button className={style.slider_button_left} onClick={()=> { setSliderIndex(sliderType.SUBTRACT)}}>
                &lt;
            </button>
            <div style={
                { backgroundImage: `url(${slides[currIdx].url})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',   
                transition: 'background-image 0.3s ease-in-out',
                width: "100vw",
                height: "70vh"
            }

                }>
                {/* <h2>{slides[currIdx].title}</h2> */}
            </div>
            <button className={style.slider_button_right} onClick={()=>{ setSliderIndex(sliderType.ADD) }}>
                &gt;
            </button>
        </div>
    );
}
 
export default ImageSlider;
import Theme from "./components/theme";
import { storage } from "../firebaseconfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useState, useEffect } from "react"
import style from "../styles/style.module.scss"

interface Carousel {
    ID: number;
    url: string;
  }

const EditCarousel = () => {


    const [carouselUpdate, setCarouselUpdate] = useState(false);


    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (event:any) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            console.log('No file selected!');
            return;
        }
        const storageRef = ref(storage, `carousel/${selectedFile.name}`);
        const snapshot = await uploadBytesResumable(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("downloadURL: " + downloadURL);
        
        if (downloadURL) {
            try {
                const res = await fetch("http://localhost:1234/addCarousel", {
                        method: "POST",
                        headers: {"Content-Type" : "application/json;;charset=utf-8"},
                        body: JSON.stringify({ 
                            url:downloadURL
                        })
                    })
                if (res.ok) {
                    setCarouselUpdate(!carouselUpdate)
                } else {
                    console.log(res);
                }
            } catch (error) {
                if (error instanceof Error) {
                    // setErrorMsg(error.message);
                    console.log(error);
                }
            }
        
        }
    
    }

    
    const [carousels, setCarousels] = useState<Carousel[]>([]);

    useEffect(() => {
        fetch('http://localhost:1234/getCarousel')
        .then((response) => response.json())
        .then((data) => {
            setCarousels(data.data);
            console.log("---------------");
            console.log(carousels);
            

        })
        .catch((error) => {
            console.error(error);
        });
    }, [carouselUpdate]);

    console.log("carousels:");
    
    console.log(carousels);
    console.log(carousels[0])

    const handleRemove = async (carousel:Carousel) => {
        console.log("selected id: " + carousel.url)
        console.log("aaaaa");
        
        console.log(carousel.ID)
        try {
            const res = await fetch("http://localhost:1234/removeCarousel", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json;;charset=utf-8"},
                    body: JSON.stringify({ 
                        ID:carousel.ID
                    })
                })
            if (res.ok) {
                // alert("Remove Success !")
                setCarouselUpdate(!carouselUpdate); 
            } else {
                console.log(res);
            }
        } catch (error) {
            if (error instanceof Error) {
                // setErrorMsg(error.message);
                console.log(error);
            }
    }
    }

    return ( 
        <Theme>
            <div className={style.edit_carousel_container}>
                <div className={style.input_file_container}>
                        <input type="file" onChange={handleFileSelect}/>
                    <button onClick={handleUpload}>Upload</button>
                </div>

                <div className={style.carousel_mid_container}>
                    {/* {carousels.map((carousel:Carousel) => (
                        <div key={carousel.id}>
                            <img src={carousel.url} alt="Carousel" />
                        </div>
                    ))} */}
                    {/* {carousels && carousels.map((carousel: Carousel) => (
                        <div key={carousel.id}>
                            <img src={carousel.url} alt="Carousel" />
                        </div>
                    ))} */}
                    {carousels && carousels.length > 0 && carousels.map((carousel) => (
                        <div key={carousel.ID} className={style.edit_carousel}>
                            <img src={carousel.url} alt="Carousel" style={{width: "400px", height: "200px"}}/>
                            <button onClick={(e) => handleRemove(carousel)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
        </Theme>
        
    );
}
 
export default EditCarousel;
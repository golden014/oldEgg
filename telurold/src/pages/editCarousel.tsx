import Theme from "./components/theme";
 import { storage } from "../firebaseconfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useState, useEffect } from "react"


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
                    // alert("Upload Success !"); 
                    // window.location = window.location
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
    

    // console.log('Uploaded a file:', snapshot);

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
            <input type="file" onChange={handleFileSelect}/>
            <button onClick={handleUpload}>Upload</button>

            <div>
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
                    <div key={carousel.ID}>
                        <img src={carousel.url} alt="Carousel" style={{width: "400x", height: "200px"}}/>
                        <button onClick={(e) => handleRemove(carousel)}>Remove</button>
                    </div>
                ))}
            </div>
        </Theme>
        
    );
}
 
export default EditCarousel;
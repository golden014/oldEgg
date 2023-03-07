import Theme from "./components/theme";
import { useState, useEffect } from "react"
import style from "../styles/style.module.scss"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebaseconfig";


const InsertNewProduct = () => {
    const [storeId, setStoreId] = useState(-1)
    const [productName, setProductName] = useState("")
    const [stock, setStock] = useState(-1)
    const [productDescription, setproductDescription] = useState("")
    const [categoryId, setCategoryId] = useState(-1)
    
    //utk file image nya
    const [tempImage, setTempImage] = useState<File | null>(null)

    //utk firebase
    const [productImage, setProductImage] = useState("")

    //saat temp image berubah, upload ke firebase
    useEffect( () => {
        if (!tempImage) {
            return
        }

        const uploadFirebase = async () => {
            const storageRef = ref(storage, `products/${tempImage.name}`);
            const snapshot = await uploadBytesResumable(storageRef, tempImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setProductImage(downloadURL)
        }

        uploadFirebase()
        console.log("upload done !");
        
        
    }, [tempImage])

    const handleFileSelect = (event:any) => {
        setTempImage(event.target.files[0]);
    }

    const handleAdd = async () => {
        try {
            const res = await fetch("http://localhost:1234/addProduct", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json;;charset=utf-8"},
                    body: JSON.stringify({ 
                        store_id: storeId,
                        product_name: productName,
                        stock: stock,
                        product_description: productDescription,
                        categoryId: categoryId,
                        product_image: productImage,
                    })
                })
            if (res.ok) {
                alert("Insert Success !")
            } else {
                alert("Error")
                console.log(res);
            }
        } catch (error) {
            console.log(error);
            alert("error")
        }
    }

    return (  
        <Theme>
            <div className={style.voucher_balance_container}>
                <div className={style.voucher_balance_input}>
                    <p>Set Product Name</p>
                    <input type="text" placeholder="Product Name" onChange={(e) => setProductName(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Product Description</p>
                    <input type="text" placeholder="Product Description" onChange={(e) => setproductDescription(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Initial Stock</p>
                    <input type="number" placeholder="Initial Stock" onChange={(e) => setStock(parseInt(e.target.value))}/>
                </div>

                <p>Insert image</p>
                {/* <div className={style.voucher_balance_input}> */}
                    <input type="file" onChange={handleFileSelect}/>
                {/* </div> */}
           

                <button onClick={handleAdd}>Insert New Product</button>
            </div>
        </Theme>
    );
}
 
export default InsertNewProduct;
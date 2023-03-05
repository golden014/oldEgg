import Image from "next/image";
import style from "../../styles/style.module.scss"


interface DropDownProps{
    component: JSX.Element;
    img: any;
}

const NavbarDropDown = (props: DropDownProps ) => {

    //ntar tinggal panggil props.component / dll

    //ntar component yg di pass di props dipakai utk dropdown saat
    // diklik (tinggal di show)
    return (  
        <div>
            <Image
            src={props.img}
            alt="img"
            width={20}
            height={20}
            />
            
        </div>

    );
}
 
export default NavbarDropDown;
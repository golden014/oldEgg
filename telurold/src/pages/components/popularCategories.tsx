import Image from "next/image";
import style from "../../styles/style.module.scss"


interface PopularCategoriesProps {
    logo: any;
    title: string;
    onHover: JSX.Element
}

const PopularCategories = (props: PopularCategoriesProps) => {
    return ( 
        <div className={style.popular_categories_container}>
            <br />
            <div className={style.popular_categories}>
                <Image
                src={props.logo}
                alt="img"
                width={25}
                height={25}
                />

                <p>{props.title}</p>
                <p>&gt;</p>
            </div>
        </div>
    );
}
 
export default PopularCategories;
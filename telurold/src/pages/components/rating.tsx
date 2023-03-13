const Rating = (props: {rating:number}) => {
    switch (props.rating) {
        case 1:
            return (
                <p>⭐ ✰ ✰ ✰ ✰</p>
            )
        case 2:
            return (
                <p>⭐⭐ ✰ ✰ ✰</p>
            )
        case 3:
            return (
                <p>⭐⭐⭐ ✰ ✰</p>
            )
        case 4:
            return (
                <p>⭐⭐⭐⭐ ✰ </p>
            )
        default:
            return(
                <p>⭐⭐⭐⭐⭐</p>
            )
    }
}
export default Rating;
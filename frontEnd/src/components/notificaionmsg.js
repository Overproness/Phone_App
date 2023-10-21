const NotificationMsg = (props) => {
    let extraStyle = {}
    if(!(props.msg)){
        return null
    }

    if(props.error !== 200){
        extraStyle = {
            borderColor: "red",
            color: "red"
        }
    }
    if(props.error === 200){
        extraStyle = {
            borderColor: "green",
            color: "green"
        }
    }

    console.log(extraStyle);
    
    return(
        <div style={extraStyle} className="error-msg">
            {props.msg}
        </div>
    )
}

export default NotificationMsg
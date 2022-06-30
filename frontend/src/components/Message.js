import React, {useState, useEffect} from 'react'
import { Alert } from 'react-bootstrap'

function Message({ variant, children, fade=false }) {

    const [isShowingAlert, setShowingAlert] = useState(true); // For message fading out

    useEffect(() => {
        if(fade){
            setTimeout(() => {
                setShowingAlert(false)
              }, 3000);
        }
    }, [])

    return (
        <Alert variant={variant} className={ isShowingAlert ? 'alert-shown' : 'alert-hidden' }>
            {children}
        </Alert>
    )
}

export default Message

import React, {useEffect} from 'react'

import jwt_decode from "jwt-decode"
import googleLogin from '../services/googleLogin'

const { REACT_APP_GOOGLE_CLIENT_ID } = process.env;

//Handle Google Login
window.handleGoogleLogin = async(response) => {
    const access_token = response.credential //access token
    const info = jwt_decode(response.credential)
    const data = {
        email: info.email,
        first_name: info.given_name,
        last_name: info.family_name,
        aud: info.aud //client id, used to validate with the backend
    }
    const userInfo = await googleLogin({ data, access_token })
    localStorage.setItem('userInfo', JSON.stringify(userInfo)) // save returned user data into localstorage
    window.location.reload()
}

function GoogleSignIn() {

    return (
        <div>  
            <div id="g_id_onload"
                data-client_id={REACT_APP_GOOGLE_CLIENT_ID}
                data-login_uri=""
                data-callback="handleGoogleLogin"
                data-auto_prompt="false">
            </div>
            <div class="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left">
            </div>
        </div>
    )
}

export default GoogleSignIn

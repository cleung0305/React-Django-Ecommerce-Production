import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import jwt_decode from "jwt-decode"

import useScript from '../hooks/useScript'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { registerUser } from '../actions/userActions'
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

function RegisterScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : ''

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { userInfo, loading, error } = userRegister

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo:userInfoLogin } = userLogin

    const [sdkReady, setSdkReady] = useState(false) // State determine whether the SDK is ready to be mounted

    useScript("https://accounts.google.com/gsi/client", "google") // mount google api script

    useEffect(() => {
        if(userInfo || userInfoLogin){
            navigate(`/${redirect}`)
        }
        if(window.google){
            setSdkReady(true) //if google api script has mounted, set to true so Google Log In component would appear
        }
    },[navigate, userInfo, redirect])

    const submitRegisterHandler = (e) => {
        e.preventDefault()

        if(password !== confirmPassword){
            setMessage('Password does not match')
        } else{
            dispatch(registerUser(name, email, password))
        }

    }

    return (
        <FormContainer md={6}>
            <h2>Register</h2>
            {message && <Message variant="danger" fade>{message}</Message>}
            {error && <Message variant="danger" fade>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitRegisterHandler}>
                <Form.Group className="my-2" controlid="password">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="my-2" controlid="password">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Username / Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="my-2" controlid="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="my-2" controlid="passwordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                <Button type="submit" variant="primary" className="my-2">Register</Button>

            </Form>

            <Row className="py-3">
                <Col>
                    Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Log in here</Link>
                </Col>
            </Row>
            {
                !sdkReady ? <Loader />
                        : 
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
            }
        </FormContainer>
    )
}

export default RegisterScreen

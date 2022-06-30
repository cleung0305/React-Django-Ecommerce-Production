import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import useScript from '../hooks/useScript'
import GoogleSignIn from '../components/GoogleSignIn'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { loginUser } from '../actions/userActions'

function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : ''

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, loading, error } = userLogin

    const [sdkReadyGoogle, setSdkReadyGoogle] = useState(false) // State determine whether the SDK is ready to be mounted

    useScript("https://accounts.google.com/gsi/client", "google") // mount google api script

    useEffect(() => {
        if (userInfo){
            navigate(`/${redirect}`)
        }
        if(window.google){
            setSdkReadyGoogle(true) //if google api script has mounted, set to true so Google Log In component would appear
        }
    }, [navigate, userInfo, redirect])

    const submitLoginHandler = (e) => {
        e.preventDefault()
        dispatch(loginUser(email, password)) //Log in the user
    }

    return (
        <>
            <FormContainer md={6}>
                <h2>Sign In</h2>
                {error && <Message variant="danger" fade>{error}</Message>}
                {loading && <Loader />}

                <Form onSubmit={submitLoginHandler} controlId="email">
                    <Form.Group className="my-2">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Username / Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="my-2" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="my-2">Sign In</Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register here</Link>
                    </Col>
                </Row>
                {
                    !sdkReadyGoogle ? <Loader />
                            : 
                            <GoogleSignIn />
                }
            </FormContainer>
        </>
    )
}

export default LoginScreen

import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import ProfileHeader from '../components/ProfileHeader'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

function ProfileScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageSuccess, setMessageSuccess] = useState('')

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { user, loading, error } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        if (!userInfo){
            navigate("/login?redirect=profile")
        }else {
            if (!user || !user.name || user._id !== userInfo._id || success) {
                if(success) { setMessageSuccess('Your profile has been updated') }
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails(userInfo._id))
            } else{
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, userInfo, user, navigate, success])

    const submitUpdateHandler = (e) => {
        e.preventDefault()

        if(password !== confirmPassword){
            setMessage('Password does not match')
        } else{
            dispatch(updateUserProfile({'name': name, 'email': email, 'password': password}))
            setMessage('')
        }

    }

    return (
        <div>
            <ProfileHeader />
            <Container>
                <Row>
                    <Col md={6}>
                        <h2>Your Information</h2>
                        {messageSuccess && <Message variant="success">{messageSuccess}</Message>}
                        {message && <Message variant="danger">{message}</Message>}
                        {error && <Message variant="danger">{error}</Message>}
                        {loading && <Loader />}
                        <Form onSubmit={submitUpdateHandler}>
                            <Form.Group className="my-2" controlId="email">
                                <Form.Label>Username / Email</Form.Label>
                                <Form.Control type="email" value={email} plaintext readOnly required />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlId="passwordConfirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="my-2">Update</Button>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProfileScreen

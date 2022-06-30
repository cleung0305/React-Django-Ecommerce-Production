import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET, USER_DETAILS_RESET } from '../constants/userConstants'

function UserEditScreen() {

    const { id:userId } = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector(state => state.userDetails)
    const { user, loading, error } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdate

    useEffect(() => {
        if(userInfo){
            if(userInfo.isAdmin){
                if(successUpdate){
                    dispatch({ type: USER_UPDATE_RESET })
                    dispatch({ type: USER_DETAILS_RESET })
                    navigate('/admin/all-users')
                }else{
                    if(!user || user._id !== Number(userId)){
                        dispatch(getUserDetails(userId))
                    } else{
                        setName(user.name)
                        setEmail(user.email)
                        setIsAdmin(user.isAdmin)
                    }
                }
            } else{
                navigate('/')
            }
        } else{
            navigate('/login?redirect=admin/all-users')
        }
    },[user, userId, successUpdate])

    const submitUpdateHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ 'name':name, 'email':email, 'isAdmin':isAdmin }, user._id))
    }

    return (
        <div>
            {/* Breadcrumb */}
            <section id="bc" className="my-3">
                <div>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin/all-users">Go back</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                { userId } - { user.username }
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>
            <FormContainer md={6}>
                <h2>Edit User</h2>
                {loading && <Loader />}
                {errorUpdate && <Message variant="danger" fade>{ errorUpdate }</Message>}
                {
                    error ? <Message variant="danger">{error}</Message>
                        :
                        <Form onSubmit={submitUpdateHandler}>
                            <Form.Group className="my-2" controlid="email">
                                <Form.Label>Username / Email</Form.Label>
                                <Form.Control type="email" value={email} plaintext readOnly />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
        
                            <Form.Group className="my-2" controlid="isAdmin">
                                <Form.Check type="checkbox" label="Admin" checked={ isAdmin } onChange={(e) => setIsAdmin(e.target.checked)} />
                            </Form.Group>
        
                            { loadingUpdate ? <Loader />
                                            : <Button type="submit" variant="primary" className="my-2">Update</Button> }
        
                        </Form>
                }
            </FormContainer>
        </div>
    )
}

export default UserEditScreen

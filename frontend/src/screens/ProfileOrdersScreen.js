import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Table, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

import ProfileHeader from '../components/ProfileHeader'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { getMyOrders } from '../actions/orderActions'

function PastOrdersScreen() {

    const myOrders = useSelector(state => state.myOrders)
    const { orders, loading, error } = myOrders

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(() => {
        if(!userInfo){ //Take user to log in page if not logged in
            navigate('/login?redirect=profile/orders')
        }
        else{
            dispatch(getMyOrders())
        }
    }, [])

    return (
        <div>
            <ProfileHeader />
            <Container>
                <h2>Past Orders</h2>
                { error && <Message variant="danger">{error}</Message>}
                { loading && <Loader /> }
                {
                    orders && 
                        (
                            <Table striped responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th>Order#</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    { orders.map(order => (
                                        <tr>
                                            <td>{ String(order._id).padStart(5, '0') }</td>
                                            <td>{ order.created_date.substr(0, 10) }</td>
                                            <td>${ order.total_price }</td>
                                            <td>{ order.isPaid ? order.paid_date.substr(0, 10) : ( <i className="fas fa-times" style={{ color:'red' }}></i> ) }</td>
                                            <td>{ order.isDelivered ? order.deliverd_date : 'In progress' }</td>
                                            <td>
                                                <LinkContainer to={`/orders/${order._id}`}>
                                                    <Button className="btn-sm">Details</Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )
                }
                {/* <ListGroup variant="flush">
                    { orders && 
                        orders.map(order => (
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <LinkContainer to={`/orders/${order._id}`}>{ String(order._id).padStart(10, '0') }</LinkContainer>
                                    </Col>

                                    <Col>

                                    </Col>

                                    <Col>
                                        {order.isPaid ? 'Paid' : 'Not Paid'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup> */}
            </Container>
        </div>
    )
}

export default PastOrdersScreen

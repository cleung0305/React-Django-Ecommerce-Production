import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import { getOrders } from '../actions/orderActions'

function OrderListScreen() {

    const orderList = useSelector(state => state.orderList)
    const { orders, loading, error } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(userInfo){
            if(!userInfo.isAdmin){
                navigate('/')
            }
            dispatch(getOrders())
        } else{
            navigate('/login?redirect=admin/all-orders')
        }
    }, [dispatch, navigate])

    return (
        <div>
            <h2>Orders</h2>
            { error && <Message variant="danger">{error}</Message>}
            { loading && <Loader /> }
            { orders && 
                (
                    <Table striped responsive bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Total price</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            { orders.map(order => (
                                <tr key={order._id}>
                                    <td>{ String(order._id).padStart(5, '0') }</td>
                                    <td>{ order.user && order.user.username }</td>
                                    <td>{ order.created_date.substr(0, 10) }</td>
                                    <td>${ order.total_price }</td>
                                    <td>{ order.isPaid ? order.paid_date.substr(0, 10) : 'No' }</td>
                                    <td>{ order.isDelivered ? order.deliverd_date.substr(0, 10) : 'No' }</td>
                                    <td>
                                        <LinkContainer to={`/orders/${order._id}`}>
                                            <Button variant="primary" className="btn-sm">Detail</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )
            }
        </div>
    )
}

export default OrderListScreen

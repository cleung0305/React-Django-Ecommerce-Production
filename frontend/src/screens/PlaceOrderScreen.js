import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Row, Col, Button, ListGroup, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import CartSummaryAccordion from '../components/CartSummaryAccordion'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceOrderScreen() {

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    const cart = useSelector(state => state.cart)
    const { cartItems, shippingAddress, paymentMethod, subtotalPrice, shippingPrice, taxPrice, totalPrice } = cart

    const user = useSelector(state => state.userLogin)
    const { userInfo } = user

    // cart.subtotalPrice = cartItems.reduce((acc, cartItem) => acc + cartItem.price * cartItem.qty, 0).toFixed(2)
    // cart.shippingPrice = Number(cart.subtotalPrice >= 100 ? 0 : 10).toFixed(2)
    // cart.taxPrice = Number((0.082) * cart.subtotalPrice).toFixed(2)
    // cart.totalPrice = (Number(cart.subtotalPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    // AVOAq7MSKF4C3MOjpav8qqlDV7k0FBiTeW7hOvOa7WCXJUdjLAkwZslUaT9pcgwquy46tDE66CoXy76P

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(cartItems.length === 0 || !shippingAddress.streetAddress || !userInfo){
            navigate('/cart')
        }

        if(!paymentMethod){
            navigate('/payment')
        }

        if(success) {
            navigate(`/orders/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET }) //clear the order state
        }
    }, [success, navigate])

    const placeOrderHandler = () => {
        const order = {
            orderItems: cartItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            subtotalPrice: subtotalPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice,
        }
        dispatch(createOrder(order))
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 />
            <Row>
                <Col md={8}>
                    <h2>Review Information</h2>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <Row>
                                <Col md={2}><strong>Ship to:</strong></Col>
                                <Col md={4} className="d-flex">
                                    <div className="ma-auto">
                                        { shippingAddress.name } <br/>
                                        { shippingAddress.streetAddress }, <br/>
                                        { shippingAddress.aptAddress && `${shippingAddress.aptAddress},`} { shippingAddress.aptAddress && <br/> }
                                        { shippingAddress.city }, { shippingAddress.state } { shippingAddress.zip }
                                    </div>
                                </Col>
                                
                                <Col md={2}><strong>Shipping method:</strong></Col>
                                <Col md={4} className="d-flex">
                                    <div className="ma-auto">
                                        Free Shipping (5 - 7 Business days)
                                    </div>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Payment</h3>
                            <div>
                                <strong>Paymeny method:</strong>
                                { paymentMethod }
                            </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <div className="d-flex">
                            <h3>In Your Cart</h3>
                            <Link className="ms-auto mt-3" to='/cart'>Edit</Link>
                            </div>
                            <ListGroup variant="flush">
                                { cartItems.map((cartItem, index) => (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={cartItem.image} alt={cartItem.name} fluid rounded/>
                                            </Col>

                                            <Col md={6}>
                                                <Link to={`/product/${cartItem.productId}`}>{cartItem.name}</Link>
                                            </Col>

                                            <Col md={3}>
                                                Quantity : {cartItem.qty}
                                            </Col>

                                            <Col md={2} className="d-flex">
                                                <div className="ms-auto">${(cartItem.qty * cartItem.price).toFixed(2)}</div>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )) }
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <CartSummaryAccordion items={cartItems} shippingPrice={shippingPrice} taxPrice={taxPrice} />
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            { error && <Message variant="danger">{error}</Message> }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <div className="d-grid gap-2 my-1">
                                <Button type="button" size="lg" variant="primary" disabled={cartItems.length === 0} onClick={placeOrderHandler}>Place order</Button>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen

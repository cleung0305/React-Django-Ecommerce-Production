import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2'

import Loader from '../components/Loader'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import CartSummaryAccordion from '../components/CartSummaryAccordion'
import { createOrder, payOrder, payOrderCancel, createOrderDemo } from '../actions/orderActions'
import { ORDER_CREATE_RESET, ORDER_CREATE_RESET_DEMO } from '../constants/orderConstants'

function PlaceOrderScreen() {

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    const orderCreateDemo = useSelector(state => state.orderCreateDemo)
    const { order: orderDemo, success: successDemo, error: errorDemo } = orderCreateDemo

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay} = orderPay

    const orderPayCancel = useSelector(state => state.orderPayCancel)
    const { loading: loadingPayCancel, success: successPayCancel, message:messagePayCancel } = orderPayCancel

    const cart = useSelector(state => state.cart)
    const { cartItems, shippingAddress, paymentMethod, subtotalPrice, shippingPrice, taxPrice, totalPrice } = cart

    const user = useSelector(state => state.userLogin)
    const { userInfo } = user

    const [sdkReady, setSdkReady] = useState(false) // State determine whether the SDK is ready to be mounted

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AVOAq7MSKF4C3MOjpav8qqlDV7k0FBiTeW7hOvOa7WCXJUdjLAkwZslUaT9pcgwquy46tDE66CoXy76P'
        script.async = true //give it time for SDK to load
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(cartItems.length === 0 || !shippingAddress.streetAddress || !userInfo){
            navigate('/cart')
        }

        if(!paymentMethod){
            navigate('/payment')
        }

        if(!window.paypal){
            addPayPalScript() //check if paypal sdk is mounted to page
        } else {
            setSdkReady(true)
        }

        //Paypal Payment Successful
        if(success && successPay) {
            navigate(`/orders/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET }) //clear the order state
        }

        //demo pay button
        if(successDemo){
            dispatch(payOrder(orderDemo._id, 'success'))
        }
        if(successDemo && successPay) {
            navigate(`/orders/${orderDemo._id}`)
            dispatch({ type: ORDER_CREATE_RESET_DEMO }) //clear the order state
        }
    }, [success, successDemo, successPay, navigate])

    const placeOrderHandler = () => {
        const orderToCreate = {
            orderItems: cartItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            subtotalPrice: subtotalPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice,
        }
        dispatch(createOrder(orderToCreate))
    }

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order._id, paymentResult))
    }

    const cancelPaymentHandler = () => {
        const currOrderId = JSON.parse(localStorage.getItem('currentOrder'))._id
        console.log(currOrderId)
        dispatch(payOrderCancel(currOrderId))
    }

    //Demo
    const placeOrderDemoHandler = () => {
        const orderToCreate = {
            orderItems: cartItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            subtotalPrice: subtotalPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice,
        }
        dispatch(createOrderDemo(orderToCreate))
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
                    { error && <Message variant="danger">{error}</Message> }
                    { paymentMethod === 'PayPal' ?
                        <div>
                            {loadingPay && <Loader />}

                            <Message variant="danger">PayPal is sandbox mode. If you do not have a sandbox paypal account, click the button below to complete checkout.</Message>
                            <Button type="button" onClick={placeOrderDemoHandler}>Complete payment</Button>

                            {!sdkReady ? (<Loader />)
                                    : (<PayPalButton amount={totalPrice} onClick={placeOrderHandler} onCancel={cancelPaymentHandler} onSuccess={successPaymentHandler} />)
                            }
                        </div>
                        : <Message variant="danger">Sorry, we currently only accept PayPal payments</Message>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen

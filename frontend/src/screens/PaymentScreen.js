import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import CheckoutSteps from '../components/CheckoutSteps'
import CartSummaryAccordion from '../components/CartSummaryAccordion'

import { savePaymentMethod, calculatePrice } from '../actions/cartActions'

function PaymentScreen() {

    const [paymentMethod, setPaymentMethod] = useState('')

    const cart = useSelector(state => state.cart) // cart
    const { cartItems, shippingAddress, shippingPrice, taxPrice } = cart

    const user = useSelector( state => state.userLogin) //user info
    const { userInfo } = user

    const navigate = useNavigate()

    const dispatch = useDispatch()

    useEffect(() => {
        if(cartItems.length === 0 || !userInfo){
            navigate('/cart')
        }
        // Check if Shipping Address is provided
        if (!shippingAddress.streetAddress){
            navigate('/shipping')
        }
        dispatch(calculatePrice())
    }, [])

    const submitPaymentHandler = (e) => {
        e.preventDefault()
        console.log(paymentMethod)
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 />
            <Row>
                <Col md={8}>
                    <h2>Payment Methods</h2>
                    <Form onSubmit={submitPaymentHandler}>
                        <Form.Group>
                            <Form.Label as="legend">Select Payment Method</Form.Label>
                            <Col>
                                <Form.Check type="radio" label="PayPal" id="paypal" name="paymentMethod" value="PayPal" onChange={(e) => setPaymentMethod(e.target.value)}>

                                </Form.Check>

                                <Form.Check type="radio" label="Credit or Debit Card" id="card" name="paymentMethod" value="Card" onChange={(e) => setPaymentMethod(e.target.value)}>

                                </Form.Check>
                            </Col>
                        </Form.Group>

                        <div className="d-flex">
                            <Button type="submit" variant="primary" className="my-2 ms-auto" disabled={ !paymentMethod && true } >Continue</Button>
                        </div>
                    </Form>
                </Col>

                <Col md={4}>
                    <CartSummaryAccordion items={cartItems} shippingPrice={shippingPrice} taxPrice={taxPrice}/>
                </Col>
            </Row>
        </div>
    )
}

export default PaymentScreen

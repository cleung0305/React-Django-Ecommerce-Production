import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import STATES from '../constants/usStatesConstants'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import CartSummaryAccordion from '../components/CartSummaryAccordion'
import { saveShippingAddress } from '../actions/cartActions'

function ShippingScreen() {

    const cart = useSelector(state => state.cart)
    const { cartItems, shippingAddress, message } = cart

    const user = useSelector( state => state.userLogin)
    const { userInfo } = user

    const [name, setName] = useState(shippingAddress.name)
    const [streetAddress, setStreetAddress] = useState(shippingAddress.streetAddress)
    const [aptAddress, setAptAddress] = useState(shippingAddress.aptAddress ? shippingAddress.aptAddress : "")
    const [city, setCity] = useState(shippingAddress.city)
    const [state, setState] = useState(shippingAddress.state)
    const [zip, setZip] = useState(shippingAddress.zip)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(cartItems.length === 0 || !userInfo){
            navigate('/cart')
        }
    }, [])

    const submitShippingHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress( {
            name: name,
            streetAddress: streetAddress,
            aptAddress: aptAddress,
            city: city,
            state: state,
            zip: zip,
        } ))
        navigate('/payment')
    }

    return (
        <div>
            {  message && <Message variant="primary">{message}</Message> }
            <CheckoutSteps step1 />
            <Row>
                <Col md={8}>
                    <FormContainer md={8}>
                        <h2>Shipping Address</h2>
                        <Form onSubmit={submitShippingHandler}>
                            <Form.Group className="my-2" controlid="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Your name" value={name ? name : ''} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="my-2" controlid="street-address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder="Street address or P.O. Box" value={streetAddress ? streetAddress : ''} onChange={(e) => setStreetAddress(e.target.value)} required />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="apt-address">
                                <Form.Control type="text" placeholder="Apt, suite, unit, building, floor, etc." value={aptAddress ? aptAddress : ''} onChange={(e) => setAptAddress(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" placeholder="City" value={city ? city : ''} onChange={(e) => setCity(e.target.value)} required />
                            </Form.Group>

                            <Row>
                                <Col md={6} sm={12}>
                                    <Form.Group className="my-2" controlid="state">
                                        <Form.Label>State</Form.Label>
                                        <Form.Select aria-label="State" as="select" onChange={(e) => setState(e.target.value)} required >
                                            <option key={0} value=''>State</option>
                                            {
                                                STATES.map((state) => (
                                                    <option key={state.name} value={state.abbreviation}>{state.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6} sm={12}>
                                    <Form.Group className="my-2" controlid="city">
                                        <Form.Label>ZIP Code</Form.Label>
                                        <Form.Control type="text" value={zip ? zip : ''} onChange={(e) => setZip(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <span className="d-flex">
                                <Button type="submit" variant="primary" className="my-2 ms-auto">Proceed to Payment</Button>
                            </span>
                        </Form>
                    </FormContainer>
                </Col>

                <Col md={4}>
                    <CartSummaryAccordion items={cartItems} />
                </Col>
            </Row>
        </div>
    )
}

export default ShippingScreen

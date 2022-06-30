import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button } from 'react-bootstrap'

import Message from '../components/Message'
import CartSummaryAccordion from '../components/CartSummaryAccordion'
import { updateCart, removeFromCart, cartValidationMessage } from '../actions/cartActions'



function CartScreen() {

    const navigate = useNavigate() // create navigate

    const dispatch = useDispatch()
    const cart = useSelector( state => state.cart )
    const { cartItems, message } = cart

    const user = useSelector( state => state.userLogin)
    const { userInfo } = user

    // Validate cart status'
    const validateCartStatus = () => {
        cartItems.map(cartItem => {
            dispatch(updateCart(cartItem.productId, cartItem.qty))
            if (cartItem.qty === 0) {
                if(!message){
                    dispatch(cartValidationMessage("Items with zero quantity have been removed from your cart"))
                }
                dispatch(removeFromCart(cartItem.productId))
            }
        })
    }

    useEffect(() => {
        // Update Items in-stock status when the page first loaded 
        cartItems.map(cartItem => {
            dispatch(updateCart(cartItem.productId, cartItem.qty))
        })
    }, [])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = (checkoutMethod) => {
        validateCartStatus()
        if(checkoutMethod === 'member'){
            navigate('/login?redirect=shipping')
        }
        if(checkoutMethod === 'guest'){
            navigate('/shipping')
        }
    }

    return (
        <div>
            {  message && <Message variant="primary">{message}</Message> }
            <Row>
                <h2>Shopping Cart</h2>
                {/* Cart Items */}
                <Col md={8}> 
                    { cartItems.length === 0 ? (
                        <Message variant="info">
                            Your cart is empty, <Link to="/">Contiune Shopping</Link>
                        </Message>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map( cartItem => (
                                <ListGroup.Item key={ cartItem.productId }>
                                    <Row>
                                        {/*Item image */}
                                        <Col md={3}>
                                            <Link to={`/product/${cartItem.productId}`}>
                                                <Image src={ cartItem.image } alt={ cartItem.name } fluid rounded/>
                                            </Link>
                                        </Col>

                                        <Col md={9}>
                                            <Row>
                                                <Col md={8} sm={12}>
                                                    <Link to={`/product/${cartItem.productId}`}>{cartItem.name}</Link>
                                                </Col>

                                                <Col md={4} sm={12} className="d-flex">
                                                    <p className="ms-auto">${(cartItem.price * cartItem.qty).toFixed(2)}</p>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={8} sm={12}>
                                                    { cartItem.countInStock > 0 ? <p className="text-primary">In Stock</p> : <p className="text-muted">Out of Stock</p> }
                                                </Col>

                                                <Col md={4} sm={12}>
                                                    {
                                                        cartItem.countInStock > 0 ?
                                                            //In stock
                                                            <Form.Select 
                                                                aria-label="Select Quantity" 
                                                                as="select" 
                                                                className="py-0"
                                                                value={cartItem.qty} 
                                                                onChange={(e) => dispatch(updateCart(cartItem.productId, e.target.value)) }
                                                            >  
                                                                <option key={0} value={0}>0</option>
                                                                { [...Array(cartItem.countInStock).keys()].map((x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                )) }
                                                            </Form.Select>
                                                        : //out of stock 
                                                            <Form.Select
                                                                aria-label="Select Quantity" 
                                                                as="select" 
                                                                className="py-0"
                                                                value={0}
                                                                disabled
                                                            >
                                                                <option key={0} value={0}>0</option>
                                                            </Form.Select>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="d-flex">
                                                    <Button size="sm" type="button" variant="light" className="ms-auto mt-2" onClick={() => removeFromCartHandler(cartItem.productId)}>
                                                        Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                </ListGroup.Item>
                            ))}

                            <ListGroup.Item className="ms-auto">
                                {
                                    userInfo ? 
                                        <Button type='button'
                                            size="md"
                                            className="my-2"
                                            disabled={cartItems.length === 0}
                                            onClick={() => checkoutHandler('member')}
                                        >
                                            Checkout
                                        </Button>
                                        : 
                                        <>
                                            {/* <Button 
                                                type='button'
                                                size="md"
                                                className="m-2"
                                                disabled={cartItems.length === 0}
                                                onClick={() => checkoutHandler('guest')}
                                            >
                                                Guest Checkout
                                            </Button> */}

                                            <Button 
                                                type='button'
                                                size="md"
                                                className="m-2"
                                                disabled={cartItems.length === 0}
                                                onClick={() => checkoutHandler('member')}
                                            >
                                                Member Checkout
                                            </Button>
                                        </>
                                }
                                {/* <Button 
                                    type='button'
                                    size="lg"
                                    className="my-2"
                                    disabled={cartItems.length === 0}
                                    onClick={() => checkoutHandler()}
                                >
                                    Checkout
                                </Button> */}
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                </Col>
                {/* Cart Summary */}
                <Col md={4}>
                   <CartSummaryAccordion items={cartItems} />
                </Col>
            </Row>
        </div>
    )
}

export default CartScreen

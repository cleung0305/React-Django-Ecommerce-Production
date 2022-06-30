import React from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, ListGroup, Card } from 'react-bootstrap'

function CartSummary() {

    const cart = useSelector( state => state.cart )
    const { cartItems, shippingPrice } = cart

    return (
        <Card>
            <ListGroup variant="flush">
                <ListGroup.Item> {/**Total number of items */}
                    <h4>Order Summary</h4>
                </ListGroup.Item>

                <ListGroup.Item>
                {
                    cartItems.map(cartItem => (
                        <div key={ `summary-${cartItem.productId}` }>
                            <Row className="mb-2">
                                <Col md={8} style={{fontSize:"11px"}}> {/**Item name and qty */}
                                    {cartItem.qty} &times; {cartItem.name}
                                </Col>

                                <Col md={4} sm="auto" style={{fontSize:"11px"}} className="d-flex">
                                    <p className="ms-auto">${(cartItem.price * cartItem.qty).toFixed(2)}</p>
                                </Col>
                            </Row>
                        </div>
                    ))
                }
                </ListGroup.Item>

                <ListGroup.Item> 
                    <Row>
                        <Col md={8}>
                            Subtotal
                        </Col>

                        <Col md={4} sm="auto" className="d-flex">
                            <p className="ms-auto">${ Number(cartItems.reduce((acc, cartItem) => acc + Number(cartItem.qty) * cartItem.price, 0).toFixed(2)) }</p>
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col md={8}>
                            Shipping
                        </Col>

                        <Col md={4} sm="auto" className="d-flex">
                            <p className="ms-auto">${ shippingPrice.toFixed(2) }</p>
                        </Col>
                    </Row>
                </ListGroup.Item>

                {/* Estimated total */}
                <ListGroup.Item> 
                    <Row>
                        <Col md={8}>
                            Estimated Total
                        </Col>

                        <Col md={4} sm="auto" className="d-flex">
                            <p className="ms-auto">${ Number(cartItems.reduce((acc, cartItem) => acc + Number(cartItem.qty) * cartItem.price, 0).toFixed(2)) + shippingPrice }</p>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default CartSummary

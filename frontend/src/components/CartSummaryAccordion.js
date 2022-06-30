import React from 'react'
import { Row, Col, Accordion, ListGroup } from 'react-bootstrap'

function CartSummaryAccordion({items, subtotalPrice, shippingPrice, taxPrice, totalPrice}) {

    const subPrice = subtotalPrice ? Number(subtotalPrice) : Number(items.reduce((acc, cartItem) => acc + Number(cartItem.qty) * cartItem.price, 0).toFixed(2))
    const sPrice = shippingPrice ? Number(shippingPrice) : 0
    const tPrice = taxPrice ? Number(taxPrice) : 0
    const totPrice = (Number(subPrice) + Number(sPrice) + Number(tPrice)).toFixed(2)

    return (
        <div>
            <ListGroup variant="flush">
                <ListGroup.Item> {/**Total number of items */}
                    <h4>Order Summary</h4>
                </ListGroup.Item>

                <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item>
                        <Accordion.Header eventkey="0">
                            Cart
                        </Accordion.Header>
                        <Accordion.Body eventkey="0">
                                <>
                                    {
                                        items.map(cartItem => (
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
                                </>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <ListGroup.Item className="m-0 p-0"></ListGroup.Item>
    
                <ListGroup.Item>
                    <Row>
                        <Col md={8}>
                            Subtotal
                        </Col>

                        <Col md={4} sm="auto" className="d-flex">
                            <p className="ms-auto">${ subPrice }</p>
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col md={8}>
                            Shipping
                        </Col>

                        <Col md={4} sm="auto" className="d-flex">
                            <p className="ms-auto">${ sPrice.toFixed(2)}</p>
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col md={6}>
                            Tax
                        </Col>

                        <Col md={6} sm="auto" className="d-flex">
                            <p className={ taxPrice ? "ms-auto" : "text-muted ms-auto"}>{ tPrice ? `$${tPrice.toFixed(2)}` : 'Calculated in checkout'}</p>
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
                            <p className="ms-auto">${ totPrice }</p>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </div>
    )
}

export default CartSummaryAccordion

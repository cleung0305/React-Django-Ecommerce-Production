import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import {Rating as SimpleRating} from 'react-simple-star-rating'

import { listProductDetail, createReview } from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'

function ProductScreen() {
    const { id } = useParams()

    const [qty, setQty] = useState(1) // Local state for quantity
    const [rating, setRating] = useState(0) // rating
    const [comment, setComment] = useState('') // review comment

    const dispatch = useDispatch() //Create dispatch

    const productDetail = useSelector(state => state.productDetail) // Product Detail state
    const { error, loading, product } = productDetail

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const reviewCreate = useSelector(state => state.reviewCreate)
    const { loading: loadingReview, success: successReview, error: errorReview } = reviewCreate

    const cart = useSelector(state => state.cart) //grab the cart state for cart message
    const { message } = cart

    useEffect(() => {
        dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
        if(successReview){
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(listProductDetail(id))

    }, [dispatch, id, successReview])

    const addToCartHandler = (productId) => { // Add to cart function
        dispatch(addToCart(productId, qty))
    }

    const createReviewHandler = (e) => {
        e.preventDefault()
        dispatch(createReview(id, {'rating': rating/20, 'comment': comment}))
    }

    return (
        <div>
            {/* Breadcrumb */}
            <section id="bc" className="my-3">
                <div>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                { 
                                    product.name 
                                }
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>
            
            {/* Message section for adding item to cart */}
            {
                message && <Message variant="primary">{message}</Message>
            }


            {
                //Loading Spinner
                loading ? <Loader />
                        : error ? <Message variant="danger">{ error }</Message>
                        :
                        <div>
                            {/* Product Details */}
                            <Row>
                                <Col md={4}>
                                    {
                                        <Image src={product.image} alt={product.name} fluid />
                                    }
                                </Col>

                                <Col md={5}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <h3>{ product.name }</h3>
                                            <div className="right-rating">
                                                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f1a545'} />
                                            </div>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <h3>${ product.price }</h3>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <h5 className="text-secondary">Description</h5>
                                            { product.description }
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>

                                <Col md={3}>
                                    <Card>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>
                                                        <strong>${product.price}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>
                                                        <strong>{ product.countInStock >= 6 ? 'In Stock'
                                                                : product.countInStock >0 ? 'Only A Few Left'
                                                                : 'Sold Out'}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            { product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Qty</Col>
                                                        <Col xs='auto' className="my-1">
                                                            <Form.Control
                                                                as="select"
                                                                value={qty}
                                                                onChange={(e) => setQty(e.target.value) }
                                                            >
                                                                {
                                                                    [...Array(product.countInStock).keys()].map((x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}

                                            <ListGroup.Item>
                                                <div className="d-grid gap-2 my-1">
                                                    {
                                                        product.countInStock > 0 ? //check if instock
                                                            <Button variant="primary" type="button" size="lg" onClick={() => addToCartHandler(product._id)}>
                                                                Add To Cart
                                                            </Button>
                                                            : //out of stock
                                                            <Button variant="secondary" type="button" size="lg" disabled> 
                                                                Out Of Stock
                                                            </Button>
                                                    }
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>

                            <hr className="my-5" />
                            {/* Product Reviews */}
                            <Row>
                                <Col md={6}>
                                    <h4>Reviews</h4>
                                        { product.reviews.length === 0 && 
                                            <ListGroup>
                                                <ListGroup.Item>
                                                    <p className="text-muted">No reviews</p>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        }

                                        <ListGroup variant="flush">
                                            {
                                                product.reviews.map((review) => (
                                                    <ListGroup.Item key={review._id}>
                                                        <strong>{review.name}</strong>
                                                        <Rating value={review.rating} text={` ${review.created_at.substr(0, 10)}`} color={'#f1a545'} />
                                                        <p>{ review.comment }</p>
                                                    </ListGroup.Item>
                                                ))
                                            }

                                            <ListGroup.Item>
                                                <h5>Write a review</h5>

                                                {loadingReview && <Loader />}
                                                {successReview && <Message variant="info">Review posted</Message>}
                                                {errorReview && <Message variant="warning">{errorReview}</Message>}

                                                <Form onSubmit={createReviewHandler}>
                                                    { userInfo ? (
                                                        <>
                                                        <Form.Group controlId='rating'>
                                                            <SimpleRating
                                                                onClick={(rating) => setRating(rating)}
                                                                ratingValue={rating}
                                                                size={20}
                                                                fillColor='#f1a545'
                                                                emptyColor='#cccccc'
                                                                allowHalfIcon
                                                                showTooltip
                                                                tooltipArray={['Poor', 'Poor', 'Fair', 'Fair', 'Good', 'Good', 'Very Good', 'Very Good', 'Excellent', 'Excellent']}
                                                                disabled={loadingReview}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group controlId='comment'>
                                                            <Form.Label>Review</Form.Label>
                                                            <Form.Control disabled={loadingReview} as="textarea" row="5" placeholder='Share your thoughts on this product' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                                                        </Form.Group>
                                                        <Button type="submit" variant="primary" className="my-2" disabled={loadingReview}>Post review</Button>
                                                        </>
                                                    ) : (
                                                        <p className="p-2">
                                                            Please <Link to={`/login?redirect=product/${id}`}>login</Link> to write a review
                                                        </p>
                                                    )}
                                                </Form>
                                            </ListGroup.Item>
                                        </ListGroup>
                                </Col>

                                <Col>
                                
                                </Col>
                            </Row>
                        </div>
            }
        </div>
    )
}

export default ProductScreen

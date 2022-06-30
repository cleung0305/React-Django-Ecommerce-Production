import React, {useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Row, Col, Pagination } from 'react-bootstrap'

import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import TopProductCarousel from '../components/TopProductCarousel'
// import BSPaginate from '../components/BSPaginate'

import { listProducts } from '../actions/productActions'

// const PageSize = 2 // Items to be shown on one page

function HomeScreen() {
    const dispatch = useDispatch()
    const location = useLocation()
    const productList = useSelector( state => state.productList)
    const { error, loading, products, page, pages } = productList

    // let keyword = location.search ? location.search.split('keyword=')[1] : ''
    let keyword = location.search

    useEffect(() => {
        dispatch(listProducts(keyword))
    }, [dispatch, keyword])

    return (
        <div>
            {!keyword && <TopProductCarousel />}
            <h1>Latest Products</h1>

            { loading ? <Loader />
                : error ? <Message variant="danger">{ error }</Message> 
                    :
                    <div>
                        <Row>
                            {
                                products.map(product => (
                                    <Col key={ product._id } xs='auto' sm='auto' md={4} lg={4} xl={3}>
                                        <Product product={product} />
                                    </Col>
                                ))
                            }
                        </Row>
                        <Paginate page={page} pages={pages} keyword={keyword} />
                    </div>
            }
        </div>
    )
}

export default HomeScreen

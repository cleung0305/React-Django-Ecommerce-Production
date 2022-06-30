import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Pagination } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import SearchBox from '../components/SearchBox'
import { listProductsAdmin, createProduct, deleteProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productListAdmin = useSelector(state => state.productListAdmin)
    const { products, loading, error, pages, page } = productListAdmin

    const productCreate = useSelector(state => state.productCreate)
    const { product, success:successCreate, loading:loadingCreate, error:errorCreate } = productCreate

    const productDelete = useSelector(state => state.productDelete)
    const { success:successDelete, loading:loadingDelete, error:errorDelete, message:messageDelete } = productDelete

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    let keyword = location.search

    useEffect(() => {
        dispatch({ type:PRODUCT_CREATE_RESET })
        if(userInfo){
            if(!userInfo.isAdmin){
                navigate('/')
            }

            if(successCreate){
                navigate(`/admin/product/${product._id}/edit`)
            } else{
                dispatch(listProductsAdmin(keyword))
            }
        } else{
            navigate('/login?redirect=admin/all-products')
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, product, keyword])

    const deleteHandler = (id, name) => {
        if(window.confirm(`Deleting product: ${name}`)){
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () =>{
        dispatch(createProduct())
    }

    return (
        <div>
            <Row>
                <Col>
                    <h2>Products</h2>
                </Col>
                <Col className="d-flex my-3">
                    { loadingCreate ? <Loader />
                                    :
                                    <Button className="ms-auto" onClick={createProductHandler}>
                                        <i className="fas fa-plus"></i> Create Product
                                    </Button>
                    }
                </Col>
            </Row>

            <div className="col-md-3 mb-3">
                <SearchBox route={'/admin/all-products'} />
            </div>
            
            { error && <Message variant="danger">{error}</Message>}

            { loadingDelete && <Loader /> }
            { errorDelete && <Message variant="danger" fade>{errorDelete}</Message>}
            { messageDelete && <Message variant="primary" fade>{messageDelete}</Message>}

            { errorCreate && <Message variant="danger" fade>{errorCreate}</Message>}

            { loading && <Loader /> }
            { products && 
                (
                    <div>
                        <Table striped responsive bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Is published</th>
                                </tr>
                            </thead>

                            <tbody>
                                { products.map(product => (
                                    <tr key={product._id}>
                                        <td>{ String(product._id).padStart(5, '0') }</td>
                                        <td>{ product.name }</td>
                                        <td>{ product.brand }</td>
                                        <td>{ product.category }</td>
                                        <td>{ product.price }</td>
                                        <td>{ product.rating }</td>
                                        <td>{ product.isPublished ? 'Yes' : 'No' }</td>
                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button variant="light" className="btn-sm"><i className="fas fa-edit"></i></Button>
                                            </LinkContainer>
                                        </td>
                                        <td><Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id, product.name)}><i className="fas fa-trash"></i></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Paginate page={page} pages={pages} isAdmin={true} />
                    </div>
                )
            }
        </div>
    )
}

export default ProductListScreen
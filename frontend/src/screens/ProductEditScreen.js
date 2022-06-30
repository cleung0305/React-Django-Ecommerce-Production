import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetail, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET, PRODUCT_DETAIL_RESET } from '../constants/productConstants'

function ProductEditScreen() {

    const { id:productId } = useParams()

    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [countInStock, setCountInStock] = useState(0)
    const [isPublished, setIsPublished] = useState(false)
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDetail = useSelector(state => state.productDetail)
    const { product, loading, error } = productDetail

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = productUpdate

    useEffect(() => {
        if(userInfo){
            if(!userInfo.isAdmin){
                navigate('/')
            } 
            if(successUpdate){
                dispatch({ type: PRODUCT_UPDATE_RESET })
                dispatch({ type: PRODUCT_DETAIL_RESET })
                navigate('/admin/all-products')
            }else{
                if(!product || product._id !== Number(productId)){
                    dispatch(listProductDetail(productId))
                } else{
                    setName(product.name)
                    setImage(product.image)
                    setBrand(product.brand)
                    setCategory(product.category)
                    setDescription(product.description)
                    setPrice(product.price)
                    setCountInStock(product.countInStock)
                    setIsPublished(product.isPublished)
                }
            }
        } else{
            navigate('/login?redirect=admin/all-users')
        }
    },[product, productId, successUpdate])

    const submitUpdateHandler = (e) => {
        e.preventDefault()
        const productToUpdate = {
            'name':name,
            'brand':brand,
            'category':category,
            'description':description,
            'price':price,
            'countInStock':countInStock,
            'isPublished':isPublished,
        }
        dispatch(updateProduct(productToUpdate, product._id))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('productId', productId)

        setUploading(true)

        try{
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            const {data} = await axios.post(`/api/products/admin/upload/`, formData, config)

            setImage(data)
            setUploading(false)

        } catch(error){
            setUploading(false)
        }
    }

    return (
        <div>
            {/* Breadcrumb */}
            <section id="bc" className="my-3">
                <div>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin/all-products">Go back</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                { productId } - { product.name }
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>
            <FormContainer md={6}>
                <h2>Edit Product</h2>
                {loading && <Loader />}
                {errorUpdate && <Message variant="danger" fade>{ errorUpdate }</Message>}
                {
                    error ? <Message variant="danger">{error}</Message>
                        :
                        <Form onSubmit={submitUpdateHandler}>
                            <Form.Group className="my-2" controlid="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="image">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="text" placeholder="Image" value={image} onChange={(e) => setImage(e.target.value)} />
                                
                                <Form.Control type='file' id='image-file' label='Choose File' custom onChange={uploadFileHandler}>
                                </Form.Control>
                                { uploading && <Loader /> }
                            </Form.Group>

                            <Form.Group className="my-2" controlid="brand">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="description">
                                <Form.Label>Desription</Form.Label>
                                <Form.Control as="textarea" value={description} rows={6} size="sm" onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                            </Form.Group>

                            <Form.Group className="my-2" controlid="countInStock">
                                <Form.Label>Count In Stock</Form.Label>
                                <Form.Control type="number" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} />
                            </Form.Group>
        
                            <Form.Group className="my-2" controlid="isPublished">
                                <Form.Check type="checkbox" label="Published" checked={ isPublished } onChange={(e) => setIsPublished(e.target.checked)} />
                            </Form.Group>
        
                            { loadingUpdate || uploading ? <Loader />
                                            : <Button type="submit" variant="primary" className="my-2">Update</Button> }
        
                        </Form>
                }
            </FormContainer>
        </div>
    )
}

export default ProductEditScreen

import axios from 'axios'

import { 
    PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL,
    PRODUCT_DETAIL_REQUEST, PRODUCT_DETAIL_SUCCESS, PRODUCT_DETAIL_FAIL,
    PRODUCT_TOP_REQUEST, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAIL,

    //Admin products
    PRODUCT_LIST_ADMIN_REQUEST, PRODUCT_LIST_ADMIN_SUCCESS, PRODUCT_LIST_ADMIN_FAIL,
    PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL,

    //Reviews
    PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_FAIL
} from '../constants/productConstants'


export const listProducts = (keyword = '') => async (dispatch) => {
    try{
        dispatch({ type:PRODUCT_LIST_REQUEST })

        const { data } = await axios.get(`/api/products${keyword}`)

        // const { data } = await axios.get(`/api/products`, { 
        //     params: {
        //         keyword:keyword
        //     }
        // })

        dispatch({
            type:PRODUCT_LIST_SUCCESS,
            payload: data,
        })
    }catch(error){
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,

        })
    }
}

export const listProductDetail = (id) => async (dispatch) => {
    try{
        dispatch({ type:PRODUCT_DETAIL_REQUEST })

        const { data } = await axios.get(`/api/products/${ id }`)

        dispatch({
            type:PRODUCT_DETAIL_SUCCESS,
            payload: data,
        })
    }catch(error){
        dispatch({
            type: PRODUCT_DETAIL_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

// List Top 5 products
export const listTopProducts = () => async (dispatch) => {
    try{
        dispatch({ type: PRODUCT_TOP_REQUEST })

        const { data } = await axios.get('/api/products/top/')

        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data,
        })

    } catch(error){
        dispatch({
            type: PRODUCT_TOP_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

export const listProductsAdmin = (keyword = '') => async (dispatch, getState) => {
    try{
        dispatch({ type:PRODUCT_LIST_ADMIN_REQUEST })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/products/admin/all-products${keyword}`, config)

        dispatch({
            type:PRODUCT_LIST_ADMIN_SUCCESS,
            payload: data,
        })

    }catch(error){
        dispatch({
            type: PRODUCT_LIST_ADMIN_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,

        })
    }
}

// Create Product //
export const createProduct = () => async (dispatch, getState) => {
    try{
        dispatch({type: PRODUCT_CREATE_REQUEST})

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post('/api/products/admin/create/', {}, config)

        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        })

    }catch(error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

// Update Product //
export const updateProduct = (product, id) => async (dispatch, getState) => {
    try{
        dispatch({type: PRODUCT_UPDATE_REQUEST})

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/products/admin/update-product/${id}/`, product, config)

        dispatch({
            type: PRODUCT_UPDATE_SUCCESS
        })

    }catch(error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

// Delete Product //
export const deleteProduct = (id) => async (dispatch, getState) => {
    try{
        dispatch({type: PRODUCT_DELETE_REQUEST})

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(`/api/products/admin/delete-product/${id}`, config)

        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
            payload: data
        })

    }catch(error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

//Create review
export const createReview = (id, review) => async (dispatch, getState) => {
    try{
        dispatch({type: PRODUCT_CREATE_REVIEW_REQUEST})

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(`/api/products/${id}/review/`, review, config)

        dispatch({
            type: PRODUCT_CREATE_REVIEW_SUCCESS
        })

    }catch(error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}
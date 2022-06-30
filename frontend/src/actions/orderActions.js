import { 
    ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL,
    ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL,
    ORDER_LIST_MY_REQUEST, ORDER_LIST_MY_SUCCESS, ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL
} from '../constants/orderConstants'


import { CART_CLEAR_ITEMS } from '../constants/cartConstants'

import axios from 'axios'

export const createOrder = (order) => async(dispatch, getState) => {
    try{
        dispatch({
            type: ORDER_CREATE_REQUEST,
        })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.post('api/orders/add/', order, config)

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getOrderDetails = (id) => async(dispatch, getState) => {
    try{
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        const { userLogin: {userInfo} } = getState()
        const authorization = userInfo ? `Bearer ${userInfo.token}` : ""

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: authorization
            }
        }

        const { data } = await axios.get(`/api/orders/${id}`, config)

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error){
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}

// Set order to pay
export const payOrder = (id, paymentResult) => async(dispatch, getState) => {
    try{
        dispatch({
            type: ORDER_PAY_REQUEST
        })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/orders/${id}/pay/`, paymentResult, config)

        dispatch({
            type: ORDER_PAY_SUCCESS,
        })

        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data
        })

        localStorage.removeItem('cartItems')

    } catch (error){
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}

//set order to delivered
export const deliverOrder = (id) => async(dispatch, getState) => {
    try{
        dispatch({
            type: ORDER_DELIVER_REQUEST
        })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/orders/${id}/deliver/`, {}, config)

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
        })

    } catch (error){
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}

// List my orders
export const getMyOrders = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: ORDER_LIST_MY_REQUEST,
        })

        const { userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('/api/orders/myorders', config)

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        })
    } catch (error){
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }

}

// Admin List all orders
export const getOrders = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: ORDER_LIST_REQUEST,
        })

        const { userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('/api/orders/admin/all-orders', config)

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        })
    } catch (error){
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
        })
    }

}
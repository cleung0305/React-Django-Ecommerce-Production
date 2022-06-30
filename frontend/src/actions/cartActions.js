import axios from 'axios'
import { CART_ADD_ITEM, CART_UPDATE_ITEM, CART_REMOVE_ITEM, CART_VALIDATION_MESSAGE} from '../constants/cartConstants'
import { CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_CALCULATE_PRICE } from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload:{
            productId:data._id,
            name:data.name,
            image:data.image,
            price:data.price,
            countInStock:data.countInStock,
            qty: Number(qty),
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const updateCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)
    const upQty = data.countInStock === 0 ? 0 
            : data.countInStock < Number(qty) ? data.countInStock
            : Number(qty)

    dispatch({
        type: CART_UPDATE_ITEM,
        payload:{
            productId:data._id,
            name:data.name,
            image:data.image,
            price:data.price,
            countInStock:data.countInStock,
            qty: upQty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const cartValidationMessage = (message) => (dispatch, getState) => {
    dispatch({
        type: CART_VALIDATION_MESSAGE,
        payload: message,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const calculatePrice = () => (dispatch) => {
    dispatch({
        type: CART_CALCULATE_PRICE
    })
}
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { productListReducer, productDetailReducer, productTopReducer, productListAdminReducer, productCreateReducer, productUpdateReducer, productDeleteReducer, reviewCreateReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers'
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderDeliverReducer, myOrdersReducer, OrdersReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    productList: productListReducer,
    productDetail: productDetailReducer,
    productTop: productTopReducer,
    productListAdmin: productListAdminReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    reviewCreate: reviewCreateReducer,

    cart: cartReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    myOrders: myOrdersReducer,
    orderList: OrdersReducer,
})

/** Get Cart info from local storage*/
const cartItemsFromStorage = localStorage.getItem('cartItems') ? 
        JSON.parse(localStorage.getItem('cartItems')) : []

/** Get User info from local storage*/
const userInfoFromStorage = localStorage.getItem('userInfo') ? 
        JSON.parse(localStorage.getItem('userInfo')) : null

/** Get Shipping Address info from local storage*/
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? 
        JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: { 
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
    },
    userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer, initialState, 
                composeWithDevTools(applyMiddleware(...middleware)))

export default store
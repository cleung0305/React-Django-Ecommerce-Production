import { 
    PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL,
    PRODUCT_DETAIL_REQUEST, PRODUCT_DETAIL_SUCCESS, PRODUCT_DETAIL_FAIL, PRODUCT_DETAIL_RESET,
    PRODUCT_TOP_REQUEST, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAIL,

    //Admin products
    PRODUCT_LIST_ADMIN_REQUEST, PRODUCT_LIST_ADMIN_SUCCESS, PRODUCT_LIST_ADMIN_FAIL,
    PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL, PRODUCT_CREATE_RESET,
    PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_RESET,

    //Reviews
    PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_FAIL, PRODUCT_CREATE_REVIEW_RESET
} from '../constants/productConstants'

//Product List for home page
export const productListReducer = (state = {products:[]}, action) =>{
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return {loading: true, products: []}

        case PRODUCT_LIST_SUCCESS:
            return {
                        loading: false,
                        products: action.payload.products, 
                        page: action.payload.page, 
                        pages: action.payload.pages 
                    }

        case PRODUCT_LIST_FAIL:
            return {loading: false, error: action.payload }

        default:
            return state
    }
}

//Product Detail
export const productDetailReducer = (state = { product:{reviews:[]} }, action) => {
    switch(action.type) {
        case PRODUCT_DETAIL_REQUEST:
            return {loading: true, ...state}

        case PRODUCT_DETAIL_SUCCESS:
            return {loading: false, product: action.payload }

        case PRODUCT_DETAIL_FAIL:
            return {loading: false, error: action.payload }

        case PRODUCT_DETAIL_RESET:
            return { product:{reviews:[]} }

        default:
            return state
    }
}

// Product Top 5
export const productTopReducer = (state = {products:[]}, action) => {
    switch(action.type){
        case PRODUCT_TOP_REQUEST:
            return { loading:true, products:[] }

        case PRODUCT_TOP_SUCCESS:
            return { loading:false, success:true, products:action.payload }

        case PRODUCT_TOP_FAIL:
            return { loading:false, error: action.payload }

        default:
            return state
    }
}

// Product List for admin
export const productListAdminReducer = (state = {products:[]}, action) =>{
    switch (action.type) {
        case PRODUCT_LIST_ADMIN_REQUEST:
            return {loading: true, products: []}

        case PRODUCT_LIST_ADMIN_SUCCESS:
            return {
                        loading: false, 
                        products: action.payload.products, 
                        page: action.payload.page, 
                        pages: action.payload.pages
                    }

        case PRODUCT_LIST_ADMIN_FAIL:
            return {loading: false, error: action.payload }

        default:
            return state
    }
}

// Product Create 
export const productCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case PRODUCT_CREATE_REQUEST:
            return {loading: true}

        case PRODUCT_CREATE_SUCCESS:
            return {loading: false, success: true, product: action.payload }

        case PRODUCT_CREATE_FAIL:
            return {loading: false, error: action.payload }

        case PRODUCT_CREATE_RESET:
            return {}

        default:
            return state
    }
}

// Product Update
export const productUpdateReducer = (state = { product: {} }, action) =>{
    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return {loading: true}

        case PRODUCT_UPDATE_SUCCESS:
            return {loading: false, success: true }

        case PRODUCT_UPDATE_FAIL:
            return {loading: false, error: action.payload }

        case PRODUCT_UPDATE_RESET:
            return {product: {}}

        default:
            return state
    }
}

//Product Delete
export const productDeleteReducer = (state = {}, action) => {
    switch(action.type){
        case PRODUCT_DELETE_REQUEST:
            return { loading: true }

        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true, message: action.payload }

        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload }
        
        default:
            return state
    }
}

//Create Review
export const reviewCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case PRODUCT_CREATE_REVIEW_REQUEST:
            return {loading: true}

        case PRODUCT_CREATE_REVIEW_SUCCESS:
            return {loading: false, success: true }

        case PRODUCT_CREATE_REVIEW_FAIL:
            return {loading: false, error: action.payload }

        case PRODUCT_CREATE_REVIEW_RESET:
            return {}

        default:
            return state
    }
}
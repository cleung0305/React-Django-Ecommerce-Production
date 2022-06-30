import React from 'react';
import { Container } from 'react-bootstrap'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'

import LoginScreen from './screens/LoginScreen'
import LogoutScreen from './screens/LogoutScreen'
import RegisterScreen from './screens/RegisterScreen'

import ProfileScreen from './screens/ProfileScreen'
import ProfileOrdersScreen from './screens/ProfileOrdersScreen'

import ProductScreen from './screens/ProductScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen';

import CartScreen from './screens/CartScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import PlaceOrderPayScreen from './screens/PlaceOrderPayScreen'
import OrderScreen from './screens/OrderScreen'

import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

import OrderListScreen from './screens/OrderListScreen'

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />

            {/* Users Authentications */}
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/logout' element={<LogoutScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* Users Profiles  */}
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/profile/orders" element={<ProfileOrdersScreen />} />

            {/* Admin */}
            <Route path="/admin/all-users" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/admin/all-products" element={<ProductListScreen />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/all-orders" element={<OrderListScreen />} />
            {/* <Route path="/admin/product/:id/edit" element={<UserEditScreen />} /> */}

            {/* Products  */}
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            {/* <Route path="/placeorder" element={<PlaceOrderScreen />} /> */}
            <Route path="/placeorder" element={<PlaceOrderPayScreen />} />
            <Route path='/orders/:id' element={<OrderScreen />} />
            {/* <Route path="/cart/:productId" element={<CartScreen />} /> */}
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

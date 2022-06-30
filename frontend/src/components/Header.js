import React from 'react'
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import SearchBox from './SearchBox'
import { logoutUser } from '../actions/userActions'


function Header() {

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        dispatch(logoutUser())
        navigate("/logout?redirect=")
    }

    return (
        <header>
           <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>LokiTech</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <SearchBox route={''}/>
                    <Nav className="ms-auto">

                        <LinkContainer to="/cart">
                            <Nav.Link><i className='fas fa-shopping-cart'></i> Cart <Badge bg="success" pill>{cartItems.length}</Badge></Nav.Link>
                        </LinkContainer>

                        {
                            userInfo ? 
                                (
                                    <NavDropdown title={userInfo.name} id="username" menuVariant="dark">
                                        <LinkContainer to="/profile">
                                            <NavDropdown.Item className="mt-1 p-2"><i className='fas fa-user'></i> Profile</NavDropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to="/profile/orders">
                                            <NavDropdown.Item className="mt-1 p-2"><i className="fa-solid fa-clipboard"></i> Orders</NavDropdown.Item>
                                        </LinkContainer>


                                        <NavDropdown.Divider />
                                        <NavDropdown.Item className="mt-1 p-2" onClick={logoutHandler}><i className="fa-solid fa-right-from-bracket"></i> Logout</NavDropdown.Item>
                                    </NavDropdown>
                                )
                                : 
                                (
                                    <>
                                        <LinkContainer to="/login">
                                            <Nav.Link><i className="fa-solid fa-right-to-bracket"></i> Login</Nav.Link>
                                        </LinkContainer>

                                        <LinkContainer to="/register">
                                            <Nav.Link><i className="fa-solid fa-user-plus"></i> Register</Nav.Link>
                                        </LinkContainer>
                                    </>
                                )
                        }
                        {
                            userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id="adminmenu" menuVariant="dark">
                                    <LinkContainer to="/admin/all-users">
                                        <NavDropdown.Item className="mt-1 p-2"><i className='fas fa-users'></i> Users</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/all-products">
                                        <NavDropdown.Item className="mt-1 p-2"><i className='fas fa-list-ul'></i> Products</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/all-orders">
                                        <NavDropdown.Item className="mt-1 p-2"><i className='fa-solid fa-clipboard'></i> Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        </header>
    )
}

export default Header

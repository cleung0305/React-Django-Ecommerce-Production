import React, {useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'



function LogoutScreen() {
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const location = useLocation()
    const navigate = useNavigate()
    const redirect = location.search ? location.search.split('=')[1] : ''

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate(`/${redirect}`)
        }, 1500)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div>
            {
                userInfo ? <h3>You are not logged out properly</h3>
                        : <h3>You are now logged out, redirecting to the home page...</h3>
            }
        </div>
    )
}

export default LogoutScreen

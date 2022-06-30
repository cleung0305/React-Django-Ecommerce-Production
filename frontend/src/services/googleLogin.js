import axios from "axios";

const googleLogin = async ({ data, access_token }) => {
    // const headers = {
    //     Authorization: access_token,
    //     'Content-Type': 'application/json'
    // }

    const res = await axios.post('https://lokishop.herokuapp.com/api/users/google/', data)
    return await res.data
  }

export default googleLogin;
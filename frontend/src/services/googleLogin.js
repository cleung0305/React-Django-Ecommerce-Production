import axios from "axios";

const googleLogin = async ({ data, access_token }) => {
    // const headers = {
    //     Authorization: access_token,
    //     'Content-Type': 'application/json'
    // }

    const res = await axios.post('/api/users/google/', data)
    return await res.data
  }

export default googleLogin;
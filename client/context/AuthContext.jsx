import { createContext, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast'

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineuser, setOnlineUser] = useState([])
    const [socket, setSocket] = useState(null)

    // Check if user is authenticated and if so, set the user data and connect the socket

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/auth/auth/check");
            if (data.success) {
                setAuthUser(data.user)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const value = {
        axios,
        authUser,
        onlineuser,
        socket,
    }


    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}


import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast'
import { connect, io } from "socket.io-client"

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
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
          const data = await axios.post(`/api/auth/${state}`, credentials)

          if(data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);

            axios.defaults.headers.common["token"] = data.token;
            setToken(data.token);
            localStorage.setItem("token", data.token)
            toast.success(data.message)
          }else{
            toast.error(data.message)
          }
        } catch (error) {
           toast.error(error.message)
        }
    }


    // Logout function to handle user logout and socket disconnection
    const logout = () => {
        try {
            localStorage.removeItem("token")
            setToken(null)
            setAuthUser(null)
            setOnlineUser([])
            axios.defaults.headers.common["token"] = null
            toast.success("Logout successful")
            socket.disconnect()
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Update Profile function to handle user profile updates
    const updateProfile = async (body) => {
        try{
            const data = await axios.put("/api/auth/update-profile", body)

            if(data.success){
                setAuthUser(data.user)
                toast.success("profile updated successfully")
            }
        }catch(error){
          toast.error(error.message)
        }
    }



    // connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        })
        newSocket.connect();
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", () => {
            setOnlineUser(userId)
        })
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth()
    }, [])

    const value = {
        axios,
        authUser,
        onlineuser,
        socket,
        login,
        logout,
        updateProfile,
    }


    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}


import { useEffect } from "react"
import { Navigate } from "react-router"
import { useAuth } from "../providers/AuthProvider"

export default function Logout() {
	const { setUser } = useAuth()
	
	useEffect(() => {
		setUser(null)
		localStorage.removeItem('currentUser')
	}, [setUser])
	
	return <Navigate to="/login" />
}
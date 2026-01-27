import { Navigate } from "react-router"
import { useAuth } from "../providers/AuthProvider"

export default function ProtectedRoute(props) {
	const { user } = useAuth()
	
	if (!user) {
		return <Navigate to="/login" />
	}
	
	return props.children
}
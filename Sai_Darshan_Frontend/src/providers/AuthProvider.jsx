import { useContext, useEffect } from "react"
import { useState } from "react"
import { createContext } from "react"

export const AuthContext = createContext({})

function AuthProvider(props) {
	const [user, setUser] = useState()
	
	useEffect(() => {
		const currentUser = localStorage.getItem('currentUser')
		if (currentUser) {
			setUser(JSON.parse(currentUser))
		}
	}, [])
	
	return <AuthContext.Provider value={{user, setUser}}>
		{props.children}
	</AuthContext.Provider>
}

export default AuthProvider

export function useAuth() {
	const auth = useContext(AuthContext)
	return auth
}
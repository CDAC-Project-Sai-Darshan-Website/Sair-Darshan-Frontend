import { useEffect } from "react"
import { Route, Routes } from "react-router"
import AuthProvider from "./providers/AuthProvider"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Logout from "./components/Logout"
import NotFound from "./components/NotFound"
import UserLayout from "./components/UserLayout"
import Dashboard from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import DarshanBooking from "./components/DarshanBooking"
import AartiBooking from "./components/AartiBooking"

import DonationPage from "./components/DonationPage"
import MyBookingsUser from "./components/MyBookingsUser"
import UserProfile from "./components/UserProfile"

import TempleServices from "./components/TempleServices"

function App() {
	useEffect(() => {
		const users = JSON.parse(localStorage.getItem('users') || '[]')
		if (!users.find((u) => u.email === 'admin@shirdi.com')) {
			const adminUser = {
				id: 'admin-1',
				firstName: 'Admin',
				lastName: 'Shirdi',
				dateOfBirth: '1990-01-01',
				gender: 'male',
				photoIdProof: 'Aadhaar',
				phoneNumber: '9999999999',
				email: 'admin@shirdi.com',
				password: 'admin123',
				role: 'admin',
				createdAt: new Date().toISOString()
			}
			users.push(adminUser)
			localStorage.setItem('users', JSON.stringify(users))
		}
	}, [])

	return <div>
		<AuthProvider>
			<Routes>
				<Route index element=<Login/> />
				<Route path="/login" element=<Login/> />
				<Route path="/signup" element=<Signup/> />
				<Route path="/logout" element=<Logout/> />
				<Route path="/user" element=<UserLayout/> >
					<Route index element=<ProtectedRoute>
						<Dashboard/>
					</ProtectedRoute> />
					<Route path="dashboard" element=<ProtectedRoute>
						<Dashboard/>
					</ProtectedRoute> />
					<Route path="darshan" element=<ProtectedRoute>
						<DarshanBooking/>
					</ProtectedRoute> />
					<Route path="aarti" element=<ProtectedRoute>
						<AartiBooking/>
					</ProtectedRoute> />
					
					
					<Route path="donation" element=<ProtectedRoute>
						<DonationPage/>
					</ProtectedRoute> />
					<Route path="services" element=<ProtectedRoute>
						<TempleServices/>
					</ProtectedRoute> />
					<Route path="my-bookings" element=<ProtectedRoute>
						<MyBookingsUser/>
					</ProtectedRoute> />
					<Route path="profile" element=<ProtectedRoute>
						<UserProfile/>
					</ProtectedRoute> />
				</Route>
				
				<Route path="*" element=<NotFound/> />
			</Routes>
		</AuthProvider>
	</div>
}

export default App
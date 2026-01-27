import { Outlet } from "react-router"
import Navbar from "./Navbar"

export default function UserLayout() {
	return <div>
		<Navbar />
		<Outlet />
	</div>
}
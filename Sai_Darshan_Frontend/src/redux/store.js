import { configureStore } from "@reduxjs/toolkit"
import bookingsReducer from "./bookingsSlice"

const store = configureStore({
	reducer: {
		bookings: bookingsReducer
	}
})

export default store
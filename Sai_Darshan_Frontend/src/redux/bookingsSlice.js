import { createSlice } from "@reduxjs/toolkit"

const bookingsSlice = createSlice({
	name: "bookings",
	initialState: { items: [] },
	reducers: {
		addBooking: (state, action) => {
			state.items.push(action.payload)
		},
		loadBookings: (state, action) => {
			state.items = action.payload
		},
		clearBookings: (state, action) => {
			state.items = []
		}
	}
})

export const { addBooking, loadBookings, clearBookings } = bookingsSlice.actions
export default bookingsSlice.reducer
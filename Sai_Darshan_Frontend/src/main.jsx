import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import {BrowserRouter} from 'react-router'
import {Provider} from 'react-redux'
import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<div className='min-h-screen bg-gradient-to-b from-orange-50 to-white'>
			<Provider store={store}>
				<App />
			</Provider>
		</div>
	</BrowserRouter>,
)
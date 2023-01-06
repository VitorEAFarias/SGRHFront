import './index.css'
import ReactDOM from 'react-dom'
import React from 'react'

import App from './App'
import { BrowserRouter } from 'react-router-dom'

{/* <BrowserRouter basename='/smt'> */}
{/* <BrowserRouter basename='/'> */}

ReactDOM.render(
    <BrowserRouter basename='/'><App /></BrowserRouter>,
    document.getElementById('root')
)
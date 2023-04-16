import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Navbar from './navbar/Navbar.jsx'
import './index.css'

import {
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom"
import MainMapPage from './map/MainMapPage.jsx'
import UploadGPX from './gpx/UploadGpx.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <p>error error</p>,
    children: [
      {
        path: "/home",
        index: true,
        element: <MainMapPage/>,
      },
      {
        path: "/load",
        element: <UploadGPX/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  
  </React.StrictMode>,
)

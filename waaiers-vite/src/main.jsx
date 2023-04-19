import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Navbar from './navbar/Navbar.jsx'
import './index.css'
import UpcomingRaces from './UpcomingRaces.jsx'


import {
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom"
import MainMapPage from './map/MainMapPage.jsx'

import FileUploader from './FileUploader.jsx'
import Login from './Login.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <p>error error</p>,
    children: [
      {
        path: "load",
        element: <FileUploader/>,
      },
      {
        path: "home",
        element: <MainMapPage/>,
      },
      {
        path: "races",
        element: <UpcomingRaces/>,
      },
      {
        path: "login",
        element: <Login/>,
      }
      
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  
  </React.StrictMode>,
)

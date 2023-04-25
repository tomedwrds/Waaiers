import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UpcomingRaces from './UpcomingRaces.jsx'


import {
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom"
import MainMapPage from './map/MainMapPage.jsx'

import Login from './Login.jsx'
import UploadRoute from './upload route/UploadRoute.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <p>error error</p>,
    children: [
      {
        path: "load",
        element: <UploadRoute/>,
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

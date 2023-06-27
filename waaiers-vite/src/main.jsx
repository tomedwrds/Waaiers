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
import AdminPanel from './admin panel/AdminPanel.jsx'
import Home from './Home/Home.jsx'
import About from './about/About.jsx'


const router = createBrowserRouter([
  {
    

    element: <App/>,
    errorElement: <p>error error</p>,
    children: [
      {
        path: "load",
        element: <UploadRoute/>,
      },
      {
        path: "race/*",
        element: <MainMapPage/>,
      },
      {
        path: "races",
        element: <UpcomingRaces/>,
      },
      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "admin",
        element: <AdminPanel/>,
      },
      {
        path: "about",
        element: <About/>,
      },
      { path: "*", element: <Home/> },
      
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  
  </React.StrictMode>,
)

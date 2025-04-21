/*eslint-disable*/
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import Home from './Components/Home/Home.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'
import Login from './Components/Auth/Login.jsx'
import Register from './Components/Auth/Register.jsx'
import { Toaster } from 'react-hot-toast'
import Contact from './Components/Contact/Contact.jsx'
import AboutUs from './Components/AboutPage/AboutPage.jsx'
import SpecializationsPage from './Components/SpecializationsPage/SpecializationsPage';
import DoctorDeatils from './Components/DoctorPage/DoctorDeatils.jsx'
import Payment from './Components/Payment/Payment.jsx'

const routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <AboutUs /> },
      { path: "specializationsPage", element: <SpecializationsPage /> },
      { path: "Doctor-details/:id", element: <DoctorDeatils /> },
      { path: "Payment", element: <Payment /> },
      { path: "*", element: <NotFound /> }
    ],
  },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> }
]);

function App() {
  return (
    <>
      <RouterProvider router={routers} />
      <Toaster toastOptions={
        {
          duration: 4000,
          style:{
            textAlign: "center",
          }
        }
      } />
    </>
  )
}

export default App

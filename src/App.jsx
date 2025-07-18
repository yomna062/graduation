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

import Profile from './Components/Profile/Profile';
import Doctor_Panel from './Components/Dashboard/Doctor_Panel.jsx'
import PatientPanel from './Components/Dashboard/PatientPanel.jsx'
import Panel from './Components/Panel/Panel.jsx'
import AddHistory from './Components/Dashboard/AddHistory.jsx'
import SeeHistory from './Components/Dashboard/SeeHistory.jsx'
import Bounce from './Components/Bounce/Bounce';


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
      { path: "Profile", element: <Profile/> },
      {path: "Payment", element: <Payment />},
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "Bounce", element: <Bounce /> },
      { path: "Payment", element: <Payment /> },
      {path: 'panel' , element: <Panel />},
      {path:'patient-panel' , element: <PatientPanel />},
      {path:'AddHistory/:id' , element: <AddHistory />},
      {path:'SeeHistory/:id' , element: <SeeHistory />},


      {path: 'DoctorPanel' , element: <Doctor_Panel />},

      { path: "*", element: <NotFound /> }
    ],
  },
  
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

/*eslint-disable*/
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import Home from './Components/Home/Home.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'


let routers = createBrowserRouter([{
  path:'' , element : <Layout/>,children:[
    // {index: true , element: <Register/>},
    // {path:'login' , element: <Login/>},
    // {path:'home' , element: <Home/>},
    // {path:'cart' , element: <Cart/>},
    // {path:'brands' , element: <Brands/>},
    // {path:'categories' , element: <Categories/>},
    // {path:'products' , element: <Products/>},
    // {path:'*' , element: <NotFound/>},
    {index : true , element:<Home/>},
    {index: true , element: <Register/>},
    {path:'login' , element: <Login/>},
  ]
}])
function App() {

  return <>

    <RouterProvider router={routers}></RouterProvider>

  </>
}

export default App

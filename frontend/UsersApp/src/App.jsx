import {
    RouterProvider,
    // createBrowserRouter,
    createHashRouter,
    createRoutesFromElements,
    Route
} from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { action as loginAction, loader as loginLoader } from './Pages/Login';
// import requireAuth from './assets/assets';
import DashboardLayout from './Components/DashbordLayout';
import { loader as DashboardLoader } from './Pages/Dashboard'
import { loader as EditLoader } from './Pages/Edit'
import { loader as InputLoader } from './Pages/Input'
import Edit from './Pages/Edit';
import Input from './Pages/Input';
import Notfound from './Pages/NotFound';
import ErrorPage from './Pages/ErrorPage.jsx'


const router = createHashRouter(createRoutesFromElements(
    <Route>
    <Route path='login' element={<Login />} action={loginAction} loader={loginLoader} />
    <Route path='/dashboard' element={<DashboardLayout />}>
      <Route index element={<Dashboard />} loader={DashboardLoader} errorElement={<ErrorPage />}/>
      <Route path='plants/:id' element={<Edit />} loader={EditLoader} errorElement={<ErrorPage />} />
      <Route path='plants/add' element={<Input />} loader={InputLoader} errorElement={<ErrorPage />} />
    </Route>
    <Route path="*" element={<Notfound />} />
  </Route>
))


function App() {
    return (
    <RouterProvider router={router} />
  )
}

export default App

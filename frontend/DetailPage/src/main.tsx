import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import axios from "axios";
import { ThemeProvider } from "@material-tailwind/react";
import {createHashRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import NotFound from "./Components/NotFound.tsx";


const router = createHashRouter(createRoutesFromElements(
    <Route>
        <Route path=':id' element={<App />} />
        <Route path="*" element={<NotFound />} />
    </Route>
))

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <RouterProvider router={router}/>
    </ThemeProvider>
)

// axios.defaults.baseURL = 'http://localhost:9000'
axios.defaults.baseURL = window.location.origin
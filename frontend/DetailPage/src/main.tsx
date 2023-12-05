import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import axios from "axios";
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
)

axios.defaults.baseURL = 'http://localhost:9000'
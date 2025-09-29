import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRouter from "./components/AppRouter"
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MantineProvider withGlobalStyles withNormalizeCSS>
              <AppRouter/>
            </MantineProvider>
    </StrictMode>
)
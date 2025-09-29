import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import {Button} from "./components/ui/button";
import AppRouter from "@/components/AppRouter.jsx";


function App() {
    return (
            <main className='main-content'>
                <AppRouter/>
            </main>
    )
}

export default App;


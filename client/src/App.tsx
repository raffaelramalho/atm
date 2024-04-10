/*---------------------------------------------------------------*


█▀▄ █▀▀ █░░ █▀█ █ █▄░█ █░█ █▀█  
█▄▀ ██▄ █▄▄ █▀▀ █ █░▀█ █▀█ █▄█  

Versão 2.1.3 (Espero que seja a final)
Feito por Rafael "Okas" Ramalho Rosa
Github: https://github.com/raffaelramalho 😎🎂
/---------------------------------------------------------------*/

import Form from "./pages/Form";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"
import EsqueciSenha from "./pages/EsqueciSenha";
import Sidebar from "./components/Sidebar";
import Ferias from "./pages/Ferias"
import './App.css'
import Excecao from "./pages/Excecao";
import LogException from "./pages/LogException";
import LogChanges from "./pages/LogChanges";
import Sabado from "./pages/Sabado";
import RequireAuth from './components/ProtectedRoute'
import LiberaGeral from "./pages/LiberaGeral";


function App({}) {

  
  return ( 
    <BrowserRouter>
    <Navbar/>
    <div className="app-body ">
      <Sidebar/>
      <Routes>
          <Route path="login/" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route element={<RequireAuth/>}>
                      <Route path="home/" element={<Home />} />
                      <Route path="form/" element={<Form />} /> /* Formulário de troca de turno*/
                      <Route path="EsqueciSenha/" element={<EsqueciSenha />} />
                      <Route path="ferias/" element={<Ferias />} /> /* Formulário de ferias*/
                      <Route path="excecao/" element={<Excecao />} /> /* Formulário de liberação temporaria */
                      <Route path="logexcecao/" element={<LogException />} />/* Histórico de Exceção */
                      <Route path="*" element={<Error />} />
                      <Route path="logchanges/" element={<LogChanges/>}/> /* Histórico de trocas de turno */
                      <Route path="sabado/" element={<Sabado/>}/> /* Formulário de liberação sabado*/
                      <Route path="liberaGeral/" element={<LiberaGeral/>}/> /* Formulário de liberar em atraso de onibus*/
          </Route> 
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App

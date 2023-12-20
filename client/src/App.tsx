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
                      <Route path="form/" element={<Form />} />
                      <Route path="EsqueciSenha/" element={<EsqueciSenha />} />
                      <Route path="ferias/" element={<Ferias />} />
                      <Route path="excecao/" element={<Excecao />} />
                      <Route path="logexcecao/" element={<LogException />} />
                      <Route path="*" element={<Error />} />
                      <Route path="logchanges/" element={<LogChanges/>}/>
                      <Route path="sabado/" element={<Sabado/>}/>
          </Route> 
      </Routes>
    </div>
      
    </BrowserRouter>
  )
}

export default App

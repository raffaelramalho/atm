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


function App({}) {
  
  return ( 
    <BrowserRouter>
    <Navbar/>
    <div className="app-body">
      <Sidebar/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home/" element={<Home />} />
          <Route path="login/" element={<Login />} />
          <Route path="form/" element={<Form />} />
          <Route path="EsqueciSenha/" element={<EsqueciSenha />} />
          <Route path="ferias/" element={<Ferias />} />
          <Route path="excecao/" element={<Excecao />} />
          <Route path="*" element={<Error />} />
      </Routes>
    </div>
      
    </BrowserRouter>
  )
}

export default App

import Form from "./pages/Form";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"
import EsqueciSenha from "./pages/EsqueciSenha";


function App({}) {
  
  return ( 
    <BrowserRouter>
    <Navbar/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home/" element={<Home />} />
          <Route path="login/" element={<Login />} />
          <Route path="form/" element={<Form />} />
          <Route path="EsqueciSenha/" element={<EsqueciSenha />} />
          <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

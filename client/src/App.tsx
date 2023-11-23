import Form from "./pages/Form";
import { Provider } from 'react-redux';

import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";



function App({}) {
  
  return ( 
    <BrowserRouter>
    <Navbar/>
      <Routes>
          <Route path="login" element={<Login />} />
          <Route path="form" element={<Form />} />
          <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

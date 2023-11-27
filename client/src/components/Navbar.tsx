import { useLocation } from "react-router-dom";

export default function Navbar() {
  let location = useLocation();

  return (
    <div className='custom-navbar'>
      
      <h4 className='user-identification'>{ location.state == null ? '' : `Bem vindo, ${location.state.userId}`}</h4>
      <h3>ID Secure 2.0</h3>
    </div>
  )
}

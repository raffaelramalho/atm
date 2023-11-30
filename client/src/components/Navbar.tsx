import { useLocation } from "react-router-dom";
import './navbar.css'

export default function Navbar() {
  let location = useLocation();

  return (
    <div className='custom-navbar'>
      <img src="../public/delp-nobg.png" alt="delp-logo" className="logo-fluid" />
      <h3>CONTROL HUB</h3>
    </div>
  )
}

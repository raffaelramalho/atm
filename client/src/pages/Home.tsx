import {  Link } from 'react-router-dom';
import { FaDesktop } from "react-icons/fa6";

function HomePage() {
    

  return (
    <div className="grid-helper">
      
      <Link className='menu-button' to={'/login'}  > 
      <FaDesktop  className="menu-icon"/>
      A.T.M.
      </Link>
    </div>
  );
}

export default HomePage;

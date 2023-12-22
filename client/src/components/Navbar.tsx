import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../assets/delp-new-logo.png"

export default function Navbar() {
  // @ts-expect-error TS6133
  let location = useLocation();
  const [token, setToken] = useState(false);
  const handleLogoff = () => {
    // Limpa o token de autenticação
    localStorage.removeItem('token');

    // Redireciona o usuário para a página de login
    window.location.href = '/login';
  };
  useEffect(() => {

    const token = localStorage.getItem('token');
    const level = localStorage.getItem('userLevel')

    if (token) setToken(true);
  }, []);
  return (
    <div className='flex h-20 items-center px-5 bg-background justify-between  sm:px-10 shadow-xl fixed w-full'>
      <a href="/">
        <img src={Logo} alt="delp-logo" className="h-10 sm:h-14" />
      </a>
      <span className="pr-10">
        {token && <span>
          {/* @ts-ignore */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6"
            onClick={handleLogoff}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
        </span>}
      </span>
    </div>
  )
}

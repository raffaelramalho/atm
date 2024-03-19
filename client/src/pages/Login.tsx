import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Logo from "../assets/delpinhoTI.png"
import config from '../config'
import '../index.css';
import './trinagle.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [warningText, setWarningText] = useState(false)
  const [hasToken, setHasToken] = useState(false);
  //@ts-ignore
  const location = useLocation();
  let navigate = useNavigate();
  // const { haveToken, tokenExpire } = useAuth();
  // if (!haveToken || tokenExpire) {
  //   // Redireciona ou lida com a falta de autenticação
  // }
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      setHasToken(true);
    }
  }, []);

  if (hasToken) {
    window.location.href = `/home`;
  }

  const handleLogin = async () => {
    setLoading(true);
    localStorage.setItem('token', 'admin');
    localStorage.setItem('userLevel',  'admin');
    try {

      var response = await fetch(`${config.backendUrl}/api/v1/loginValidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formLogin: username,
          formPassword: password,

        }),

      });

      const data = await response.json();


      if (data.token.ok) {

        const token = data.token.token
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        //@ts-ignore
        localStorage.setItem('userLevel',  decodedToken.role);
        navigate(`/home?token=${token}`,{state: { userId: username}})
        window.location.reload();
        setWarningText(false)
      } else {
        throw new Error(`Erro na requisição: ${data.statusText}`);
      }
    }
    catch (error) {
      setWarningText(true)
    } finally {
      setLoading(false);

    }
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-[url('./soldadin.jpg')] bg-no-repeat bg-cover">
      <form onKeyDown={handleKeyDown} 
          className="bg-background w-4/6 h-96 border border-navbar border-opacity-50 p-10 flex flex-col items-center justify-around sm:w-3/12  ">
        <div>
            
          <img src={Logo} alt=""/>
        </div>
        <div className='w-full'>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='bg-section border border-[#08020255] border-opacity-50'
          />
        </div>
        <div className='w-full'>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-section border border-[#08020255] border-opacity-50'
          />
        </div>

        <button type="button" onClick={handleLogin} className='bg-delpRed hover:bg-[#5e2525]'>
          {loading ? " carregando" : "Login"}
        </button>
        <p className='h-3 w-full text-center sm:text-base text-xs md:text-xs' >{warningText ? "Usuário ou senha incorretos" : ""}</p>
      </form>

    </div>
  );
};

export default Login;
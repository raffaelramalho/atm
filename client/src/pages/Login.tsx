import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


import '../index.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [warningText, setWarningText] = useState(false)
  const [hasToken, setHasToken] = useState(false);
  const location = useLocation();
  let navigate = useNavigate();

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


    try {


      var response = await fetch('http://10.0.1.204:3307/api/v1/loginValidate', {
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
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <form className="bg-background w-3/6 h-3/6 border border-navbar border-opacity-50 p-10 flex flex-col items-center justify-around sm:w-/6 items-center">
        <h1 className='font-medium text-3xl'>DELP ID Secure</h1>
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

        <button type="button" onClick={handleLogin} className='bg-successBtn hover:bg-[#2e3464]'>
          {loading ? " carregando" : "Login"}
        </button>
        <Link to={'/EsqueciSenha'} className='my-2'>Esqueci minha senha</Link>
        <p className='h-6'>{warningText ? "Usuário ou senha incorretos" : ""}</p>
      </form>

    </div>
  );
};

export default Login;
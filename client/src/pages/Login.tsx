import  { useState } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import '../index.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [warningText, setWarningText] = useState(false)
  let navigate = useNavigate();
  const handleLogin = async () => {
    setLoading(true);

  
    try {
     
        
       var response =  await fetch('http://10.0.1.204:3307/api/v1/loginValidate', {
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
        // @ts-expect-error TS6133
        const token = data.token.token
        navigate(`/form?token=${data.token.token}`,{state: { userId: username}})
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
      <form className="bg-background w-2/6 h-3/6 border border-navbar border-opacity-50 p-10 flex flex-col items-center justify-around">
        <h1 className='font-medium text-3xl'>DELP Control</h1>
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
          {loading ?  " carregando" : "Login"}
        </button>
        <Link to={'/EsqueciSenha'} className='my-2'>Esqueci minha senha</Link>
        <p className='h-14'>{warningText ? "Usuário ou senha incorretos" : ""}</p>
      </form>
      
    </div>
  );
};

export default Login;
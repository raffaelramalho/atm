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

    console.log(`Usuário: ${username}, Senha: ${password}`);
    try {
      console.log('Enviado requisição ')
        
       var response =  await fetch('http://192.168.15.87:3307/login/', {
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
       console.log(data)

    if (data.token.ok) {
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
    <div className="login-container">
      
      <form className="login-form">
        <h1 className='title-form'>ATM</h1>
        <label htmlFor="username">Usuário:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLogin}>
          {loading ?  " carregando" : "Login"}
        </button>
        <Link to={'/EsqueciSenha'} className='password-link'>Esqueci minha senha</Link>
        
      </form>
      <p className='warning-text'>{warningText ? "Usuário ou senha incorretos" : ""}</p>
    </div>
  );
};

export default Login;
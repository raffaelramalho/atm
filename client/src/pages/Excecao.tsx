import React, { useState, useEffect, useCallback } from 'react';
import UsersList from '../components/UsersList';
import axios from 'axios';


export default function Excecao() {

  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ response: '' });
  const [form, setForm] = useState({ userName: '',dataInicio: '', dataFim: '' });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)
  const [avisoType, setAvisoType] = useState('');

  //Autocomplete
  const [inputCol, setInputCol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputLib, setInputLib] = useState('');
  const [search,setSearch] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) setToken(true);
  }, []);

  const handleInputChange = async (event) => {
    setSuggestions([])
    const value = event.target.value;
    setInputCol(value);

    if (value.length > 0) {
      const results = await axios.get(`http://10.0.1.204:3307/api/v1/search?username=${value}`);
      console.log(results.data);
      setSuggestions(results.data[0])
      console.log(suggestions)
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = async (event) => {
    const selectedValue = event.target.textContent
    console.log(selectedValue)
    setSearch(selectedValue)
    setSuggestions([])
    
  }
//Validação
const validateForm = () => {

  const { userName, } = form;
 
  if (userName.length === 0 ) {
    setAvisoType('branco');
    return false;
  }
  setAvisoType('');
  return true;
};

const handleSubmit = (e) => {
  e.preventDefault();
};

  const handleUpdate = async () => {
    if (validateForm()) {
      setLoading(true);
    if(form.userName.length > 0){
      try {
        const response = await fetch('http://10.0.1.204:3307/api/v1/processar-ferias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nomeLiberado: userName, dataInicio: dataInicio, dataFim:dataFim }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          
        } else {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao enviar dados para o backend', error);
      } finally {
        setLoading(false);
      }
    } else{
      setLoading(false);
      setable(true);
      setAviso(true)
    }
    
    }
  };
const [delay, setDelay] = useState(0);

useEffect(() => {
  const timer = setTimeout(() => setDelay(200000), 0);
}, []);

useEffect(() => {
  const timer = setTimeout(() => setLoading(false), delay);
  return () => clearTimeout(timer); 
}, [delay]); 
 

  return (
    <div className='flex-col p-5 w-full sm:flex-row sm:p-10 h-screen overflow-auto'>
      <h3 className='text-3xl my-2'>Exceção para passagem na catraca:</h3>
      {token1 ? (
        <div className='bg-background p-10'>
          <div className='mb-5'>
          <h5 className=''>Utilize apenas as teclas (Shift + Enter) para separar os nomes nas linhas, não é necessário "," nem "." ao final de cada nome. <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          </div>
          <form className='flex flex-col ' onClick={handleSubmit}>
            <div>
              <div className='flex flex-row w-full'>
                  <div className='w-4/6 pr-5'>
                  <p>Colaborador a ser liberado:</p>
                  <input type="text" value={inputCol} onChange={handleInputChange} className='border border-navbar border-opacity-50 border-solid bg-background '/>
                    <div className='flex flex-col absolute bg-background  border-x border-solid border-b max-h-3/5 overflow-y-auto'>
                    {suggestions.map((suggestion) => (
                      <a key={suggestion.registration} 
                              className='flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer'
                              onClick={handleSearchSelect}
                              name='search'>
                        {suggestion.name}
                      </a>
                    ))}
                    </div>
                  </div>
                  <div className='w-2/6 '>
                    <p>Matrícula:</p>
                    <input type="number" className='border border-navbar border-opacity-50 border-solid bg-background'/>
                  </div>
              </div>
              <div className='flex flex-row w-full'>
                  <div className='w-4/6 pr-5'>
                    <p>Liberador:</p>
                    <input type="text" value={inputLib}  className='border border-navbar border-opacity-50 border-solid bg-background '/>
                  </div>
                  <div className='w-2/6 '>
                    <p>Matrícula do liberador:</p>
                    <input type="number" className='border border-navbar border-opacity-50 border-solid bg-background'/>
                  </div>
              </div>
              <div>
                <p>Observação:</p>
                <textarea name="observacao" id="" cols="30" rows="10" className='border border-navbar border-opacity-50 border-solid w-full'></textarea>
              </div>
              <div>
                <button className='bg-successBtn hover:bg-[#123]'>
                   Cadastrar liberação temporária
                </button>
              </div>
              <div className='flex justify-center h-14 items-center'>
                <p></p>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className='w-full h-screen'>
          <p>Você não tem permissão para acessar isso D:</p>
        </div>
      )}
      {loading ? (
        <div className='loader'>
          <img src="../public/Spinner.svg" alt="" />
        </div>
      ) : (
        resultados.ok === 0 ? (
          <div className='flex flex-row bg-background p-10 sm:flex-col'>
            <UsersList NameList={resultados.nome} ListName={`Colaboradores Alterados `} messageContent={' teste.'}/>
          </div>
        ) : null
      )}
    </div>
  );
}


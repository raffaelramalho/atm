import React, { useState, useEffect, useCallback } from 'react';
import UsersList from '../components/UsersList';
import axios from 'axios';


export default function Excecao() {

  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ response: '' });
  const [form, setForm] = useState({ nameC: '', nameL: '', regC: '', regL: '', obs: '' });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)
  const [avisoType, setAvisoType] = useState('');
  const [inputCol, setInputCol] = useState('');
  const [inputColReg, setInputColReg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputLib, setInputLib] = useState('');
  const [inputLibReg, setInputLibReg] = useState('');
  const [search, setSearch] = useState('')
  const [autocomplete, setAutoComplete] = useState('')



  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) setToken(true);
  }, []);

  const handleInputChange = async (event) => {
    setSuggestions([])
    const inputType = event.target.name
    const value = event.target.value;

    if (inputType == 'liberador') {
      setAutoComplete('liberador')
      setInputLib(value);
      setForm({ ...form, nameL: value })
    } else if(inputType == 'liberado'){
      setAutoComplete('liberado')
      setInputCol(value);
      setForm({ ...form, nameC: value })
    } else if(inputType == 'liberadorReg'){
      setAutoComplete('liberado')
      setInputLibReg(value);
      setForm({ ...form, regL: value })
    } else if(inputType == 'liberadoReg'){
      setAutoComplete('liberado')
      setInputColReg(value);
      setForm({ ...form, regC: value })
    }

    if (value.length > 0) {
      const results = await axios.get(`http://10.0.1.204:3307/api/v1/search?username=${value}`);
      setSuggestions(results.data[0]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = async (event) => {
    setAutoComplete('');
    const name = event.target.name
    const selectedValue = event.target.textContent
    const id = event.target.id;
    if (name === 'liberado') {
      setSearch(selectedValue)
      setInputCol(selectedValue)
      setInputColReg(id)
      setForm({ ...form, nameC: selectedValue, regC: id })
    } else {
      setSearch(selectedValue)
      setInputLib(selectedValue)
      setInputLibReg(id)
      setForm({ ...form, nameL: selectedValue, regL: id })
    }
    setSuggestions([])
  }


  const validateForm = () => {
    setAvisoType('');
    console.log(form)
    const { nameC, nameL, regC, regL, obs } = form;
    if (!nameC || !nameL || !regC || !regL || !obs) {
      console.log('Todos os campos devem ser preenchidos.');
      setAvisoType('branco');
      return false;
    }
    if (nameC === nameL) {
      console.log('nameC e nameL não podem ser iguais.');
      setAvisoType('igual');
      return false;
    }
    if (regL === regC) {
      console.log('regL e regC não podem ser iguais.');
      setAvisoType('igual');
      return false;
    }

    setAvisoType('');
    return true;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const text = e.target.value
    setForm({ ...form, obs: text })
  };
  const handleUpdate = async () => {
    if (validateForm()) {
      setLoading(true);
      const formData = {
        nameC: form.nameC,
        nameL: form.nameL,
        regC: form.regC,
        regL: form.regL,
        obs: form.obs,
      };
      console.log('Começando comunicação com backend...')
      try {
        const response = await axios.post(`http://10.0.1.204:3307/api/v1/exception`, formData);

        if (response.status === 200) {
          console.log('Atualização bem-sucedida!');
          setAvisoType('sucesso');
        } else {
          console.log('Erro na atualização:', response);
        }
      } catch (error) {
        console.error('Erro na atualização:', error);
      }

      setLoading(false);
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
            <h5 className=''>Preencha todos os campos para poder liberar o colaborar por um período de 30 MINUTOS  <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          </div>
          <form className='flex flex-col ' onClick={handleSubmit}>
            <div>
              <div className='flex flex-col w-full my-1 sm:my-5 sm:flex-row'>
                <div className='sm:w-4/6 sm:pr-5 w-full'>
                  <p>Colaborador a ser liberado:</p>
                  <input type="text"
                    value={inputCol}
                    onChange={handleInputChange}
                    className='border border-navbar border-opacity-50 border-solid bg-background'
                    name='liberado'
                  />
                  <div className='flex flex-col absolute bg-background  border-x border-solid border-b max-h-3/5 overflow-y-auto'>
                    {autocomplete == 'liberado' ? (
                      suggestions.map((suggestion) => (
                        <a key={suggestion.registration}
                          className='flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer'
                          onClick={handleSearchSelect}
                          name='liberado'
                          id={suggestion.registration}
                        >
                          {suggestion.name}
                        </a>
                      ))
                    ) : null}
                  </div>
                </div>
                <div className='sm:w-2/6 w-full '>
                  <p>Matrícula:</p>
                  <input type="number"
                    value={inputColReg}
                    onChange={handleInputChange}
                    name='liberadoReg'
                    className='border border-navbar border-opacity-50 border-solid bg-background' />
                </div>
              </div>
              <div className='flex flex-col w-full sm:my-5 sm:flex-row '>
                <div className='sm:w-4/6 sm:pr-5 w-full'>
                  <p>Liberador:</p>
                  <input type="text"
                    value={inputLib}
                    onChange={handleInputChange}
                    className='border border-navbar border-opacity-50 border-solid bg-background'
                    name='liberador' />
                  <div className='flex flex-col absolute bg-background  border-x border-solid border-b max-h-3/5 overflow-y-auto'>
                    {autocomplete == 'liberador' ? (
                      suggestions.map((suggestion) => (
                        <a key={suggestion.registration}
                          className='flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer'
                          onClick={handleSearchSelect}
                          name='liberador'
                          id={suggestion.registration}
                        >
                          {suggestion.name}
                        </a>
                      ))
                    ) : null}
                  </div>
                </div>
                <div className='sm:w-2/6 w-full'>
                  <p>Matrícula do liberador:</p>
                  <input type="number"
                    value={inputLibReg}
                    onChange={handleInputChange}
                    name='liberadorReg'
                    className='border border-navbar border-opacity-50 border-solid bg-background' />
                </div>
              </div>
              <div className='mb-1 sm:mb-5'>
                <p>Observação:</p>
                <textarea
                  name="observacao"
                  id=""
                  cols="30"
                  rows="10"
                  className='border border-navbar border-opacity-50 border-solid w-full p-3'
                  onChange={handleChange}
                >
                </textarea>
              </div>
              <div>
                <button className='bg-successBtn hover:bg-[#123] ' onClick={handleUpdate}>
                  { loading ? ( 
                    <img src="../public/Spinner.svg" alt="" className='h-10 m-auto'/>
                  ) :'Cadastrar liberação temporária' }
                </button>
              </div>
              <div className='flex justify-center h-14 items-center'>
                <p>{avisoType === 'branco' ? "O formulário não pode estar em branco." : ""}</p>
                <p>{avisoType === 'igual' ? "O Colaborador e Liberador não podem ser iguais." : ""}</p>
                <p>{avisoType === 'sucesso' ? "O Colaborador foi liberado por 30 minutos. :D" : ""}</p>
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
          <img src="../public/Spinner.svg" alt="" className='m-auto'/>
        </div>
      ) : (
        resultados.ok === 0 ? (
          <div className='flex flex-row bg-background p-10 sm:flex-col'>
            <UsersList NameList={resultados.nome} ListName={`Colaboradores Alterados `} messageContent={' teste.'} />
          </div>
        ) : null
      )}
    </div>
  );
}


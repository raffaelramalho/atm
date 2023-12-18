// @ts-expect-error TS6133
import React, { useState, useEffect, useCallback } from 'react';
import UsersList from '../components/UsersList';
import axios from 'axios';
import swal from 'sweetalert';

import Organizer from '../components/hoc/Hoc';

function Excecao() {

  // @ts-expect-error TS6133
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  // @ts-expect-error TS6133
  const [resultados, setResultados] = useState({ response: '' });
  const [form, setForm] = useState({ nameC: '', nameL: '', regC: '', regL: '', obs: '' });
  const [loading, setLoading] = useState(false);
  // @ts-expect-error TS6133
  const [able, setable] = useState(true);
  // @ts-expect-error TS6133
  const [aviso, setAviso] = useState(false)
  const [avisoType, setAvisoType] = useState('');
  const [inputTextarea, setInputTextarea] = useState('');
  const [inputCol, setInputCol] = useState('');
  const [inputColReg, setInputColReg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsReg, setSuggestionsReg] = useState([]);
  const [inputLib, setInputLib] = useState('');
  const [inputLibReg, setInputLibReg] = useState('');
  // @ts-expect-error TS6133
  const [search, setSearch] = useState('')
  const [autocomplete, setAutoComplete] = useState('')

  

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) setToken(true);
  }, []);

  // @ts-expect-error TS7006
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
    } 
    if (value.length > 0) {
      const results = await axios.get(`http://10.0.1.204:3307/api/v1/search?username=${value}`);
      setSuggestions(results.data[0]);
    } else {
      setSuggestions([]);
    }
  };

  // @ts-expect-error TS7006
  const handleInputChangeReg = async (event) => {
    setSuggestions([])
    const inputType = event.target.name
    const value = event.target.value;
    if(inputType == 'liberadorReg'){
      setAutoComplete('liberadorReg')
      setInputLibReg(value);
      setForm({ ...form, regL: value })
    } else if(inputType == 'liberadoReg'){
      setAutoComplete('liberadoReg')
      setInputColReg(value);
      setForm({ ...form, regC: value })
    }
    if (value.length > 0) {
      const results = await axios.get(`http://10.0.1.204:3307/api/v1/search?registration=${value}`);
      setSuggestionsReg(results.data[0]);
    } else {
      setSuggestionsReg([]);
    }
  }

  // @ts-expect-error TS7006
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
    } else if (name === 'liberador') {
      setSearch(selectedValue)
      setInputLib(selectedValue)
      setInputLibReg(id)
      setForm({ ...form, nameL: selectedValue, regL: id })
    } else if (name === 'liberadorReg') {
      setSearch(selectedValue)
      setInputLib(id)
      setInputLibReg(selectedValue)
      setForm({ ...form, nameL:id , regL: selectedValue })
    } else if (name === 'liberadoReg') {
      setSearch(selectedValue)
      setInputCol(id)
      setInputColReg(selectedValue)
      setForm({ ...form, nameC:id , regL: selectedValue })
    }
    setSuggestions([])
  }


  const validateForm = () => {
    setAvisoType('');
    const { nameC, nameL, regC, regL, obs } = form;
    if (!nameC || !nameL || !regC || !regL || !obs) {
      return false;
    }
    if (nameC === nameL) {
      return false;
    }
    if (regL === regC) {      
      return false;
    }
    return true;
  };


  // @ts-expect-error TS7006
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  // @ts-expect-error TS7006
  const handleChange = (e) => {
    const text = e.target.value
    setInputTextarea(text)
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
      swal({
        title: "Tem certeza?",
        text: "O colaborador será liberado para entrar ou sair do ambiente da DELP e um registro dessa liberação será salvo.",
        icon: "warning",
        buttons: ["Cancelar", "Sim"],
      })
      .then(async (willDelete) => {
        if (willDelete) {
          swal("Liberação realizada com sucesso", {
            icon: "success",
          });
          try {
            const response = await axios.post(`http://10.0.1.204:3307/api/v1/exception`, formData);
    
            if (response.status === 200) {
              
            } else {
            }
          } catch (error) {
            swal({
              title: "Algo deu errado!",
              text: "Essa pessoa não pode autorizar liberar nenhum colaborador",
              icon: "warning",
              dangerMode: true,
            })
          }
          setInputCol('')
          setInputColReg('')
          setInputLib('')
          setInputLibReg('')
          setInputTextarea('')
        } else {
          swal("A operação foi cancelada",{
            icon:"warning",
          });
        }
      });
      

      setLoading(false);
    } else {
      swal({
        title: "Atenção!",
        text: "Formulário preenchido de forma incorreta",
        icon: "warning",
        dangerMode: true,
      })
    }
  };


  return (
    <div className='flex-col p-5 w-full sm:flex-row sm:p-10  overflow-y-visible h-screen mt-10 justify-center ' >
      <h3 className='text-3xl my-2 font-medium'>Liberação para passagem na catraca:</h3>
      {token1 ? (
        <div className='bg-background p-10 flex flex-col w-12/12 m-auto mt-5 sm:w-4/6'>
          <div className='mb-5'>
            <h5 className=''>Preencha todos os campos para poder liberar o colaborar por um período de <span>5 MINUTOS</span>  <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          </div>
          <form className='flex flex-col ' onClick={handleSubmit}>
            <div>
              <div className='flex flex-col w-full my-1 sm:my-5 sm:flex-row'>
                <div className='flex flex-row justify-between w-full'>
                <div className='sm:w-3/6 sm:pr-5 w-full mr-2'>
                  <p className='text-xs sm:text-base'>Colaborador a ser liberado:</p>
                  <input type="text"
                    value={inputCol}
                    onChange={handleInputChange}
                    className='border border-navbar border-opacity-50 border-solid bg-background '
                    name='liberado'
                  />
                  <div className='flex flex-col  bg-background  border-x border-solid border-b absolute max-h-96'>
                    <div className='overflow-y-auto'>
                    {autocomplete == 'liberado' ? (
                      suggestions.map((suggestion) => (
                        // @ts-expect-error TS2339
                        <a key={suggestion.registration}
                          className='flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer'
                          onClick={handleSearchSelect}
                          // @ts-expect-error TS2322
                          name='liberado'
                          // @ts-expect-error TS2339
                          id={suggestion.registration}
                        >
                          {/*
                           // @ts-expect-error TS2339 */}
                          {suggestion.name}
                        </a>
                      ))
                    ) : ( 
                      ""
                    )}
                    </div>
                  </div>
                </div>
                <div className='sm:w-2/6 w-full '>
                  <p className='text-xs sm:text-base'>Matrícula:</p>
                  <input type="number"
                    value={inputColReg}
                    onChange={handleInputChangeReg}
                    name='liberadoReg'
                    className='border border-navbar border-opacity-50 border-solid bg-background' />
                    <div className='flex flex-col  bg-background  border-x border-solid border-b  overflow-y-scroll max-h-96 absolute'>
                    <div className='h-full w-full'>
                    {autocomplete == 'liberadoReg' ? (
                      suggestionsReg.map((suggestion) => (
                        // @ts-expect-error TS2339
                        <a key={suggestion.registration}
                          className='flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer'
                          onClick={handleSearchSelect}
                          // @ts-expect-error TS2322
                          name='liberadoReg'
                          // @ts-expect-error TS2339
                          id={suggestion.name}
                        >
                          {/*
                           // @ts-expect-error TS2339 */}
                          {suggestion.registration}
                        </a>
                      ))
                    ) : ( 
                      ""
                    )}
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className='flex flex-col w-full sm:my-5 sm:flex-row '>
                <div className='flex flex-row w-full justify-between'>
                <div className='sm:w-3/6 sm:pr-5 w-full mr-2'>
                  <p className='text-xs sm:text-base'>Liberador:</p>
                  <input type="text"
                    value={inputLib}
                    onChange={handleInputChange}
                    className='border border-navbar border-opacity-50 border-solid bg-background'
                    name='liberador' />
                  <div className='flex flex-col absolute bg-background  border-x border-solid border-b max-h-96 '>
                    <div className='overflow-y-auto'>
                    {autocomplete == 'liberador' ? (
                      suggestions.filter(suggestion => suggestion.isLeader === 1)
                      .map((suggestion) => (
                        // @ts-expect-error TS2339
                        <a key={suggestion.registration}
                          className='flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer'
                          onClick={handleSearchSelect}
                          // @ts-expect-error TS2322
                          name='liberador'
                          // @ts-expect-error TS2339
                          id={suggestion.registration}
                        >
                          {/*
                           // @ts-expect-error TS2339 */}
                          {suggestion.name}
                        </a>
                      ))
                    ) : null}
                  </div>
                    </div>
                </div>
                <div className='sm:w-2/6 w-full'>
                  <p className='text-xs sm:text-base'>Matrícula do liberador:</p>
                  <input type="number"
                    value={inputLibReg}
                    onChange={handleInputChangeReg}
                    name='liberadorReg'
                    className='border border-navbar border-opacity-50 border-solid bg-background max-h-96 ' />
                    <div className='overflow-y-auto absolute max-h-96 border-x border-solid border-b'>
                    {autocomplete == 'liberadorReg' ? (
                      suggestionsReg.filter(suggestion => suggestion.isLeader === 1)
                      .map((suggestion) => (
                        // @ts-expect-error TS2552
                        <a key={suggestion.registration}
                          className='flex items-center h-10  px-5 bg-background text-navbar hover:bg-section cursor-pointer '
                          onClick={handleSearchSelect}
                          // @ts-expect-error TS2322
                          name='liberadorReg'
                          // @ts-expect-error TS2552
                          id={suggestion.name}
                        >
                          {/*
                           // @ts-expect-error TS2339 */}
                          {suggestion.registration}
                        </a>
                      ))
                    ) : ( 
                      ""
                    )}
                    </div>
                </div>
                </div>
              </div>
              <div className='mb-1 sm:mb-5 mt-5'>
                <p className='text-xs sm:text-base'>Observação:</p>
                <textarea
                  name="observacao"
                  id=""
                  value={inputTextarea}
                  // @ts-expect-error TS2322
                  cols="30"
                  // @ts-expect-error TS2322
                  rows="10"
                  className='border border-navbar border-opacity-50 border-solid w-full p-3'
                  onChange={handleChange}
                >
                </textarea>
              </div>
              <div className='flex flex-row w-full justify-center'>
                <button className='bg-successBtn hover:bg-[#123] font-medium w-3/5' onClick={handleUpdate}>
                  { loading ? ( 
                    <img src="../public/Spinner.svg" alt="" className='h-10 m-auto'/>
                  ) :'Liberar' }
                </button>
              </div>
              <div className='flex justify-center h-14 items-center'>
                <p>{avisoType === 'branco' ? "O formulário não pode estar em branco." : ""}</p>
                <p>{avisoType === 'igual' ? "O Colaborador e Liberador não podem ser iguais." : ""}</p>
                <p>{avisoType === 'sucesso' ? "" : ""}</p>
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
        // @ts-expect-error TS2339
        resultados.ok === 0 ? (
          <div className='flex flex-row bg-background p-10 sm:flex-col'>
            {/*
             // @ts-expect-error TS2339 */}
            <UsersList NameList={resultados.nome} ListName={`Colaboradores Alterados `} messageContent={' teste.'} />
          </div>
        ) : null
      )}
    </div>
  );
}

export default Organizer(Excecao)
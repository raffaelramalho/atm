// @ts-expect-error TS6133
import React, { useState, useEffect, useCallback } from 'react';
import UsersList from '../components/UsersList';
import axios from 'axios';
import swal from 'sweetalert';
import config from '../config'
import Organizer from '../components/hoc/Hoc';


function Excecao() {

  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ response: '' });
  const [form, setForm] = useState({ nameC: '', nameL: '', regC: '', regL: '', obs: '' });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)
  const [avisoType, setAvisoType] = useState('');
  const [inputTextarea, setInputTextarea] = useState('');
  const [inputCol, setInputCol] = useState('');
  const [inputColReg, setInputColReg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsReg, setSuggestionsReg] = useState([]);
  const [inputLib, setInputLib] = useState('');
  const [inputLibReg, setInputLibReg] = useState('');
  const [search, setSearch] = useState('')
  const [autocomplete, setAutoComplete] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      const results = await axios.get(`${config.backendUrl}/api/v1/search?username=${value}`);
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
      const results = await axios.get(`${config.backendUrl}/api/v1/search?registration=${value}`);
      setSuggestionsReg(results.data[0]);
	console.log(results.data[0])
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
    const comment = event.target.comments
    console.log(name,id,selectedValue,comment)
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
    setTimeout(() => {
      setSuggestions([]);
    }, 100);
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



  const handleSubmit = (e) => {
    e.preventDefault();
  };
 
  const handleChange = (e) => {
    const text = e.target.value;
    setInputTextarea(text);
    setForm({ ...form, obs: text });
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
            const response = await axios.post(`${config.backendUrl}/api/v1/exception`, formData);
    
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

const handleKeyPress = (event) => {
    console.log(event.key)
    console.log(selectedIndex)
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
        break;

      case 'Enter':
        event.preventDefault();
        if (selectedIndex !== -1) {
          handleSearchSelect({
            target: {
              name: autocomplete, 
              id: suggestions[selectedIndex].registration,
              textContent: suggestions[selectedIndex].name,
              comments: suggestions[selectedIndex].comments,
            },
          });
        }
        break;
      default:
        setSelectedSuggestion(null);
        setSelectedIndex(-1);
    }
  };
  const handleKeyPressReg = (event) => {
    console.log(event.key)
    console.log(selectedIndex)
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestionsReg.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
        break;

      case 'Enter':
        event.preventDefault();
        if (selectedIndex !== -1) {
          handleSearchSelect({
            
            target: {
              name: autocomplete, 
              id: suggestionsReg[selectedIndex].name,
              textContent: suggestionsReg[selectedIndex].registration,
              comments: suggestions[selectedIndex].comments,
            },
          });
        }
        break;
      default:
        setSelectedSuggestion(null);
        setSelectedIndex(-1);
    }
  };
  
  const handleInputBlur = () => {
    setTimeout(() => {
      setSuggestions([]);
    }, 100);
  };
  const handleOutsideClick = (event) => {
    if (!event.target.closest('.suggestions-container')) {
      setTimeout(() => {
        setSuggestions([]);
      }, 100);
    }
  };
  
  return (
    <div className='flex-col p-5 w-full sm:flex-row sm:p-10  overflow-y-visible h-screen  justify-center ' onClick={handleOutsideClick}>
      <div className='h-full overflow-y-auto'>
        <div className='mb-5'>
            <h3 className='text-3xl my-2 font-medium'>Liberação para passagem na catraca:</h3>
            <h5 className=''>Preencha todos os campos para poder liberar o colaborar por um período de <span>5 MINUTOS</span>  <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          </div> 
      {token1 ? (
        <div className='bg-background p-10 flex flex-col w-12/12 m-auto mt-5 sm:w-5/6'>          
          <form className='flex flex-col ' onClick={handleSubmit} onKeyPress={handleKeyPress}>
            <div>
              <div className='flex flex-col w-full  sm:flex-row'>
                <div className='flex flex-row justify-between w-full'>
                <div className='sm:w-3/6 sm:pr-5 w-full mr-2'>
                  <p className='text-xs sm:text-base'>Colaborador:</p>
                  <input type="text"
                    value={inputCol}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className='border border-navbar border-opacity-50 border-solid bg-background '
                    name='liberado'
                    onBlur={handleInputBlur}
      
                  />
                  <div className={`flex flex-col  bg-background absolute border-x border-solid  max-h-96 `}>
                    <div className='overflow-y-auto suspended-list  max-w '>
                    {autocomplete === 'liberado' && suggestions.length > 0 ? (
                      suggestions.map((suggestion,index) => (           
                        <a key={index}
                        className={`flex items-center h-10 box-border w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer ${index === selectedIndex ? 'bg-section' : ''} `}
                          onClick={handleSearchSelect}
                          name='liberado'
                          id={suggestion.registration}
                        >
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
                    onKeyDown={handleKeyPressReg}
                    onBlur={handleInputBlur}
                    name='liberadoReg'
                    className='border border-navbar border-opacity-50 border-solid bg-background' />
                     <div className={`flex flex-col  bg-background absolute border-x border-solid  max-h-96 `}>
                    <div className=' suspended-list overflow-y-scroll '>
                    {autocomplete == 'liberadoReg' ? (
                      suggestionsReg.map((suggestion,index) => (
                        <a key={index}
                        className={`flex items-center h-10 box-border w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer ${index === selectedIndex ? 'bg-section' : ''} `}
                          onClick={handleSearchSelect}
                          name='liberadoReg'
                          id={suggestion.name}>
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
                    onKeyDown={handleKeyPress}
                    onChange={handleInputChange}
                    className='border border-navbar border-opacity-50 border-solid bg-background'
                    name='liberador'
                    onBlur={handleInputBlur} />
                                    <div className={`flex flex-col  bg-background absolute border-x border-solid  max-h-96 `}>
                          <div className='overflow-y-auto suspended-list'>
                            {autocomplete === 'liberador' ? (
                              suggestions.map((suggestion, index) => (
                                suggestion.comments === 'Autoriza Entrada' && (
                                  <a
                                    key={index}
                                    className={`flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer ${index === selectedIndex ? 'bg-section' : ''}`}
                                    onClick={handleSearchSelect}
                                    name='liberador'
                                    id={suggestion.registration}
                                  >
                                    {suggestion.name}
                                  </a>
                                )
                              ))
                            ) : null}
                          </div>
                    </div>
                </div>
                <div className='sm:w-2/6 w-full'>
                  <p className='text-xs sm:text-base'>Matrícula:</p>
                  <input type="number"
                    value={inputLibReg}
                    onChange={handleInputChangeReg}
                    onKeyDown={handleKeyPressReg}
                    name='liberadorReg'
                    onBlur={handleInputBlur}
                    className='border border-[#020202] border-opacity-50 border-solid bg-background max-h-96 ' />

                    <div className={`flex flex-col  bg-background absolute border-x border-solid  max-h-96 `}>
                    <div className='overflow-y-auto suspended-list'>
                    {autocomplete == 'liberadorReg' ? (
                      suggestionsReg.map((suggestion,index) => (  
                        suggestion.comments === 'Autoriza Entrada' && (              
                        <a  key={index}
                            className={`flex items-center h-10 w-full px-5 bg-background text-navbar hover:bg-section cursor-pointer ${index === selectedIndex ? 'bg-section' : ''}`}
                            onClick={handleSearchSelect}                         
                            name='liberadorReg'                          
                            id={suggestion.name}
                        >                   
                          {suggestion.registration}
                        </a>
                      )))
                    ) : ( 
                      ""
                    )}
                    </div>
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
                  onChange={handleChange}
                  className='border border-navbar border-opacity-50 border-solid w-full p-3'
                  rows="4"  
                ></textarea>
              </div>
              <div className='flex flex-row w-full justify-center'>
                <button className='bg-delpRed hover:bg-delpRedHover font-medium w-3/5' onClick={handleUpdate}>
                  { loading ? ( 
                    <img src="../public/Spinner.svg" alt="" className='h-10 m-auto'/>
                  ) :'Liberar' }
                </button>
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
    </div>
  );
}

export default Organizer(Excecao)
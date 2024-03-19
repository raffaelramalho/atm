// @ts-expect-error TS6133
import React, { useState, useEffect, useCallback } from 'react';
import UsersList from '../components/UsersList';
import axios from 'axios';
import swal from 'sweetalert';
import config from '../config'
import Organizer from '../components/hoc/Hoc';


function liberaGeral() {

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


  const validateForm = () => {
    setAvisoType('');
    const {  obs } = form;
    if (!obs) {
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
        obs: form.obs,
      };
      swal({
        title: "Tem certeza?",
        text: "A catraca será liberada e todos vão poder passar por ela, um registro dessa ação será salvo.",
        icon: "warning",
        buttons: ["Cancelar", "Sim"],
      })
      .then(async (willDelete) => {
        if (willDelete) {
          swal("Liberação realizada com sucesso", {
            icon: "success",
          });
          try {
            const response = await axios.post(`${config.backendUrl}/api/v1/liberaGeral`, formData);
    
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
          setInputTextarea('')
        } else {
          swal("Você cancelou a operação",{
            icon:"warning",
          });
        }
      });
      

      setLoading(false);
    } else {
      swal({
        title: "Atenção!",
        text: "O campo de observação não pode estar vazio",
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
    <div className='flex-col p-3 w-full sm:flex-row sm:p-10  overflow-y-visible h-screen  justify-center ' onClick={handleOutsideClick}>
      <div className='h-full overflow-y-auto'>
        <div className='mb-1'>
            <h3 className='text-3xl my-2 font-medium'>Liberação Geral em caso de Atraso de ônibus:</h3>
            <h5 className=''>Complete com detalhes o campo de observação e explique o motivo do ocorrido, as pessoas vão poder passar pela catraca  por  <span>UMA HORA</span> </h5>
          </div> 
      {token1 ? (
        <div className='p-5 flex flex-col w-12/12 m-auto mt-5 sm:w-5/6'>          
          <form className='flex flex-col ' onClick={handleSubmit} onKeyPress={handleKeyPress}>
            <div>
              <div className='flex flex-col w-full  sm:flex-row'>
                <div className='flex flex-row justify-between w-full'>
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
                  placeholder='Nome da rota do ônibus e motivo do atraso'
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

export default Organizer(liberaGeral)
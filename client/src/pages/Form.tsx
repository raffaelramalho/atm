import React, { useState, useEffect, useCallback } from 'react';
import UsersList from '../components/UsersList';
import axios from 'axios';
import swal from 'sweetalert';
import Organizer from '../components/hoc/hoc';

function Form() {
  const [turnos, setTurnos] = useState([]);
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ nome: [], id: [], invalido: [], naoAtualizado: [] });
  const [form, setForm] = useState({ nameList: [], newTurn: "" });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) setToken(true);
  }, []);
  useEffect(() => {
    fetch("http://10.0.1.204:3307/api/v1/getTurn/")
      .then((res) => res.json())
      .then((turnos) => setTurnos(turnos));
  }, []);




  //Formulários e afins
  const [formCount, setFormCount] = useState([0]);
  const [formValues, setFormValues] = useState({});
  const [index, setIndex] = useState(1);
  const [showModal, setShowModal] = useState(false);
  
  const handleChange = (e, id) => {
    const value = e.target.name === 'nameList' ? e.target.value.split('\n') : e.target.value;
    setFormValues(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [e.target.name]: value
      }
    }));
  };

  const validateForm = () => {
  for (let id in formValues) {
    if (!formValues[id].nameList || formValues[id].newTurn === 'default') {
      return false;
    }
  }
  return true;
};

const handleUpdate = async () => {
  if (validateForm()) {
    swal({
      title: "Você tem certeza?",
      text: "Depois de confirmado, os dados serão enviados para o servidor.",
      icon: "warning",
      buttons: ["Cancelar","Confirmar"],
      dangerMode: true,
    })
    .then(async (willSend) => {
      if (willSend) {
        try {
          const response = await axios.post('http://10.0.1.204:3307/api/v1/processar-dados', formValues);
          console.log(response.data);
          // Abre um modal com o conteúdo da resposta
          const data = await response.data;
          console.log(data)
          setResultados(data);
          setable(false);
          setInformations(data.invalidos);
          setShowModal(true)
        } catch (error) {
          console.error(error);
          swal("Erro", error.message, "error");
        }
      }
    });
  } else {
    swal("Formulário inválido", "Por favor, preencha corretamente todos os campos do formulário.", "error");
  }
};

const addForm = () => {
  if (formCount.length < 4) {
    setFormCount([...formCount, index]);
    setIndex(index + 1);
  } else {
    alert('Você atingiu o número máximo de formulários');
  }
};

const removeForm = (id) => {
  setFormCount(formCount.filter((item) => item !== id));
};

  return (
    <div className='flex-col p-5 w-full sm:flex-row p-1 sm:p-5 mt-10 h-screen'>
      <div className='flex justify-between mb-5'>
        <h3 className='text-xl sm:text-3xl my-2'>Alterar turno de colaboradores em massa:</h3>
        <button onClick={addForm} disabled={formCount.length >= 4} className='w-3/12 sm:w-1/12 p-0 sm:p-0 '>Novo Grupo</button>
      </div>
      <>
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-20 overflow-y-auto transition">
                        <div
                            className="fixed inset-0 w-full h-full bg-black opacity-40"
                            onClick={() => setShowModal(false)}
                        ></div>
                        <div className="flex items-center h-screen px-4 py-8 w-screen">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg h-4/6 bg-background flex flex-col">
                                <div className="mt-3 sm:flex flex h-full justify-center">
                                    
                                    <div className="mt-2 text-center sm:text-left h-full w-full">
                                        <h4 className="text-lg font-medium text-gray-800">
                                            Não foi possível alterar as seguintes matrículas
                                        </h4>
                                        <p className="mt-2 text-[15px] leading-relaxed text-gray-500 flex-row h-4/5 overflow-y-auto">
                                          <div>
                                            <p>Não foi possível atualizar:</p>
                                            <p className='flex flex-col'>{resultados.NaoAtualizado}</p>
                                          </div>
                                          <div>
                                          <p>Inexistente:</p>
                                          <p className='flex flex-col'>{resultados.Inexistente}</p>
                                          </div>
                                          <div>
                                            <p>Duplicados:</p>
                                            <p className='flex flex-col'>{resultados.Duplicadas}</p>
                                          </div>
                                        </p>
                                        <div className="items-center gap-2 mt-3 sm:flex">
                                           
                                            <button
                                                className="w-1/6 mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                            >
                                                ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
      </>
      {token1 ? (
        <div className='flex flex-col w-full items-center sm:flex-col sm:flex '>
          <div className='w-full overflow-y-auto overflow-x-hidden h-[600px] flex flex-col items-center justify-center sm:flex-row sm:flex sm:h-full'>
            {formCount.map((id) => (
              <form key={id} className='bg-background p-5  rounded w-full  sm:p-10 sm:m-3 sm:w-4/6 h-3/4'>
                <div className='w-full flex justify-between mb-3 items-center'>
                  <p className='font-semibold'> Grupo {id + 1}</p>
                  <button type="button" onClick={() => removeForm(id)} className='flex w-10 h-10 bg-none hover:bg-[#fff] text-[#000] justify-center rounded-full'>X</button>
                </div>
                <div className='flex'>
                  <textarea
                    rows={10}
                    name='nameList'
                    value={formValues[id]?.nameList || ''}
                    onChange={(e) => handleChange(e, id)}
                    placeholder='Lista de matriculas'
                    className='flex-row border-spacing-0 w-full p-5 border border-navbar border-opacity-50  mb-5'
                    disabled={false}
                    readOnly={false}
                  />
                </div>
                <select name='newTurn' className='h-14 border border-navbar border-opacity-50 px-5 w-full' onChange={(e) => handleChange(e, id)}>
                  <option value='default'>Selecione um turno</option>
                  {turnos.map((turno) => (
                    <option key={turno} value={turno}>{turno}</option>
                  ))}
                </select>
              </form>
            ))}
          </div>
          <div className=' w-full p-1 mt-3 sm:p-5 sm:mt-5 justify-center flex'>
            <button type='submit' className='flex justify-center items-center h-10 bg-successBtn hover:bg-[#123] w-2/5 rounded' onClick={handleUpdate}>
              {loading ? (
                <p className='flex flex-row'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-1 animate-spin">
                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                  </svg>
                </p>
              ) : (
                <p className='flex flex-row'> Atualizar
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-1">
                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                  </svg>
                </p>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className='grid-helper'>
          <p>Você não tem permissão para acessar isso D:</p>
        </div>
      )}

    </div>
  );
}

export default Organizer(Form);
// @ts-expect-error TS6133
import React, { useState, useEffect, useCallback } from 'react';
// @ts-expect-error TS6133
import UsersList from '../components/UsersList';
import axios from 'axios';
import Organizer from '../components/hoc/Hoc';
import swal from 'sweetalert2';
import './modal.css'
import config from '../config'


function Form() {
  const [turnos, setTurnos] = useState([]);
  // @ts-expect-error TS6133
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  // @ts-expect-error TS6133
  const [resultados, setResultados] = useState({ nome: [], id: [], invalido: [], naoAtualizado: [] });
  // @ts-expect-error TS6133
  const [form, setForm] = useState({ nameList: [], newTurn: "" });
  const [loading, setLoading] = useState(false);
  // @ts-expect-error TS6133
  const [able, setable] = useState(true);
  // @ts-expect-error TS6133
  const [aviso, setAviso] = useState(false)

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) setToken(true);
    
  }, []);
  useEffect(() => {
    fetch(`${config.backendUrl}/api/v1/getTurn/`)
      .then((res) => res.json())
      .then((turnos) => setTurnos(turnos));
  }, []);




  //Formulários e afins
  const [formCount, setFormCount] = useState([0]);
  const [formValues, setFormValues] = useState({});
  const [index, setIndex] = useState(1);
  // @ts-expect-error TS6133
  const [showModal, setShowModal] = useState(true);
  const [empty, setEmpty] = useState(true)

  // @ts-expect-error TS7006
  const handleChange = (e, id) => {
    setEmpty(false);
    const value = e.target.name === 'nameList' ? e.target.value.split('\n') : e.target.value;
    setFormValues(prevState => ({
      ...prevState,
      [id]: {
        //@ts-ignore
        ...prevState[id],
        [e.target.name]: value
      }
    }));
  };
  

  const validateForm = () => {
  for (let id in formValues) {
    // @ts-expect-error TS7053
    if (!formValues[id] || formValues[id].nameList === ' ' || formValues[id].newTurn === 'default') {
      return false;
    }
  }
  return true;
};

const handleUpdate = async () => {
  setLoading(true);

  if (validateForm() && !empty) {
    try {
      // @ts-expect-error TS18046
      const filledForms = Object.values(formValues).filter(form => form.nameList && form.newTurn !== 'default');
      // Use SweetAlert2 para confirmar a atualização
      const { value: confirmUpdate } = await swal.fire({
        title: 'Confirmação',
        text: 'Deseja mesmo atualizar os turnos das matrículas selecionadas?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
      });

      if (confirmUpdate) {
        const response = await axios.post(`${config.backendUrl}/api/v1/processar-dados`, filledForms);
        const data = response.data;
        openModal(data);
        setResultados(data);
        setable(false);
        setInformations(data.invalidos);
        setShowModal(true);
        setFormValues({ nameList: [] });
      } else {
        // Ação cancelada pelo usuário
        swal.fire('Ação Cancelada', 'A atualização foi cancelada pelo usuário.', 'info');
      }
    } catch (error) {
      // @ts-expect-error TS18046
      swal.fire('Erro', error.message, 'error');
      console.error(error);
    }
  } else {
    swal.fire('Formulário Inválido', 'Por favor, preencha corretamente todos os campos do formulário.', 'error');
  }

  setLoading(false);
};
// @ts-expect-error TS7006
const openModal = (data) => {
  const notExist = data.Inexistente.filter(Boolean)
  const notUpdated = data.NaoAtualizado
  const modalContent = `
  ${notExist.length == 0 && notUpdated.length <= 1  ?  `<p>Todos os colaboradores foram alterados com sucesso!</p> <br>` : ''}
  ${notExist.length > 0 || notUpdated.length > 1  ?  `<p>Colaboradores não alterados pelos motivos:</p> <br>` : ''}
  ${notExist.length > 0 ? `<p><strong>Inexistente:</strong></p><p>${notExist.join(', ').replace(/,+\s*$/, "")}</p><br>` : ''}
  ${notUpdated.length > 0 ? `<p><strong>Não Atualizado:</strong></p><p>${notUpdated.join(', ').replace(/,+\s*$/, "")}</p>` : ''}

`;
  swal.fire({
    title: 'Atenção!',
    html: modalContent,
    icon: 'info',
    customClass: {
      container: 'my-custom-modal-container', 
      popup: 'my-custom-modal-popup', 
    },
    showCloseButton: true,
    showCancelButton: false,
    confirmButtonText: 'Fechar',
  });
};

const addForm = () => {
  if (formCount.length < 4) {
    setFormCount([...formCount, index]);
    setIndex(index + 1);
  } else {
    alert('Você atingiu o número máximo de formulários');
  }
};

// @ts-expect-error TS7006
const removeForm = (id) => {
  setFormCount(formCount.filter((item) => item !== id));
};
// 
  return (
    <div className='flex-col  w-full sm:flex-row p-1 sm:p-5  h-screen'>
       
      <div className='h-full overflow-y-auto '> 
      <h3 className='text-xl sm:text-3xl my-2 ml-5 font-medium'>Alterar turnos em massa:</h3>
      <div className='flex flex-col mb-5 bg-background p-1 rounded-lg shadow-sm'>
        <div className='flex justify-between w-full'>
            <p className='p-3 sm:text-base text-xs '>As mastriculas devem ser colocadas de maneira idêntica as do histograma, sem necessidade de "," ou "."</p>
            <button onClick={addForm} disabled={formCount.length >= 4} className='w-1/12 sm:w-1/12 p-0 sm:p-0 bg-delpRed hover:bg-delpRedHover my-1 mr-3 rounded-lg'>+</button>
        </div>
      </div>
      {token1 ? (
        <div className='flex flex-col w-full items-center sm:flex-col sm:flex '>
          <div className='w-full overflow-y-auto overflow-x-hidden h-[600px] flex flex-col items-center justify-center sm:flex-row sm:flex sm:h-full'>
            {formCount.map((id) => (
              <form key={id} className='bg-background p-2  rounded w-full  sm:p-5 sm:m-3 sm:w-4/6 h-3/4'>
                <div className='w-full flex justify-between mb-3 items-center'>
                  <p className='font-semibold'> Grupo {id + 1}</p>
                  <button type="button" onClick={() => removeForm(id)} className='flex w-10 h-10 bg-none hover:bg-[#fff] text-[#000] justify-center rounded-full'>X</button>
                </div>
                <div className='flex'>
                  <textarea
                    rows={10}
                    name='nameList'
                    // @ts-expect-error TS7053
                    value={(formValues[id]?.nameList || []).join('\n') || ''}
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
          <div className=' w-full p-1 sm:p-5 justify-center flex'>
            <button type='submit' className='flex justify-center items-center h-10 bg-delpRed hover:bg-delpRedHover w-2/5 rounded' onClick={handleUpdate}>
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
    </div>
  );
}

export default Organizer(Form);
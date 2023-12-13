// @ts-expect-error TS6133
import React, { useState, useEffect, useCallback } from 'react';
// @ts-expect-error TS6192
import { FaFileDownload, FaQuestion } from "react-icons/fa";
import UsersList from '../components/UsersList';
import swal from 'sweetalert';
import Organizer from '../components/hoc/Hoc';
 function Ferias() {

  // @ts-expect-error TS6133
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ nome: [], id: [], invalido: [], naoAtualizado: [], feriasInicio: '', feriasFim: '' });
  const [form, setForm] = useState({ nameList: [], dataFim: '' });
  const [loading, setLoading] = useState(false);
  // @ts-expect-error TS6133
  const [able, setable] = useState(true);
  // @ts-expect-error TS6133
  const [aviso, setAviso] = useState(false)
  const [avisoType, setAvisoType] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) setToken(true);
  }, []);

  // @ts-expect-error TS7006
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    if (name === 'nameList') {
      const nameListArray = value.split('\n');
      setForm({ ...form, [name]: nameListArray });
    } else {
      setForm({ ...form, [name]: value });
    }
    if (name === 'dataFim') {
      setForm({ ...form, dataFim: value })
    }
  };

  const validateForm = () => {
    const { nameList, dataFim } = form;
    console.log(dataFim)
    console.log(nameList)
    if (nameList.length === 0) {
      setAvisoType('branco');
      return false;
    }
    if (dataFim.length === 0) {
      setAvisoType('branco');
      return false;
    }
   
    // @ts-expect-error TS6133
    const fim = new Date(dataFim);

    
    setAvisoType('');
    return true;
  };

  // @ts-expect-error TS7006
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUpdate = async () => {
    const {dataFim } = form
    if (validateForm()) {
      setLoading(true);
      swal({
        title: "Tem certeza?",
        text: `Uma vez lançado o bloqueio, os colaboradores vão ficar impossibilitados de acessar a DELP até a data de ${dataFim}`,
        icon: "warning",
        buttons: ["Cancelar", "Sim"],
      })
      .then(async (willDelete) => {
        if (willDelete) {
          swal("Bloqueio de férias registrado com sucesso! :D", {
            icon: "success",
          });

          if (form.nameList.length > 0) {
            const {  dataFim } = form;
            const nameListArray = [...new Set(form.nameList.toString().split(',').map((name) => name.trim()))];
            try {
              const response = await fetch('http://10.0.1.204:3307/api/v1/processar-ferias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nameList: nameListArray,  dataFim: dataFim }),
              });
              if (response.ok) {
                const data = await response.json();
                console.log(data)
                setResultados(data);
                setable(false);
                setInformations(data.invalidos);
              } else {
                throw new Error(`Erro na requisição: ${response.statusText}`);
              }
            } catch (error) {
              console.error('Erro ao enviar dados para o backend', error);
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
            setable(true);
            setAviso(true)
          }
          
        } else {
          swal("A operação foi cancelada");
          setLoading(false);
          setable(true);
          setForm(({ nameList: [], dataFim: '' }))
        }
      });
      

    }
  };


  return (
    
    <div className='flex-col p-5 w-full sm:flex-row sm:p-10 overflow-y-visible mt-10 h-screen'>
      <h3 className='text-3xl my-2'>Bloqueio de férias em massa na catraca:</h3>
      {token1 ? (
        <div className='bg-background p-10'>
          <div className='mb-5'>
            <h5 className=''>Utilize apenas as teclas (Shift + Enter) para separar as informações nas linhas, não é necessário "," nem "." ao final de cada nome. <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          </div>
          <form className='flex flex-col ' onClick={handleSubmit}>
            <div className='flex flex-row h-full'>
              <div className='w-2/4'>
                <textarea
                  rows={10}
                  name='nameList'
                  value={form.nameList.join('\n')}
                  onChange={handleChange}
                  placeholder='Lista de Matriculas'
                  className='flex-row border-spacing-0 w-full p-5 border border-navbar border-opacity-50'
                  disabled={false}
                  readOnly={false}
                />
              </div>
              <div className='flex flex-col justify-between w-2/4 px-5 pb-1.5'>
                <div>
                  <p className='font-medium'>Data final da liberação:</p>
                  <input type="date" name='dataFim' className='border border-solid' onChange={handleChange} />
                </div>
                <div>
                  <p className='text-3xl font-bold text-successBtn'>ATENÇÃO!</p>
                  <p>Esse formulário deve ser preenchido somente no último dia antes da folga do colaborador.</p>
                </div>
                <div className='flex-col justify-between text-navbar text-[#FFFF]'>
              <div className='my-5'>
                <button type='submit' className='flex justify-center items-center bg-successBtn hover:bg-[#123]' onClick={handleUpdate}>
                  {loading ? "Atualizando..." : "Lançar bloqueio de féria"}
                </button>
              </div>
            </div>
              </div>
            </div>
            <div className='flex w-full h-8 items-center'>
              <p>{avisoType === 'branco' ? "O formulário não pode estar em branco." : ""}</p>
              <p>{avisoType === 'datas' ? "As datas não podem estar em branco." : ""}</p>
              <p>{avisoType === 'invalido' ? "A data de término não pode ser menor que a data de início." : ""}</p>
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
        resultados.nome.length > 0 || resultados.invalido.length > 0 || resultados.naoAtualizado.length > 0 ? (
          <div className='flex flex-row bg-background px-10 sm:flex-col'>
            <UsersList NameList={resultados.nome} ListName={`Colaboradores Alterados `} messageContent={' foi alterado com sucesso.'} />
            <UsersList NameList={resultados.invalido} ListName='Colaboradores não encontrados' messageContent={' não existe.'} />
            <UsersList NameList={resultados.naoAtualizado} ListName='Colaboradores não atualizados' messageContent={' não pode ser atualizado.'} />
          </div>
        ) : null
      )}
    </div>
  );
}

export default Organizer(Ferias)
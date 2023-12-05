import React, { useState, useEffect, useCallback } from 'react';
import { FaFileDownload,FaQuestion  } from "react-icons/fa";
import UsersList from '../components/UsersList';

export default function Ferias() {

  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ nome: [], id: [], invalido: [], naoAtualizado:[], feriasInicio: '', feriasFim: '' });
  const [form, setForm] = useState({ nameList: [],dataInicio: '', dataFim: '' });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)
  const [avisoType, setAvisoType] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) setToken(true);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nameList') {
      const nameListArray = value.split('\n');
      setForm({ ...form, [name]: nameListArray });
    } else {
      setForm({ ...form, [name]: value });
    }
    if(name === 'dataInicio'){
      setForm({...form,  dataInicio: value })
    }
    if(name === 'dataFim'){
      setForm({...form,  dataFim: value })
    }
  };

const validateForm = () => {

  const { nameList, dataInicio, dataFim } = form;
 
  if (nameList.length === 0 ) {
    setAvisoType('branco');
    return false;
  }
  if ( !dataInicio || !dataFim) {
    setAvisoType('datas');
    return false;
  }
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  if (fim < inicio) {
    setAvisoType('invalido');
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
    if(form.nameList.length > 0){
      const { dataInicio, dataFim } = form;
      const nameListArray = [...new Set(form.nameList.toString().split(',').map((name) => name.trim()))]; 
      try {
        const response = await fetch('http://10.0.1.204:3307/api/v1/processar-ferias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameList: nameListArray, dataInicio: dataInicio, dataFim:dataFim }),
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
      <h3 className='text-3xl my-2'>Bloqueio de férias em massa na catraca:</h3>
      {token1 ? (
        <div className='bg-background p-10'>
          <div className='mb-5'>
          <h5 className=''>Utilize apenas as teclas (Shift + Enter) para separar os nomes nas linhas, não é necessário "," nem "." ao final de cada nome. <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          </div>
          <form className='flex flex-col ' onClick={handleSubmit}>
          <div className='flex flex-row h-full'>
            <div className='w-2/4'>
              <textarea
                  rows={10}
                  name='nameList'
                  value={form.nameList.join('\n')}
                  onChange={handleChange}
                  placeholder='Lista de Nomes'
                  className='flex-row border-spacing-0 w-full p-5 border border-navbar border-opacity-50'
                  disabled={false}
                  readOnly={false}
                />
            </div>
              <div className='flex flex-col justify-between w-2/4 px-5 pb-1.5'>
                <div>
                  <p>Data de inicio:</p>
                  <input type="date" name='dataInicio' className='border border-solid' onChange={handleChange}/>
                </div>
                <div>
                  <p>Data de termino:</p>
                  <input type="date" name='dataFim' className='border border-solid' onChange={handleChange} />
                </div>
              </div>
          </div>
          <div className='flex w-full h-16 items-center'>
                <p>{avisoType === 'branco' ? "O formulário não pode estar em branco." : ""}</p>
                <p>{avisoType === 'datas' ? "As datas não podem estar em branco." : ""}</p>
                <p>{avisoType === 'invalido' ? "A data de término não pode ser menor que a data de início." : ""}</p>
          </div>
            <div className='flex-col justify-between text-navbar text-[#FFFF]'>
              <div className='my-5'>
                  <button type='submit' className='flex justify-center items-center bg-successBtn hover:bg-[#123]' onClick={handleUpdate}>
                        {loading ? "Atualizando..." : "Lançar bloqueio de féria"}
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
          <img src="../public/Spinner.svg" alt="" />
        </div>
      ) : (
        resultados.nome.length > 0 || resultados.invalido.length > 0 || resultados.naoAtualizado.length > 0 ? (
          <div className='flex flex-row bg-background p-10 sm:flex-col'>
            <UsersList NameList={resultados.nome} ListName={`Colaboradores Alterados `} messageContent={' foi alterado com sucesso.'}/>
            <UsersList NameList={resultados.invalido} ListName='Colaboradores não encontrados' messageContent={' não existe.'}/>
            <UsersList NameList={resultados.naoAtualizado} ListName='Colaboradores não atualizados' messageContent={' não pode ser atualizado.'}/>
          </div>
        ) : null
      )}
    </div>
  );
}


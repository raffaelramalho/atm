import React, { useState, useEffect, useCallback } from 'react';
import { FaFileDownload,FaQuestion  } from "react-icons/fa";
import UsersList from '../components/UsersList';
import { useDropzone } from 'react-dropzone';
import * as XLSX from "xlsx";

export default function Form() {
  const [turnos, setTurnos] = useState([]);
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ nome: [], id: [], invalido: [], naoAtualizado:[] });
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

  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nameList') {
      const nameListArray = value.split('\n');
      setForm({ ...form, [name]: nameListArray });
    } else {
      setForm({ ...form, [name]: value });
    }
    
  };

  const exportarParaTXT = async () => {
    const infoNome = informations;
    infoNome.unshift("Nomes não encontrados:");
    const texto = infoNome.join('\n');
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const agora = new Date();
    const horario = agora.toISOString().replace(/:/g, '-');
    link.download = `Log-${horario}.txt`;
    link.click();
  };

const validateForm = () => {
  const { nameList, newTurn } = form;
  if (nameList.length === 0 ) {

    setAviso(true)
    return false;
  }
  
  setAviso(false)
  return true;
};

const handleSubmit = (e) => {
  e.preventDefault();
};

  const handleUpdateTurnos = async () => {
    if (validateForm()) {
      setLoading(true);
    if(form.nameList.length > 0){
      const nameListArray = [...new Set(form.nameList.toString().split(',').map((name) => name.trim()))]; 
      try {
        const response = await fetch('http://10.0.1.204:3307/api/v1/processar-dados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameList: nameListArray, newTurn: form.newTurn }),
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
  // Define um tempo de espera de 10 segundos
  const timer = setTimeout(() => setDelay(200000), 0);
  return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado
}, []);

useEffect(() => {
  // Define um tempo mínimo de loading
  const timer = setTimeout(() => setLoading(false), delay);
  return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado
}, [delay]); // Adiciona delay como uma dependência
 

const onDrop = useCallback((acceptedFiles: any[]) => {
 console.log(acceptedFiles)
}, []);

const {getRootProps, getInputProps} = useDropzone({onDrop});


// Renderização do componente
  return (
    <div className='flex-col p-5 w-full sm:flex-row sm:p-10 h-screen overflow-auto'>
    <h3 className=' text-3xl my-2'>Alterar turno de colaboradores em massa:</h3>
      {token1 ? (
        <div className='bg-background p-10'>
          <h5 className='mb-5'>Utilize apenas as teclas (Shift + Enter) para separar os nomes nas linhas, não é necessário "," nem "." ao final de cada nome. <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
          <form className='' onClick={handleSubmit}>
            <label className=''>
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
            </label>
            <p>{aviso ? "O formulário não pode estar em branco." :""}</p>
            <select name='newTurn' className='h-14 border border-navbar border-opacity-50 px-5 w-full' onChange={handleChange}>
                <option value='default'>Selecione um turno</option>
              {turnos.map((turno) => (
                <option key={turno} value={turno}>{turno}</option>
              ))}
            </select>
            <div className='flex-col justify-between text-navbar  text-[#FFFF]'>
              <div className='my-10'>
                  <button type='submit' className='flex justify-center items-center bg-successBtn hover:bg-[#123]' onClick={handleUpdateTurnos}>
                        {loading ? "Atualizando..." : "Atualizar Turnos"}
                  </button>
              </div>
            
              <div {...getRootProps()} className='flex justify-center items-center h-10 bg-successBtn hover:bg-[#123]'>
                  <input {...getInputProps()} />
                  <p className='text-[#FFFF]'>Enviar Planilha</p>
              </div>
              <div className='my-10'>
                  <button onClick={exportarParaTXT} disabled={able} className={able ? `flex justify-center items-center opacity-50 bg-successBtn hover:bg-successBtn` : `flex justify-center items-center opacity-100 bg-successBtn hover:bg-[#123]` }>
                    Baixar Nomes não encontrados <FaFileDownload className="mx-1 h-4" />
                  </button>
              </div>
            </div>
          </form>
          
        </div>
      ) : (
        <div className='grid-helper'>
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

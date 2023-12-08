import React, { useState, useEffect, useCallback } from 'react';
import { FaFileDownload, FaQuestion } from "react-icons/fa";
import UsersList from '../components/UsersList';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';
import swal from 'sweetalert';

export default function Form() {
  const [turnos, setTurnos] = useState([]);
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ nome: [], id: [], invalido: [], naoAtualizado: [] });
  const [form, setForm] = useState({ nameList: [], newTurn: "" });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)
  const [sheetData, setSheetData] = useState({matricula:[], nome: [], turno: []});


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


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nameList') {
      const nameListArray = value.split('\n');
      setForm({ ...form, [name]: nameListArray });
    } else {
      setForm({ ...form, [name]: value });
    }

  };

  const validateForm = () => {
    const { nameList, newTurn } = form;
    if (nameList.length === 0) {

      setAviso(true)
      return false;
    }
    if(newTurn === 'default'){
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
      if (form.nameList.length > 0) {
        swal({
          title: "Tem certeza?",
          text: "O turno dos colaboradores será alterado as 23:59, ao domingo",
          icon: "warning",
          buttons: ["Cancelar", "Sim"],
        })
        .then(async (willDelete) => {
          if (willDelete) {
            swal("Solicitação de troca de turno enviada com sucesso", {
              icon: "success",
            });
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
          } else {
            swal("Operação cancelada");
            setLoading(false);
          }
        });
        
      } else {
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


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true)
    const file = acceptedFiles[0];
    const reader = new FileReader();
    const fileData = await new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
    const data = new Uint8Array(fileData as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets["GERAL"];
    swal({
      title: "Tem certeza?",
      text: "Os colaboradores serão alterados automaticamente de acordo com o turno na aba STATUS da planilha",
      icon: "warning",
      buttons: ["Cancelar", "Sim"],
    })
    .then(async (willDelete) => {
      if (willDelete) {
        swal("Colaboradores alterados com sucesso", {
          icon: "success",
        });
        if (worksheet) {
          let jsonData: any[]
          jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          jsonData.shift();
          jsonData = jsonData.map(row => [row[0], row[1], row[7], row[25]]);
          const filteredData = jsonData.filter(row => row[2] !== 'EXTERNO' && row[3] !== 'NA' && row[3] !== 'OK' && row[2] !== 'AFASTADO')
          const finalData = filteredData.filter(row => !row.includes(undefined))
          console.log(finalData)
          const elementosZero = finalData.map(subArray => subArray[0]);
          const elementosUm = finalData.map(subArray => subArray[1]);
          const elementosDois = finalData.map(subArray => subArray[3]);
          
          await dataToBackend(elementosZero, elementosUm, elementosDois)
        } else {
          alert('Aba "GERAL" não encontrada');
        }
      } else {
        swal("Operação cancelada");
        setLoading(false)
      }
    });
    
  }, []);

  const dataToBackend = async (LinhaZero, LinhaUm, LinhaDois) => {
    setLoading(true);
    try {
      const response = await axios.post('http://10.0.1.204:3307/api/v1/processar-dados-planilha', {
        LinhaZero,
        LinhaUm,
        LinhaDois
      })
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setResultados(data);
        setable(false);
        setInformations(data.invalidos);
      } else {
        console.log('Deu erro na resposta');
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend', error);
      setLoading(false)
      setAviso(true)
    } finally {
      setLoading(false);
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop });


  // Renderização do componente
  return (
    <div className='flex-col p-5 w-full sm:flex-row sm:p-10 mt-10 overflow-y-visible h-screen'>
      <h3 className=' text-3xl my-2'>Alterar turno de colaboradores em massa:</h3>
      {token1 ? (
        <div className='bg-background p-10 '>
          <h5 className='mb-5'>Utilize apenas as teclas (Shift + Enter) para separar as informações nas linhas, não é necessário "," nem "." ao final de cada nome. <a href="https://absorbing-quartz-1d9.notion.site/Documenta-o-ATM-bc267ad520654c6db8337bb28164e8b8" className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">Ajuda</a></h5>
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
            <p>{aviso ? "O formulário não pode estar em branco." : ""}</p>
            <select name='newTurn' className='h-14 border border-navbar border-opacity-50 px-5 w-full' onChange={handleChange}>
              <option value='default'>Selecione um turno</option>
              {turnos.map((turno) => (
                <option key={turno} value={turno}>{turno}</option>
              ))}
            </select>
            <div className='flex-col justify-between text-navbar  text-[#FFFF]'>
              <div className='my-10 flex flex-row w-full justify-between'>
                <button type='submit' className='flex justify-center items-center h-10 bg-successBtn hover:bg-[#123] w-2/5 rounded' onClick={handleUpdateTurnos}>
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
                <div {...getRootProps()} className='text-background flex justify-center items-center h-10 bg-successBtn hover:bg-[#123] w-2/5 rounded'>
                <input {...getInputProps()} />
                {loading ? (
                    <p className='flex flex-row'> 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-1 animate-spin">
                        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                      </svg>
                    </p> 
                  ) : (
                  <p className='flex flex-row'> Atualizar 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-1">
                        <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z" clipRule="evenodd" />
                      </svg>
                  </p>  
                )}
              </div>
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
        <div className='loader w-full flex justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-1 animate-spin">
                        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                      </svg>
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

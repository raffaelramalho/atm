import { Link } from 'react-router-dom';
import { FaDesktop } from "react-icons/fa6";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Organizer from '../components/hoc/hoc'

function HomePage() {
  const [log, setLog] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [sortBy, setSortBy] = useState('dataLiberacao'); 
  const [inputSearch, setInputSearch] = useState('');

  const handleInputChange = async (event) => {
    
    const value = event.target.value;
    setInputSearch(value)
    
    if (value.length > 0) {
      const results = await axios.get(`http://10.0.1.204:3307/api/v1/searchGetter?username=${value}`)
      const formattedLog = results.data[0].map(entry => {
        let date = new Date(entry.dataLiberacao);
        let formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
        return { ...entry, dataLiberacao: formattedDate };
      });
      console.log(results.data[0])
      setLog(formattedLog);
    } else {
      setLog([]);
      await getLogs()
    }
  };

  const toggleExpand = (index) => {
    setExpandedEntry((prev) => (prev === index ? null : index));
  };

const getLogs = async() => {
  useEffect(() => {
    axios.get("http://10.0.1.204:3307/api/v1/getLog/")
      .then((res) => {
        const formattedLog = res.data[0].map(entry => {
          let date = new Date(entry.dataLiberacao);
          let formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
          return { ...entry, dataLiberacao: formattedDate };
        });

        setLog(formattedLog);
        console.log(formattedLog)
      })
      .catch((error) => console.error(`Erro: ${error}`));
  }, []);
}
getLogs()
  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 ">
      <div className='h-full w-full'>
        <h3 className='text-3xl my-2'>Histórico de liberações</h3>
        <div className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-500  ease-in-out rounded-md h-26`}>
            <div className='font-medium flex items-center'>
              Nome:
            </div>
            <div className='w-6/12'>
              <div
                className={`flex items-center border border-navbar ${isClicked ? 'border-opacity-100' : 'border-opacity-50'} border-solid h-10 rounded-3xl`}
                onClick={() => setIsClicked(!isClicked)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="text" 
                       className=' h-full rounded-3xl focus:border-none focus:outline-none focus:ring-0'
                       placeholder='Pesquisar nome' 
                       name='pesquisa'
                       value={inputSearch}
                       onChange={handleInputChange}
                 />
              </div>
            </div>
            <div className='font-medium flex items-center'>
              Ordenar:
              <select
                className='ml-2 px-2 py-1 border border-navbar border-opacity-50 rounded-md'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value='dataMaisRecente'>Data de Liberação ⥘</option>
                <option value='dataLiberacao'>Data de Liberação ⥙</option>
                <option value='nomeLiberado'>Nome</option>
              </select>
            </div>
          </div>
        <div className='flex flex-col overflow-y-auto h-5/6 mb-10 '>   
        {log.length > 0 ? (
            log.sort((a, b) => {
              if (sortBy === 'dataMaisRecente') {
                // Ordene por dataMaisRecente
                return new Date(b.dataLiberacao) - new Date(a.dataLiberacao);
              }else {
                // Lógica de ordenação existente
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
              }
                return 0;
            }).map((entry, index) => (
              <div
              key={index}
              className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-300  ease-in-out rounded-md hover:bg-[#DFF4FA] ${expandedEntry === index ? ' items-start mb-10' : ' items-center sm:h-20'}`}
              onClick={() => toggleExpand(index)}
            >
              <div className='flex flex-col w-full h-full transition'>
                <div className='flex flex-row  items-center mr-5 w-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 mr-5">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                  </svg>
                  <div className='flex flex-col w-2/6'>
                    <p className='font-medium'>Colaborador:</p>
                    <p> {entry.nomeLiberado} </p>
                  </div>
                  <div className='flex flex-col w-1/6'>
                    <p className='font-medium'>Matricula:</p>
                    <p> {entry.matriculaLiberado} </p>
                  </div>
                  <div className='flex flex-col items-center justify-center w-1/6' >
                  <p className='font-medium'>Horário</p>
                    <p>{entry.dataLiberacao} </p>
                  </div>
                  <div className='flex flex-col w-2/6 items-center'>
                    <p className='font-medium'>Requerente</p>
                        {entry.nomeRequerente}
                  </div>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='font-medium text-lg'>Nenhum resultado encontrado para essa pesquisa.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Organizer(HomePage);

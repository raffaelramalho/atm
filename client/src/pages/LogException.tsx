import { Link } from 'react-router-dom';
import { FaDesktop } from "react-icons/fa6";
import axios from 'axios';
import { useEffect, useState } from 'react';


function HomePage() {
  const [log, setLog] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);

  const toggleExpand = (index) => {
    setExpandedEntry((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    axios.get("http://10.0.1.204:3307/api/v1/getLog/")
      .then((res) => {
        const formattedLog = res.data[0].map(entry => {
          // Formate a data
          let date = new Date(entry.dataLiberacao);
          let formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  
          // Retorne um novo objeto com a data formatada
          return { ...entry, dataLiberacao: formattedDate };
        });
  
        setLog(formattedLog);
      })
      .catch((error) => console.error(`Erro: ${error}`));
  }, []);
  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 ">
      <div className='h-full w-full'>
        <h3 className='text-3xl my-2'>Histórico de liberações</h3>
        <div className='flex flex-col overflow-y-auto '>
          {log.map((entry, index) => (
            <div
              key={index}
              className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-300  ease-in-out hover:bg-[#DFF4FA] ${expandedEntry === index ? 'h-64 items-start' : 'h-246 items-center sm:h-20'}`}
              onClick={() => toggleExpand(index)}
            >
              <div className='flex flex-col w-full h-full'>
                <div className='flex flex-row  items-center mr-5 w-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 mr-5">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                  </svg>
                  <div className='flex flex-col w-2/6'>
                    <p className='font-medium'>Colaborador:</p>
                    <p> {entry.nomeLiberado} </p>
                  </div>
                  <div className='flex flex-col w-2/6'>
                    <p className='font-medium'>Matricula:</p>
                    <p> {entry.matriculaLiberado} </p>
                  </div>
                  <div className='flex flex-row items-center justify-center w-1/6' >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-1">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    <p>{entry.dataLiberacao} </p>
                  </div>
                </div>
                {/* info adicionais */}
                {expandedEntry === index ? (
                  <div className='flex flex-row h-3/4 w-full  my-5 pb-5'>
                    <div className='w-9/12 mr-5'>
                      <p className='font-medium'>Observação:</p>
                      <div className='p-3 border border-solid border-opacity-20 border-navbar h-full'>

                        <p>{entry.observacao}</p>
                      </div>
                    </div>
                  <div className='flex flex-col h-full justify-center'>
                  <div className='flex flex-col '>
                    <p className='font-medium'>Requerente:</p>
                    <p>{entry.nomeRequerente}</p>
                  </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

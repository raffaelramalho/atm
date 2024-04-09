
import axios from 'axios';
import { useEffect, useState } from 'react';
import Organizer from '../components/hoc/Hoc'
import swal from 'sweetalert';
import config from '../config'

const ITEMS_PER_PAGE = 10;

function LogChanges() {
  const [log, setLog] = useState([]);
  const [hiddenRows, setHiddenRows] = useState([]);
  const [token1, setToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState('turno');
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  

  
  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) setToken(true);
  }, []);
  const getLogs = async () => {
    useEffect(() => {
      setLoading(true)
      axios.get(`${config.backendUrl}/api/v1/changeLog?log=1`)
        .then((res) => {
          const formattedLog = res.data[0]
          console.log(formattedLog)
          setLog(formattedLog[0]);
          setLoading(false)
        })
        .catch((error) => console.error(`Erro: ${error}`));
    }, []);
  }
  getLogs()

  // @ts-expect-error TS7006
  const handleChangeClick = async (event, id) => {
    const target = event.currentTarget.id;
    swal({
      title: "Tem certeza?",
      text: "O colaborador não será mais alterado caso você faça isso",
      icon: "warning",
      buttons: ['Cancelar', 'Deletar'],
    }).then(async (willDelete) => {
      if (willDelete) {
        swal("Alteração de turno cancelada com sucesso!", {
          icon: "success",
        });

        try {
          await axios.get(`${config.backendUrl}/api/v1/changeLog?delete=${target}`);
          const updatedLog = log.filter((entry) => entry.registration !== target);
          setLog(updatedLog);
        } catch (error) {
          // Trate os erros conforme necessário
          console.error("Erro ao deletar:", error);
        }

      } else {
        swal("Ação cancelada");
      }
    });
    
  };
  // @ts-expect-error TS6133
  const [show, setShow] = useState(true);
  const filteredLog = log.filter((entry) => {
    if (selectedOption === 'turno') {
      // Mostrar apenas mensagens onde name !== "SHE1_ IDSECUREPLUS _NAO_DELETAR" e name !== "SHE2_ IDSECUREPLUS _NAO_DELETAR"
      return entry.name !== 'SHE1_ IDSECUREPLUS _NAO_DELETAR' && entry.name !== 'SHE2_ IDSECUREPLUS _NAO_DELETAR' && entry.name !== 'Sábado Exceção';
    } else if (selectedOption === 'sabado') {
      // Mostrar apenas mensagens onde name === "SHE1_ IDSECUREPLUS _NAO_DELETAR" ou name === "SHE2_ IDSECUREPLUS _NAO_DELETAR"
      return entry.name === 'SHE1_ IDSECUREPLUS _NAO_DELETAR' || entry.name === 'SHE2_ IDSECUREPLUS _NAO_DELETAR';
    }
    return true;
  });
  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOption]);

  const currentItems = filteredLog.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 ">
      <div className="h-full w-full">
        <h3 className="text-3xl my-2">Relação de mudanças de turno</h3>
        <div className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-500  ease-in-out rounded-md h-26 font-medium`}>
          <div className='flex flex-row items-center'>
            <div className='mr-5'>
              <p>Visão:</p>
            </div>
            <div>
              <select onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="turno">Troca de turno</option>
                <option value="sabado">Sábado Hora Extra</option>
              </select>
            </div>
          </div>
        </div>
        <div className={`w-full `}>
          {currentItems.length > 0 ? (
            <table className={`min-w-full bg-white border border-gray-300 rounded-md overflow-hidden`}>
              <thead>
                <tr>
                  <th className={`py-2 px-4 border-b border-gray-300 bg-gray-200`}>Colaborador</th>
                  <th className={`py-2 px-4 border-b border-gray-300 bg-gray-200`}>Turno Novo</th>
                  <th className={`py-2 px-4 border-b border-gray-300 bg-gray-200`}>Opções</th>
                </tr>
              </thead>
              <tbody>
              {currentItems.map((entry, index) => (
                
                  <tr
                    key={index}
                    className={`transition ${index % 2 === 0 ? 'bg-background hover:bg-[#426983] hover:text-[#fff]' : 'bg-[#dfdfdf] hover:bg-[#a1a1a1]'} `}
                  >
                    <td className='py-2 px-4 '>{entry.nome} {entry.registration}</td>
                    <td className='py-2 px-4 text-center'>{entry.name}</td>
                    <td className='flex flex-row justify-center items-center py-2 px-4'>
                      <button
                        className='bg-[#dd2626] hover:bg-[#501616]  p-1 w-20 flex justify-center'
                        onClick={(e) => handleChangeClick(e, entry.registration)}
                        name={entry.registration}
                        id={entry.registration}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-4">Não há nenhum registro.</p>
          )}
          <div>
            <div className="flex justify-center items-center align-middle mt-5">
              {/* Botão "Anterior" */}
              <button
                onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 rounded-md bg-delpRed hover:bg-[#832020] w-20"
              >
                Anterior
              </button>
              {/* Botão "Próxima" */}
              {/* Texto "Página x de x+1" */}
            <p className="mr-5 ml-5 text-center">Página {currentPage} de {Math.ceil(filteredLog.length / ITEMS_PER_PAGE)}</p>
              <button
                onClick={() => setCurrentPage(currentPage === Math.ceil(filteredLog.length / ITEMS_PER_PAGE) ? currentPage : currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredLog.length / ITEMS_PER_PAGE)}
                className="mx-1 px-3 py-1 rounded-md bg-delpRed hover:bg-[#832020] w-20"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organizer(LogChanges);

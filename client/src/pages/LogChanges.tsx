
import axios from 'axios';
import { useEffect, useState } from 'react';
import Organizer from '../components/hoc/Hoc'
import swal from 'sweetalert';

function LogChanges() {
  const [log, setLog] = useState([]);
  const [hiddenRows, setHiddenRows] = useState([]);
  const [token1, setToken] = useState(false)
  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) setToken(true);
  }, []);
  const getLogs = async () => {
    useEffect(() => {
      axios.get("http://10.0.1.204:3307/api/v1/changeLog?log=1")
        .then((res) => {
          const formattedLog = res.data[0]
          setLog(formattedLog[0]);
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
          await axios.get(`http://10.0.1.204:3307/api/v1/changeLog?delete=${target}`);
          
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

  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 ">
      <div className='h-full w-full'>
        <h3 className='text-3xl my-2'>Relação de mudanças de turno</h3>
        <div className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-500  ease-in-out rounded-md h-26 font-medium`}>
          <div className='flex flex-row items-center'>
            Colaborador</div>
          <div>Turno Novo</div>
          <div className='flex flex-row items-center'>
            Opções
          </div>
        </div>
        <div className={`flex flex-col mb-5 w-full  rounded-md overflow-y-auto h-3/4`}>
          {log.length > 0 ? (
            log.map((entry, index) => (
              <div
                className={`flex flex-row w-full h-20 items-center justify-between px-5 transition ${index % 2 === 0 ? 'bg-background hover:bg-[#426983] hover:text-[#fff]' : 'bg-[#dfdfdf] hover:bg-[#a1a1a1]'} first:rounded-md last:rounded-b-sm ${hiddenRows.includes(entry.registration) ? 'hidden' : ''}`}
              >
                <div className='w-2/6 h-14 flex items-center'>
                  {/*
                   // @ts-expect-error TS2339 */}
                  <div className=' w-full'>{entry.nome} {entry.registration}</div>
                </div>
                {/*
                 // @ts-expect-error TS2339 */}
                <div className='w-2/6'>{entry.name}</div>
                <div className='flex flex-row justify-center items-center'>
                  <button
                    className='bg-[#dd2626] hover:bg-[#501616]  p-1.5'
                    onClick={handleChangeClick}
                    // @ts-expect-error TS2339
                    name={entry.registration}
                    id={entry.registration}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>

                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`flex flex-row w-full h-20 items-center justify-between px-5 transition bg-background hover:bg-[#f1f1f1]' : 'bg-[#dfdfdf] hover:bg-[#a1a1a1]'} first:rounded-md last:rounded-b-sm`}>
              <p>Nehuma troca de turno agendada :D</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Organizer(LogChanges);


import axios from 'axios';
import { useEffect, useState } from 'react';
import Organizer from '../components/hoc/hoc'
import swal from 'sweetalert';

function LogChanges() {
  const [log, setLog] = useState([]);



  const getLogs = async () => {
    useEffect(() => {
      axios.get("http://10.0.1.204:3307/api/v1/changeLog?log=1")
        .then((res) => {
          const formattedLog = res.data[0]
          console.log(formattedLog[0])
          setLog(formattedLog[0]);
        })
        .catch((error) => console.error(`Erro: ${error}`));
    }, []);
  }
  getLogs()

  const handleChangeClick = async (event) => {
    console.log(event.currentTarget.name)
    const target = event.currentTarget.name
    swal({
      title: "Tem certeza?",
      text: "O colaborador não sera mais alterado caso você faça isso",
      icon: "warning",
      buttons: ['Cancelar', 'Deletar'],
    })
      .then(async (willDelete) => {
        if (willDelete) {
          swal("Alteração de turno cancelada com sucesso!", {
            icon: "success",
          })
          try {
            const response = await axios.get(`http://10.0.1.204:3307/api/v1/changeLog?delete=${target}`)
          } catch (error) {
            console.log(error)
          }
          window.location.reload(false);
        } else {
          swal("Ação cancelada");
        }
      });

  }

  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 ">
      <div className='h-full w-full'>
        <h3 className='text-3xl my-2'>Relação de mudanças de turno</h3>
        <div className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-500  ease-in-out rounded-md h-26 font-medium`}>
          <div className='flex flex-row items-center'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
            <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
            <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
            <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
          </svg>
            Colaborador</div>
          <div>Turno Novo</div>
          <div className='flex flex-row items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
            Opções</div>
        </div>
        <div className={`flex flex-col mb-5 w-full  rounded-md overflow-y-scroll h-3/4`}>
          {log.length > 0 ? (
            log.map((entry, index) => (
              <div
                className={`flex flex-row w-full h-20 items-center justify-between px-5 transition ${index % 2 === 0 ? 'bg-background hover:bg-[#f1f1f1]' : 'bg-[#dfdfdf] hover:bg-[#a1a1a1]'} first:rounded-md last:rounded-b-sm`}
              >
                <div className='w-2/6'>
                  <div className='font-medium'>{entry.nome}</div>
                  <div>{entry.registration}</div>

                </div>
                <div className='w-2/6'>{entry.name}</div>
                <div >
                  <button
                    className='bg-[#dd2626] hover:bg-[#501616] rounded-full p-1'
                    onClick={handleChangeClick}
                    name={entry.registration}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : null}

        </div>
      </div>
    </div>
  );
}

export default Organizer(LogChanges);

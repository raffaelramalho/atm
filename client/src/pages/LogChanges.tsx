
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
    buttons: ['Cancelar','Deletar'],
  })
  .then(async (willDelete) => {
    if (willDelete) {
      swal("Alteração de turno cancelada com sucesso!", {
        icon: "success",
      })
      try{
        const response = await axios.get(`http://10.0.1.204:3307/api/v1/changeLog?delete=${target}`)
      } catch(error){
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
        <div className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-500  ease-in-out rounded-md h-26`}>
          <div>Colaborador</div>
        
          <div>Turno Novo</div>
          <div>Opçoes</div>

        </div>
        <div className={`flex flex-col mb-5 w-full  rounded-md overflow-y-scroll h-3/4`}>
          {log.length > 0 ? (
            log.map((entry, index) => (
              <div
                className={`flex flex-row w-full h-20 items-center justify-between px-5 transition ${index % 2 === 0 ? 'bg-background hover:bg-[#f1f1f1]' : 'bg-[#dfdfdf] hover:bg-[#a1a1a1]'} first:rounded-md last:rounded-b-sm`}
                
              >
                <div className='w-2/6'>
                  <div>{entry.registration}</div>
                  <div>{entry.nome}</div>
                </div>
                <div className='w-2/6'>{entry.name}</div>
                <div >
                  <button 
                  className='bg-[#dd2626] hover:bg-[#501616]'
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

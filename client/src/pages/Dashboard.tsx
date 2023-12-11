import { Link } from 'react-router-dom';
import { FaDesktop } from "react-icons/fa6";
import axios from 'axios';
import { useEffect, useState } from 'react';
import TotalAtrasosDoMes from '../components/TotalAtrasosDoMes';
import TotalAtrasos from '../components/TotalAtrasos';




function HomePage() {
  const [log, setLog] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [sortBy, setSortBy] = useState('dataLiberacao');
  const [inputSearch, setInputSearch] = useState('');
  const [mesAtual, setMesAtual] = useState('');
  const [mesAtualValor, setMesAtualValor] = useState(0);
  const [mesPassadoValor, setMesPassadoValor] = useState(0);

  //Recebe as informações dos logs
  const getLogs = async () => {
    useEffect(() => {
      axios.get("http://10.0.1.204:3307/api/v1/getLog/")
        .then((res) => {
          const formattedLog = res.data[0].map(entry => {
            let date = new Date(entry.dataLiberacao);
            let formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
            return { ...entry, dataLiberacao: formattedDate };

          });
          setLog(formattedLog);
        })
        .catch((error) => console.error(`Erro: ${error}`));
    }, []);
  }
  getLogs()
useEffect(() => {
  const id = 0
    axios.get(`http://10.0.1.204:3307/api/v1/dashboard`)
      .then((res) => {
        const formattedLog = res.data[0].map(entry => {
          let date = new Date(entry.dataLiberacao);
          let formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
          return { ...entry, dataLiberacao: formattedDate };

        });
        setLog(formattedLog);
      })
      .catch((error) => console.error(`Erro: ${error}`));
  }, []);
  const dashboardFill = async () => {
    const mesAtual = await getMesAtualEmPortugues()
    setMesAtual(mesAtual)
    const mesAtualValor = await dateVerify()
    const mesPassadoValor = await dateVerifyPast()
    setMesAtualValor(mesAtualValor)
    setMesPassadoValor(mesPassadoValor)
  }

  async function getMesAtualEmPortugues() {
    const data = new Date();
    const opcoes = { month: 'long' };
    const mes = data.toLocaleString('pt-br', opcoes);
    return mes;
  }

  const dateVerify = async () => {
    const dataAtual = new Date();
    const dataRAW = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const dataReferencia = dataRAW.toLocaleDateString('pt-br');
    var cont = 0
    const objetosFiltrados = log.filter(objeto => {
      const dataObjeto = (objeto.dataLiberacao);
      if (dataObjeto >= dataReferencia) {
        cont++
      }

    });
    return cont
  }

  const dateVerifyPast = async () => {
   
  }
  dashboardFill();
  return (
    <div className="flex flex-col sm:flex-row h-screen justify-center w-3/4 sm:p-5 ">
      <div className='h-full sm:w-full p-3 sm:p-1 w-full sm:w-1/12'>
        <h3 className='text-3xl my-2'>Início</h3>
        <div className='flex flex-col mr-2 h-5/6 my-5'>
          <div className='flex flex-col sm:flex-row w-full justify-around'>
            <div className='w-full sm:w-3/12 h-4/12 flex flex-col text-center'>
              <TotalAtrasosDoMes mesAtual={mesAtualValor} mesPassado={mesPassadoValor} />
            </div>
            <div className='w-full sm:w-3/12 h-2/12 flex flex-col text-center my-5'>
              <TotalAtrasos mesAtrasos={mesAtualValor} mesNome={mesAtual} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default (HomePage);

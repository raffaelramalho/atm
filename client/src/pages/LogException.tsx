
import axios from 'axios';
import { useEffect, useState } from 'react';
import Organizer from '../components/hoc/Hoc'
import TabelaHistorico from '../components/ListaPaginada'
import * as XLSX from 'xlsx';
import { SiMicrosoftexcel } from "react-icons/si";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
function HomePage() {
  const [log, setLog] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [sortBy, setSortBy] = useState('dataLiberacao');
  const [inputSearch, setInputSearch] = useState('');

  // @ts-expect-error TS7006
  const handleInputChange = async (event) => {

    const value = event.target.value;
    setInputSearch(value)

    if (value.length > 0) {
      const results = await axios.get(`http://10.0.1.204:3307/api/v1/searchGetter?username=${value}`)
      // @ts-expect-error TS7006
      const formattedLog = results.data[0].map(entry => {
        let date = new Date(entry.dataLiberacao);
        let formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
        return { ...entry, dataLiberacao: formattedDate };
      });
      setLog(formattedLog);
    } else {
      setLog([]);
      await getLogs()
    }
  };

  const exportToExcel = (fileName) => {
    const ws = XLSX.utils.json_to_sheet(log);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // @ts-expect-error TS7006
  const toggleExpand = (index) => {
    setExpandedEntry((prev) => (prev === index ? null : index));
  };

  const getLogs = async () => {
    useEffect(() => {
      axios.get("http://10.0.1.204:3307/api/v1/getLog/")
        .then((res) => {
          // @ts-expect-error TS7006
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
  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 ">
      <div className='h-full w-full'>
        <h3 className='text-3xl my-2'>Histórico de liberações</h3>
        <div className={`flex flex-row bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-500  ease-in-out rounded-md h-26`}>
          <div className='w-6/12'>
            <div
              className={`flex items-center border border-navbar ${isClicked ? 'border-opacity-100' : 'border-opacity-50'} border-solid h-10 rounded-3xl`}

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
            <p className=' hidden sm:visible'>Ordenar:</p>
            <select
              className='ml-2 px-2 py-1 border border-navbar border-opacity-50 rounded-md'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value='dataMaisRecente'>
                Data ↧
              </option>
              <option value='dataLiberacao'>
                Data ↥
              </option>
              <option value='nomeLiberado'>Nome</option>
            </select>
          </div>
          <div>
            <button className='flex bg-headerColor hover:bg-navbar rounded-xl items-center font-medium'
              onClick={() => exportToExcel(`historico_${new Date().toISOString()}`)}
            >Exportar <SiMicrosoftexcel className='ml-1' />
            </button>
          </div>
        </div>
        <div className='flex flex-col overflow-y-auto h-5/6 mb-10 scrollbar-track-background'>
          {log.length > 0 ? (
            <TabelaHistorico
              log={log}
              sortBy={sortBy}
              itemsPerPage={10}
            />
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

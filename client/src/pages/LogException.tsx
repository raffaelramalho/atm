
import axios from 'axios';
import { useEffect, useState } from 'react';
import Organizer from '../components/hoc/Hoc'

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
      console.log(results.data[0])
      setLog(formattedLog);
    } else {
      setLog([]);
      await getLogs()
    }
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
        <div className='flex flex-col overflow-y-auto h-5/6 mb-10 scrollbar-track-background'>
          {log.length > 0 ? (
            <table className="table-auto w-full ">
              <thead>
                <tr className='sticky top-0 bg-background h-20 rounded'>
                  <th className='font-medium'>Colaborador</th>
                  <th className='font-medium'>Matricula</th>
                  <th className='font-medium'>Horário</th>
                  <th className='font-medium'>Requerente</th>
                </tr>
              </thead>
              <tbody>
                {log.sort((a, b) => {
                  if (sortBy === 'dataMaisRecente') {
                    // Ordene por dataMaisRecente
                    // @ts-expect-error TS2362
                    return new Date(b.dataLiberacao) - new Date(a.dataLiberacao);
                  } else if (sortBy === 'esseMes') {
                    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                    console.log(firstDayOfMonth)
                    const filteredLog = log.filter((entry) => new Date(entry.dataLiberacao) >= firstDayOfMonth);

                    setLog(filteredLog);
                  } else {
                    // Lógica de ordenação existente
                    if (a[sortBy] < b[sortBy]) return -1;
                    if (a[sortBy] > b[sortBy]) return 1;
                    return 0;
                  }
                  return 0;
                }).map((entry, index) => (
                  <tr
                    key={index}
                    className={`bg-background px-8 py-3 shadow-md mb-5 w-full justify-between transition duration-300  ease-in-out rounded-md hover:bg-[#DFF4FA] ${expandedEntry === index ? ' items-start mb-10' : ' items-center sm:h-20'}`}
                  >
                    <td className='pl-5'>{entry.nomeLiberado}</td>
                    <td className='pl-5'>{entry.matriculaLiberado}</td>
                    <td className='pl-5'>{entry.dataLiberacao.split(' ')}</td>
                    <td className='pl-5'>{entry.nomeRequerente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

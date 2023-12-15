// @ts-expect-error TS6133
import { Link } from 'react-router-dom';
// @ts-expect-error TS6133
import { FaDesktop } from "react-icons/fa6";
import axios from 'axios';
import { useEffect, useState } from 'react';

function HomePage() {
  const [log, setLog] = useState([]);
  // @ts-expect-error TS6133
  const [expandedEntry, setExpandedEntry] = useState(null);
  // @ts-expect-error TS6133
  const [isClicked, setIsClicked] = useState(false);
  // @ts-expect-error TS6133
  const [sortBy, setSortBy] = useState('dataLiberacao');
  // @ts-expect-error TS6133
  const [inputSearch, setInputSearch] = useState('');
  const [mesAtual, setMesAtual] = useState('');
  const [mesAtualValor, setMesAtualValor] = useState(0);
  const [mesPassadoValor, setMesPassadoValor] = useState(0);


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

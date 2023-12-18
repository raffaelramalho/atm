import React, { useEffect, useState } from 'react';

const TabelaHistorico = ({ log, sortBy, itemsPerPage }: { log: any[], sortBy: string, itemsPerPage: number }) => {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [logPaginado, setLogPaginado] = useState([]);
    useEffect(() => {
        setTotalPages(Math.ceil(log.length / itemsPerPage));
        setLogPaginado(log.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
    }, [log, itemsPerPage, paginaAtual]);

    const handlePaginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    const handleProximaPagina = () => {
        if (paginaAtual < totalPages) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    return (
        <>
            <table className="table-auto w-full border">
                <thead className=''>
                    <tr className='sticky top-0 bg-[#555] text-[#fff] h-20 rounded border border-navbar border-solid'>
                        <th className='font-medium w-4/12 sm:text-base text-xs'>Nome</th>
                        <th className='font-medium w-1/12 sm:text-base text-xs'>Matricula</th>
                        <th className='font-medium w-1/12 sm:text-base text-xs'>Dia</th>
                        <th className='font-medium w-1/12 sm:text-base text-xs'>Horário</th>
                        <th className='font-medium w-1/6  sm:text-base text-xs'>Requerente</th>
                    </tr>
                </thead>
                <tbody >
                    {logPaginado.sort((a, b) => {
                        if (sortBy === 'dataMaisRecente') {
                            // Ordene por dataMaisRecente
                            // @ts-expect-error TS2362
                            return new Date(b.dataLiberacao) - new Date(a.dataLiberacao);
                        } else if (sortBy === 'esseMes') {
                            const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
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
                            className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-background'
                                } px-8 py-3 0 h-30  mb-5 w-full justify-between transition duration-300 border-b-[0.1px] border-solid border-y-navbar first:border-t-[0.1px] ease-in-out rounded-md hover:bg-[#DFF4FA] items-start last:border-none last:rounded-lg`}
                        >
                            <td className='pl-5 h-20  text-xs sm:text-base border-r border-y-navbar'>
                                {entry.nomeLiberado}
                                </td>
                            <td className=' text-center text-xs border-r border-y-navbar'>
                                {entry.matriculaLiberado}
                                </td>
                            <td className=' h-20  text-xs sm:text-base border-r border-y-navbar text-center'>
                                {entry.dataLiberacao && (<p>{entry.dataLiberacao.split(' ')[0]}</p>)}
                            </td>
                            <td className='text-xs sm:text-base border-r border-y-navbar text-center'>
                                {entry.dataLiberacao && (<p> {entry.dataLiberacao.split(' ')[1].slice(0, 5)}</p>)}
                            </td>
                            <td className='pl-5 h-20  text-xs sm:text-base'>{entry.nomeRequerente}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-center mt-4'>
                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1} className='px-3 py-2 bg-headerColor text-navbar hover:bg-[#2f4e7e] rounded-md ml-2 justify-center flex items-center w-12'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <span className='text-navbar mx-5 flex justify-center h-full'>{`Página ${paginaAtual} de ${totalPages}`}</span>
                <button onClick={handleProximaPagina} disabled={paginaAtual === totalPages} className='px-3 py-2 bg-headerColor text-navbar hover:bg-[#2f4e7e] rounded-md ml-2 justify-center flex items-center w-12'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>

                </button>
            </div>
        </>
    );
};

export default TabelaHistorico;

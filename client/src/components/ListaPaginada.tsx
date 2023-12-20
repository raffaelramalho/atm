import  { useEffect, useState } from 'react';

const TabelaHistorico = ({ log, sortBy, itemsPerPage }: { log: any[], sortBy: string, itemsPerPage: number }) => {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [logPaginado, setLogPaginado] = useState([]);
    useEffect(() => {
        setTotalPages(Math.ceil(log.length / itemsPerPage));
        //@ts-ignore
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
    useEffect(() => {
        const sortedLog = [...log].sort((a, b) => {
            if (sortBy === 'dataMaisRecente') {
                //@ts-ignore
                return new Date(b.dataLiberacao) - new Date(a.dataLiberacao);
            } else {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            }
        });

        setTotalPages(Math.ceil(sortedLog.length / itemsPerPage));
        //@ts-ignore
        setLogPaginado(sortedLog.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
    }, [log, itemsPerPage, paginaAtual, sortBy]);

    return (
        <>
            <table className="table-auto w-full border border-t-8 border-t-[#555]">
                <thead className='pt-3'>
                    <tr className='sticky top-0 bg-[#555]  text-[#fff] h-12 rounded border border-navbar border-solid'>
                        <th className='font-medium w-4/12 sm:text-base text-xs'>Nome</th>
                        <th className='font-medium w-1/12 sm:text-base text-xs'>Matricula</th>
                        <th className='font-medium w-1/12 sm:text-base text-xs'>Dia</th>
                        <th className='font-medium w-1/12 sm:text-base text-xs'>Horário</th>
                        <th className='font-medium w-1/6  sm:text-base text-xs'>Requerente</th>
                        <th className='font-medium w-1/6  sm:text-base text-xs'>Observação</th>
                    </tr>
                </thead>
                <tbody >
                    {logPaginado.sort((a, b) => {
                        if (sortBy === 'dataMaisRecente') {
                            // @ts-expect-error TS2362
                            return new Date(b.dataLiberacao) - new Date(a.dataLiberacao);
                        } else {
                            // Lógica de ordenação existente
                            return a[sortBy] - b[sortBy];
                        }
                        
                    }).map((entry, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-background'} px-8  w-full justify-between transition duration-300 border-b-[0.1px] border-solid border-y-navbar  ease-in-out rounded-md hover:bg-[#DFF4FA] items-start last:border-none last:rounded-lg`}
                        >
                            <td className='pl-5 h-12  text-xs sm:text-base border-r border-y-navbar'>
                            {/* @ts-ignore */}
                                {entry.nomeLiberado}
                            </td>
                            <td className='text-center text-xs border-r border-y-navbar'>
                                {/* @ts-ignore */}
                                {entry.matriculaLiberado}
                            </td>
                            <td className='h-12  text-xs sm:text-base border-r border-y-navbar text-center'>
                                {/* @ts-ignore */}
                                {entry.dataLiberacao && <p>{entry.dataLiberacao.split(' ')[0]}</p>}
                            </td>
                            <td className='text-xs sm:text-base border-r border-y-navbar text-center'>
                                {/* @ts-ignore */}
                                {entry.dataLiberacao && <p>{entry.dataLiberacao.split(' ')[1].slice(0, 5)}</p>}
                            </td>
                            {/* @ts-ignore */}
                            <td className='pl-5 h-12  text-xs sm:text-base border-r border-y-navbar'>{entry.nomeRequerente}</td>
                            {/* @ts-ignore */}
                            <td className='pl-5 h-12  text-xs sm:text-base'>{entry.observacao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-center mt-4 w-full'>
                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1} className='px-3 py-2 bg-headerColor text-navbar hover:bg-[#2f4e7e] rounded-md ml-2 justify-center flex items-center w-12'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <span className='text-navbar mx-5 flex justify-center h-full items-center font-medium'>{`Página ${paginaAtual} de ${totalPages}`}</span>
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

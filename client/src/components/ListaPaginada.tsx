import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const TabelaHistorico = ({ log, itemsPerPage }: { log: any[], itemsPerPage: number }) => {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [logPaginado, setLogPaginado] = useState([]);
    const [mesSelecionado, setMesSelecionado] = useState('');
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState('');

    useEffect(() => {
        setTotalPages(Math.ceil(log.length / itemsPerPage));
        setLogPaginado(log.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
    }, [log, itemsPerPage, paginaAtual]);
    const handleOrdenacao = (valor) => {
        setOrdenacaoSelecionada(valor);
        setMesSelecionado(''); // Limpar o filtro de mês quando a ordenação muda
    };
    useEffect(() => {
        let sortedLog = [...log];
    
        if (ordenacaoSelecionada === 'Data Atual') {
            sortedLog = sortedLog.sort((a, b) => new Date(b.dataLiberacao) - new Date(a.dataLiberacao));
        } else if (ordenacaoSelecionada === 'Data Antiga') {
            sortedLog = sortedLog.sort((a, b) => new Date(a.dataLiberacao) - new Date(b.dataLiberacao));
        } else if (ordenacaoSelecionada === 'Alfabética') {
            sortedLog = sortedLog.sort((a, b) => a.nomeLiberado.localeCompare(b.nomeLiberado));
        }
    
        setTotalPages(Math.ceil(sortedLog.length / itemsPerPage));
        setLogPaginado(sortedLog.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
    }, [log, itemsPerPage, paginaAtual, ordenacaoSelecionada]);

    useEffect(() => {
        const sortedLog = [...log].sort((a, b) => {
            if (sortBy === 'dataMaisRecente') {
                return new Date(b.dataLiberacao) - new Date(a.dataLiberacao);
            } else {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            }
        });

        setTotalPages(Math.ceil(sortedLog.length / itemsPerPage));
        setLogPaginado(sortedLog.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
    }, [log, itemsPerPage, paginaAtual, sortBy]);

    useEffect(() => {
        if (mesSelecionado === '') {
            // Se nenhum mês estiver selecionado, exiba todos os registros
            setLogPaginado(log.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
        } else {
            // Filtrar por mês selecionado
            const filteredLog = log.filter(entry => {
                const date = new Date(entry.dataLiberacao);
                return date.getMonth() === parseInt(mesSelecionado, 10);
            });

            setTotalPages(Math.ceil(filteredLog.length / itemsPerPage));
            setLogPaginado(filteredLog.slice((paginaAtual - 1) * itemsPerPage, paginaAtual * itemsPerPage));
        }
    }, [log, itemsPerPage, paginaAtual, mesSelecionado]);

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

    const meses = [
        { nome: 'Janeiro', valor: '0' },
        { nome: 'Fevereiro', valor: '1' },
        { nome: 'Março', valor: '2' },
        { nome: 'Abril', valor: '3' },
        { nome: 'Maio', valor: '4' },
        { nome: 'Junho', valor: '5' },
        { nome: 'Julho', valor: '6' },
        { nome: 'Agosto', valor: '7' },
        { nome: 'Setembro', valor: '8' },
        { nome: 'Outubro', valor: '9' },
        { nome: 'Novembro', valor: '10' },
        { nome: 'Dezembro', valor: '11' }
    ];
    const opcoes = [
        { nome: 'Data Atual', valor: '12' },
        { nome: 'Data Antiga', valor: '13' },
    ];
    return (
        <>
            <div className='font-medium flex items-center mb-5 '>
                <p className=' hidden sm:visible'>Mês:</p>
                <select
                    className='ml-2 px-2 py-1 border border-navbar border-opacity-50 rounded-md'
                    value={mesSelecionado}
                    onChange={(e) => setMesSelecionado(e.target.value)}
                >
                    <option value=''>Todos</option>
                    {meses.map(mes => (
                        <option key={mes.valor} value={mes.valor}>
                            {mes.nome}
                        </option>
                    ))}
                </select>
                <select
                    className='ml-2 px-2 py-1 border border-navbar border-opacity-50 rounded-md'
                    value={ordenacaoSelecionada}
                    onChange={(e) => handleOrdenacao(e.target.value)}
                >
                    <option value=''>Ordenar por...</option>
                    {opcoes.map(opcao => (
                        <option key={opcao.valor} value={opcao.nome}>
                            {opcao.nome}
                        </option>
                    ))}
                </select>
            </div>

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
                <tbody>
                    {logPaginado.map((entry, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-background'} px-8  w-full justify-between transition duration-300 border-b-[0.1px] border-solid border-y-navbar  ease-in-out rounded-md hover:bg-[#DFF4FA] items-start last:border-none last:rounded-lg`}
                        >
                            <td className='pl-5 h-12  text-xs sm:text-base border-r border-y-navbar'>
                                {entry.nomeLiberado}
                            </td>
                            <td className='text-center text-xs  sm:text-base border-r border-y-navbar'>
                                {entry.matriculaLiberado}
                            </td>
                            <td className='h-12  text-xs sm:text-base border-r border-y-navbar text-center'>
                                <p>
                                    {format(new Date(entry.dataLiberacao.replace(/-/g, '/')), 'dd/MM/yy')}
                                </p>
                            </td>
                            <td className='text-xs sm:text-base border-r border-y-navbar text-center'>
                                <p>{entry.dataLiberacao.split(' ')[1].slice(0, 5)}</p>
                            </td>
                            <td className='pl-5 h-12  text-xs sm:text-base border-r border-y-navbar'>{entry.nomeRequerente}</td>
                            <td className='pl-5 h-12  text-xs sm:text-base'>{entry.observacao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-center mt-4 w-full'>
                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1} className='px-3 py-2  text-navbar bg-delpRed hover:bg-delpRedHover rounded-md ml-2 justify-center flex items-center w-12'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <span className='text-navbar mx-5 flex justify-center h-full items-center font-medium'>{`Página ${paginaAtual} de ${totalPages}`}</span>
                <button onClick={handleProximaPagina} disabled={paginaAtual === totalPages} className='px-3 py-2  text-navbar bg-delpRed hover:bg-delpRedHover rounded-md ml-2 justify-center flex items-center w-12'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-background">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>

                </button>
            </div>
        </>
    );
};

export default TabelaHistorico;

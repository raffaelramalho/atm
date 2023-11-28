import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

const UsersList = ({ NameList, ListName }) => {
  const [loading, setLoading] = useState(true); // Adiciona um estado para o loading

  useEffect(() => {
    // Define um tempo mínimo de loading
    const timer = setTimeout(() => setLoading(false), 50);
    return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado
  }, []);

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  };

  const horaAtual = getCurrentTime();

  return (
    <div className='custom-log'>
      <h2>{NameList.length == 0 ? '':ListName}</h2>
      <ul className='name-list'>
        {loading ? (
          // Renderiza um skeleton enquanto os dados estão sendo carregados
          <Skeleton count={100} />
        ) : (
          NameList.map((nome) => (
            <li key={nome}> <span>[{horaAtual}]</span> Usuário <span className='name-list-spam'>{nome}</span> {ListName === 'Usuários Alterados' ? ' foi alterado com sucesso.' : ' não foi encontrado.'}</li>
          ))
        )}
      </ul>
    </div>
  );
};


export default UsersList;
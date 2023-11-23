import React from 'react';

const UsersList = ({ NameList, ListName }) => {
  if ( NameList == null || NameList.length === 0 ) {
    return null; // Se não há usuários não encontrados, não renderiza nada
  }
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
      <h2>{ListName}</h2>
      <ul className='name-list'>
        {NameList.map((nome) => (
            <li key={nome}> <span>[{horaAtual}]</span> Usuário <span className='name-list-spam'>{nome}</span> {ListName === 'Usuários Alterados' ? ' foi alterado com sucesso.' : ' não foi encontrado.'}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
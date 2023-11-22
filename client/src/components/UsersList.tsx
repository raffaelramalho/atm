import React from 'react';

const UsersList = ({ NameList }) => {
  if (NameList.length === 0) {
    return null; // Se não há usuários não encontrados, não renderiza nada
  }

  return (
    <div>
      <h2>Alterações:</h2>
      <ul>
        {NameList.map((nome) => (
          <li key={nome}>{nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
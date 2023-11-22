import React from 'react';

const UsersNotFoundList = ({ errorNameList }) => {
  if (errorNameList == null) {
    return null; // Se não há usuários não encontrados, não renderiza nada
  }

  return (
    <div>
      <h2>Usuários não encontrados:</h2>
      <ul>
        {errorNameList.map((nome) => (
          <li key={nome}>{nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersNotFoundList;
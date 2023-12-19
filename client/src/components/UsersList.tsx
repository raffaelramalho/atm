// @ts-expect-error TS7031
const UsersList = ({ NameList, ListName, messageContent }) => {
  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  };

  const horaAtual = getCurrentTime();

  return (
    <div className='max-h-96'>
      
      {NameList.length === 0 ? (
        <></>
      ):(
        <>
        <h2 className="font-medium text-lg">{ListName}</h2>
        <ul className='bg-section px-10 py-5 my-5 overflow-y-scroll max-h-80' > 
            {/*
             // @ts-expect-error TS7006 */}
            {NameList.map((nome) => (
              <li key={nome}> <span>[{horaAtual}]</span> Usuário <span className='text-successBtn'>{nome}</span> {messageContent}</li>
            ))}
        </ul>
        </>
      )}
        
    </div>
  );
};

export default UsersList;

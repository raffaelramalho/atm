import {  Link } from 'react-router-dom';
import { FaDesktop } from "react-icons/fa6";

function HomePage() {
    

  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 items-center">
      <div className='bg-background p-5 w-3/5 h-fit text-center border border-navbar border-opacity-20 border-solid'>
        <h1 className='text-7xl font-medium' >Atenção!</h1>
        <p className='my-5'>Essa ferramenta de controle é um adicional ao ID Secure, portanto não substitui o uso completo da mesma, ela apenas automatiza certos processos que eram feitos de forma muito manual.
          Qualquer sugestão ou indicação de mal funcionamento favor reportar imediatamente para o setor de TI.
        </p>
      </div>
      
    </div>
  );
}

export default HomePage;

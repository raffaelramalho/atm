import Organizer from "../components/hoc/Hoc";
function HomePage() {
    

  return (
    <div className="flex flex-row h-screen justify-center w-full sm:p-5 items-center">
      <div className='bg-background p-5 w-2/5 sm:5/5 h-fit text-center border border-navbar border-opacity-20 border-solid'>
        <h1 className='text-2xl font-medium sm:text-5xl' >Atenção!</h1>
        <p className='my-5'>Essa ferramenta de controle é um adicional ao ID Secure, portanto não substitui o uso completo dela, ela apenas automatiza certos processos que eram feitos de forma muito manual. Qualquer sugestão ou indicação de mal funcionamento favor abrir um ticket juntamente ao setor de TI.
        </p>
        <div className='flex w-full justify-center text-[#fff] font-medium'>
          <a href="http://suporte.delp.com.br/glpi/" className='bg-delpRed hover:bg-delpRedHover w-28 mx-2 rounded-md h-10 flex justify-center items-center w-full'>GLPI</a>
          <a href="http://delp5015:30443/#/login" className='bg-delpRed hover:bg-delpRedHoverw-28 mx-2 rounded-md h-10 flex justify-center items-center w-full'>ID Secure</a>
          
        </div>
      </div>
      
    </div>
  );
}

export default Organizer(HomePage);

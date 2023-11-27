import React, {  useState, useEffect } from 'react';
import { FaFileDownload } from "react-icons/fa";

import '../index.css'

import UsersNotFoundList from '../components/UsersList';
import UsersList from '../components/UsersList';

export default function Form() {
  
  const [turnos, setTurnos] = React.useState([]);
  const [informations, setInformations] =  React.useState([])
  React.useEffect(() => {
    fetch("http://localhost:3307/getTurnos")
      .then((res) => res.json())
      .then((turnos) => setTurnos(turnos));
  }, []);
  const [resultados, setResultados] = useState({ nomes: [], id: [], invalidos: [] });

  useEffect(()=>{
    
  }, []);
  
  const [form, setForm] = useState({
    nameList: [],
    newTurn: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
  
    
    if (name === 'nameList') {
      
      const nameListArray = value.split('\n');
  
      
      setForm({
        ...form,
        [name]: nameListArray,
      });
    } else {
     
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const exportarParaTXT = async() => {
    const infoNome =  informations;
    console.log("lista de nomes "+infoNome)
  
    // Adiciona "Nomes não encontrados" no início da lista
    infoNome.unshift("Nomes não encontrados:");
  
    const texto = infoNome.join('\n');
    console.log(texto)
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
  
    // Obtém a data e hora atual
    const agora = new Date();
    const horario = agora.toISOString().replace(/:/g, '-');
  
    // Adiciona o horário ao nome do arquivo
    link.download = `Log-${horario}.txt`;
  
    link.click();
  };




  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 
  };
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const handleUpdateTurnos = async (e: { preventDefault: () => void; } | undefined) => {
    setLoading(true);

    var nameListString = form.nameList.toString();
    
    
    const nameListArray = [...new Set(nameListString.split(',').map((name) => name.trim()))];
    
    try {
      var response = await fetch('http://localhost:3307/processar-dados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameList: nameListArray,
          newTurn: form.newTurn,
        }),
        
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resposta do backend:', data);
        setResultados(data);
        setable(false)
        setInformations(data.invalidos)
    } else {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend', error);
    } finally {
      setLoading(false);
      
    }
  };
  return (
    <div className='grid-helper'>
      
      <div>
      <h3 className=''>Nomes:</h3>
      <form className='custom-form' onClick={handleSubmit}>
        <label className=''>
          
          <textarea
            rows={10}
            name='nameList'
            value={form.nameList.join('\n')}
            onChange={handleChange}
            placeholder='Lista de Nomes'
            className='custom-textarea'
            
            disabled={false} 
            readOnly={false}
          />
        </label>
        <select name='newTurn' 
                className='custom-select'
                onChange={handleChange}>

          {turnos.map((turno) => (
            <option key={turno} value={turno}>
              {turno}
            </option>
          ))}
        </select>
        <button
          type='submit'
          className='custom-btn'
          onClick={handleUpdateTurnos}
        >
          {loading ? "Atualizando..." : "Atualizar Turnos"}
        </button>
        <button onClick={exportarParaTXT}
          disabled={able}
          className={able ? `disable-button` : ``}
        >
          Baixar Nomes não encontrados <FaFileDownload className="custom-icon" />
        </button>
      </form>
      </div>
      <UsersList NameList={resultados.nomes} ListName='Usuários Alterados' />
      <UsersNotFoundList NameList={resultados.invalidos} ListName='Usuários não encontrados' />
      
    </div>
  );
}

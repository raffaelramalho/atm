import React, { useRef, useState, useEffect } from 'react';

import '../index.css'
import LogArea from '../components/UsersList';
import UsersNotFoundList from '../components/UsersList';
export default function Form() {
  const [turnos, setTurnos] = React.useState([]);
   
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

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita a quebra de linha automática
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 
  };
  const [loading, setLoading] = useState(false);
  const handleUpdateTurnos = async (e: { preventDefault: () => void; } | undefined) => {
    setLoading(true);

    var nameListString = form.nameList.toString();
    console.log(nameListString)
    
    var nameListArray = nameListString.split(',').map((name) => name.trim());
    console.log(nameListArray)
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
      <h3 className=''>Alterador de Turnos em Massa</h3>
      <form className='custom-form' onClick={handleSubmit}>
        <label className=''>
          
          <textarea
            rows={10}
            name='nameList'
            value={form.nameList.join('\n')}
            onChange={handleChange}
            placeholder='Lista de Nomes'
            className='custom-textarea'
            
            disabled={false} // Certifique-se de que está configurado como false
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
      </form>
      </div>
      
      <UsersNotFoundList NameList={resultados.nomes} />
      <UsersNotFoundList errorNameList={resultados.invalidos} />

      
    </div>
  );
}

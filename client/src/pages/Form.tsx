import React, { useState, useEffect } from 'react';
import { FaFileDownload } from "react-icons/fa";
import '../index.css'
import UsersList from '../components/UsersList';

export default function Form() {
  // Definindo o estado inicial
  const [turnos, setTurnos] = useState([]);
  const [informations, setInformations] = useState([]);
  const [token1, setToken] = useState(false);
  const [resultados, setResultados] = useState({ nomes: [], id: [], invalidos: [] });
  const [form, setForm] = useState({ nameList: [], newTurn: "" });
  const [loading, setLoading] = useState(false);
  const [able, setable] = useState(true);
  const [aviso, setAviso] = useState(false)


  // Função para obter o token da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) setToken(true);
  }, []);

  // Função para buscar turnos
  useEffect(() => {
    fetch("http://10.0.1.204:3307/getTurnos/")
      .then((res) => res.json())
      .then((turnos) => setTurnos(turnos));
  }, []);

  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nameList') {
      const nameListArray = value.split('\n');
      setForm({ ...form, [name]: nameListArray });
    } else {
      setForm({ ...form, [name]: value });
    }
    
  };

  // Função para exportar para TXT
  const exportarParaTXT = async () => {
    const infoNome = informations;
    infoNome.unshift("Nomes não encontrados:");
    const texto = infoNome.join('\n');
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const agora = new Date();
    const horario = agora.toISOString().replace(/:/g, '-');
    link.download = `Log-${horario}.txt`;
    link.click();
  };

  // Função para lidar com a submissão do formulário
  // Função para validar o formulário
const validateForm = () => {
  // Obter os valores dos campos
  const { nameList, newTurn } = form;
  // Verificar se estão vazios
  if (nameList.length === 0 ) {
    // Retornar falso e mostrar uma mensagem de erro
    setAviso(true)
    return false;
  }
  // Caso contrário, retornar verdadeiro
  
  setAviso(false)
  return true;
};

 // Função para lidar com a submissão do formulário
const handleSubmit = (e) => {
  e.preventDefault();

};

  // Função para lidar com a atualização de turnos
  const handleUpdateTurnos = async () => {
    if (validateForm()) {
      // Se o formulário for válido, prosseguir com a atualização de turnos
      setLoading(true);
    if(form.nameList.length > 0){
      const nameListArray = [...new Set(form.nameList.toString().split(',').map((name) => name.trim()))]; 
      try {
        const response = await fetch('http://10.0.1.204:3307/processar-dados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nameList: nameListArray, newTurn: form.newTurn }),
        });
        if (response.ok) {
          const data = await response.json();
          setResultados(data);
          setable(false);
          setInformations(data.invalidos);
        } else {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao enviar dados para o backend', error);
      } finally {
        setLoading(false);
      }
    } else{
      setLoading(false);
      setable(true);
      setAviso(true)
    }
    
    }
  };
  const [delay, setDelay] = useState(0);

useEffect(() => {
  // Define um tempo de espera de 10 segundos
  const timer = setTimeout(() => setDelay(10000), 0);
  return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado
}, []);

useEffect(() => {
  // Define um tempo mínimo de loading
  const timer = setTimeout(() => setLoading(false), delay);
  return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado
}, [delay]); // Adiciona delay como uma dependência
  // Renderização do componente
  return (
    <div className='grid-helper'>
      {token1 ? (
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
            <p>{aviso ? "O formulário não pode estar em branco." :""}</p>
            <select name='newTurn' className='custom-select' onChange={handleChange}>
              {turnos.map((turno) => (
                <option key={turno} value={turno}>{turno}</option>
              ))}
            </select>
            
            <button type='submit' className='custom-btn' onClick={handleUpdateTurnos}>
              {loading ? "Atualizando..." : "Atualizar Turnos"}
            </button>
            <button onClick={exportarParaTXT} disabled={able} className={able ? `disable-button` : ``}>
              Baixar Nomes não encontrados <FaFileDownload className="custom-icon" />
            </button>
          </form>
          
        </div>
      ) : (
        <div className='grid-helper'>
          <p>Você não tem permissão para acessar isso D:</p>
        </div>
      )}
      {loading ? (
        <div className='loader'>
          <img src="../public/Spinner.svg" alt="" />
        </div>
      ) : (
        <div>
          <UsersList NameList={resultados.nomes} ListName='Usuários Alterados' />
          <UsersList NameList={resultados.invalidos} ListName='Usuários não encontrados' />
        </div>
      )}
    </div>
  );
}

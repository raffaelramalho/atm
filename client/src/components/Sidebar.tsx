import { useLocation } from "react-router-dom";
import './sidebar.css';
import '../index.css'
import { useState } from "react";


// Definindo uma interface para o tipo do objeto navLink
interface process {
    id: number;
    url: string;
    title: string;
    icon: string;
  }
  
  // Definindo uma interface para o tipo das props do componente
  interface Props {
    active: string; // O título do link ativo
    setActive: (title: string) => void; // A função para mudar o link ativo
  }
  
  // Definindo o componente como uma função que recebe as props
  const Component: React.FC<Props> = ({ active, setActive }) => {
    // Criando um array de objetos navLink
    const MassProcess: process[] = [
      {
        id: 1,
        url: "/form?token=daposkdops",
        title: "Turno em massa",
        icon: "../../public/people-group.svg",
      },
      {
        id: 2,
        url: "/agm",
        title: "Grupos em massa",
        icon: "../../public/people-group.svg",
      },
      {
        id: 3,
        url: "/aem",
        title: "Empresa em massa",
        icon: "../../public/people-group.svg",
      },
      {
        id: 4,
        url: "/holiday-group",
        title: "Férias em grupo",
        icon: "../../public/people-group.svg",
      },
    ];
    const Exception: process[] = [
        {
          id: 5,
          url: "/exception",
          title: "Exceção temporária",
          icon: "../../public/people-group.svg",
        },
      ];
  
    // Retornando o JSX com o mapeamento dos navLinks
    return (
      <ul className="custom-sidebar-content">
        <h3 className="ul-title">Processos em Massa</h3>
        {MassProcess.map((nav) => (
          <li
            key={nav.id}
            className={`${
              active === nav.title ? "text-white" : "text-secondary"
            }`}
            onClick={() => setActive(nav.title)}
          > 
            
            <a href={`${nav.url}`}>{nav.title}</a>
          </li>
        ))}
        <h3 className="ul-title">Regras de acesso</h3>
        {Exception.map((nav) => (
          <li
            key={nav.id}
            className={`${
              active === nav.title ? "text-white" : "text-secondary"
            }`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`${nav.url}`}>{nav.title}</a>
          </li>
        ))}
      </ul>
    );
  };
  
  // Exportando o componente
  export default Component;
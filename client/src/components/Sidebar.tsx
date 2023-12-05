import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


  const Component: React.FC = () => {
  
    const location = useLocation();
    const [active, setActive] = useState<string>("");
    const [link, setLink] = useState<string>("");
  
    useEffect(() => {
      setActive(location.pathname);
    }, [location.pathname]);
    
    const processGroups = {
      "Processo em Massa": [
        {
          id: 1,
          url: "/form?token=daposkdops",
          title: "Alterar Turno",
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
        </svg>,
        },
        {
          id: 4,
          url: "/ferias?token=daposkdops",
          title: "Férias em grupo",
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clip-rule="evenodd" />
        </svg>,
        },
      ],
      "Exceção": [
        {
          id: 5,
          url: "/excecao",
          title: "Entrada",
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
        </svg>,
        },
      ],
    };
    
    return (
      <ul className="flex-row bg-navbar w-60 py-10 ">
      {Object.keys(processGroups).map((group) => (
        <>
          <h3 className="font-medium px-7 text-[#708096] text-lg">{group}</h3>
          {processGroups[group].map((nav) => (
            <li
              key={nav.id}
              className={`text-[#b4bcc8] px-7  w-full h-16 flex items-center text-sm  hover:bg-headerColor ${link === nav.url ? "bg-successBtn":""}`}
            >
              <a href={`${nav.url}`} className="flex flex-row justify-between items-center w-full">
                {nav.title}
                <span >
                {nav.icon}
                </span>
              </a>
            </li>
          ))}
        </>
      ))}
    </ul>
    );
  };
  
  export default Component;
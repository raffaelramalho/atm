# ATM - Alterador de Turnos em Massa
ATM é uma aplicação desenvolvida para facilitar a alteração de turnos em massa, permitindo que os usuários processem uma lista de nomes e atualizem seus turnos de uma só vez.

## Como Usar
### Clone o repositório do GitHub:

```
git clone https://github.com/raffaelramalho/atm.git
```
### Instale as dependências:
```
npm install
```
### Inicie a aplicação:
```
npm start
```
Acesse a aplicação no navegador:
```
http://localhost:3000
```
## Funcionalidades
Atualização em Massa de Turnos: Os usuários podem fornecer uma lista de nomes e um novo turno para atualizar em massa.

Exportação para Arquivo TXT: Após a atualização, a aplicação permite exportar os resultados para um arquivo TXT, incluindo os nomes alterados e não encontrados.

## Estrutura do Projeto
src/components: Componentes React reutilizáveis.\
src/pages: Páginas da aplicação.\
src/services: Configurações e lógica relacionadas aos serviços da aplicação.\
src/styles: Estilos globais e específicos da aplicação.\
src/App.js: Ponto de entrada principal da aplicação.\
## Tecnologias Utilizadas
React: Biblioteca JavaScript para construção de interfaces de usuário.\
Fetch API: Utilizada para fazer requisições HTTP para o backend.
CSS: Estilos da aplicação.\
## Configuração do Backend
Certifique-se de configurar corretamente o backend da aplicação. As configurações de conexão com o banco de dados e outros detalhes específicos do ambiente podem ser definidas no arquivo .env.

env
Copy code
REACT_APP_BACKEND_URL=http://localhost:3307
## Contribuição
Se deseja contribuir para o desenvolvimento do ATM, sinta-se à vontade para abrir uma issue ou enviar um pull request.

Autor
Raffael Ramalho - GitHub

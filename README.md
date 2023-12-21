# ADDON DELP Control ID
O delpinho é uma ferramenta adicional para o control ID, tornando processos manuais em simples tarefas.

## Como Usar
### Clone o repositório do GitHub:

```
git clone https://github.com/raffaelramalho/atm.git
```
### Instale as dependências:
```
npm install
```
### Inicie a API:
```
npm start
```
### Inicie a aplicação:
```
npm run dev
```
Acesse a aplicação no navegador:
```
http://localhost:8000
```
## Funcionalidades
Atualização em Massa de Turnos: Os usuários podem fornecer uma lista de nomes e um novo turno para atualizar em massa.
Bloqueio de férias em grupo: o usuário pode fornecer uma lista de matriculas para serem bloqueadas até uma data X.
Liberação temporária: uma exceção pode ser criada, permitindo uma pessoa entrar nos ambientes por até cinco minutos.
Log de criação de liberações e log ver a fila de alterações pendentes.

## Estrutura do Projeto
client/src/components: Componentes React reutilizáveis.\
client/src/pages: Páginas da aplicação.\
server/...: Configurações e lógica relacionadas aos serviços da aplicação.\


## Tecnologias Utilizadas
React: Biblioteca JavaScript para construção de interfaces de usuário.\
Axios: Utilizada para fazer requisições HTTP para o backend.\
Tailwind: Estilos da aplicação.\
Node.js: backend para contato com o banco de dados.\
MySql: banco de dados.\

## Configuração do Backend
Certifique-se de configurar corretamente o backend da aplicação. As configurações de conexão com o banco de dados e outros detalhes específicos do ambiente podem ser definidas no arquivo .env.

env
Copy code
REACT_APP_BACKEND_URL=http://localhost:3307
## Contribuição
Se deseja contribuir para o desenvolvimento do ATM, sinta-se à vontade para abrir uma issue ou enviar um pull request.

Autor
Raffael Ramalho - GitHub

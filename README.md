# Knowledge Base

## Gif of Project
![](./appImages/WebProject.gif?w=512)

# 
# 
- [x] Project Description
- [ ] Run App
- [ ] Finish App
# 
# 
- **Frontend:**
Desenvolvido em React. Utilizamos a lib Bootstrap, aproveitando estilos e responsividade dos seus componentes; como biblioteca de ícones usamos font-awesome. Utilizamos também o gerenciador de estados Redux para facilitar a transição de informações de um componente para outros componentes interessados nessa informação. Para realizar chamadas à api e envio de dados foi usado o Axios, utilizando o conceito de Async/Await (baseado em Promise). Como gerenciador de rotas foi usado o React-Router-Dom. Foi implementado uma função recursiva para a montagem da arvóre de categoria e sub-categorias no menu lateral, do mesmo modo, foi utilizado recursão para a pesquisa de categorias nessa árvore.
# 
- **Backend:**
Desenvolvido em Node juntamente com Express. No banco de dados foi utilizado MongoDB (noSql) e Postgres (Sql) com ajuda do Knex. Foi implementado segurança para acessar o banco de dados (impedindo alterações indevidas). Com o arquivo .env que contém o authoSecret e senha, garantindo a conexão com o banco e alteração dos dados pelo backend que o possui. O acesso ao app é através de login com email e senha. Apenas administradores podem tornar novos usuários administradores também. Senha do usuário é criptografada com ajuda do bcrypt e persistida junto com email no banco de dados. No momento do login é gerado um token, que expira em tempo determinado, forçando o usuário a refazer o login. Esse mesmo token facilita a identificação do usuário como administrador, impedindo o acesso a algumas rotas, criação ou modificação de arquivos. 
# 
# 
- [x] Project Description
- [x] Run App
- [ ] Finish App
# 
# 
1. Baixar e instalar dependência node_modules:

 - diretório: ./backend
 > npm install

 - diretório: ./frontend
 > npm install
# 
# 
2. Criar e configurar arquivo oculto .env, baseado com o arquivo modelo env_file:
 - diretório: ./backend/.env
 - diretório: ./backend/.env_file
# 
# 
3. Criar as migrations:
 - diretório: ./backend
 > npx knex.migrate:latest
# 
# 
4. Colocando para funcionar backend e Bancos de Dados:
 
 - É recomendo abrir no mínino três aba no terminal, uma para cada um desses comandos abaixo:

 - diretório: ./backend

 > sudo psql -U postgres (necessita de postgres client instalado)

 > sudo mongod (necessita do mongo client instalado)

 > npm start (esse deve ser o último comando)
# 
# 
5. Colocando o frontend para funcionar:

  - diretório: ./frontend
  > sudo npm start
# 
# 

6. App Finalizado. Ainda existem pequenas melhorias que foram proposta no arquivo "Melhorias.txt". 

- [x] Project Description
- [x] Run App
- [x] Finish App

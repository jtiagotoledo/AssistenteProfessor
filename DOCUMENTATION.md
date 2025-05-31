# AssistenteProfessor

Este é um aplicativo desenvolvido com React Native para auxiliar o professor nas tarefas diárias.

# Estruturas de pastas

src/
├── components/    # Componentes reutilizáveis
├── telas/         # Telas principais
├── banco_dados/   # Consultas ao DB
├── utils/         # Funções utilitárias
├── assets/        # Imagens, fontes etc.
├── data/          # Cores, estados context etc.
├── listas/        # Listas de períodos, classes e alunos.
├── modais/        # Telas de modais.
├── locales/       # Arquivos de tradução.
├── rotas/         # Rotas para as telas.
├── services/      # Comunicação com a api backend.
App.js             # Ponto de entrada da aplicação.

# Banco de dados

Inicialmente usei o firebase e por conta da demanda migrei para o banco de dados pessoal em servidor doméstico com MariaDB.

# Api

Registrado domínio como:
https://assistente-professor.duckdns.org
Porta de acesso: 3000

# versões 
1.0.0 - versão inicial (rejeitada na play Store).
1.1.0 - versão inicial.
1.2.0 - login com google.
1.3.0 - tradução para o Inglês.
1.4.0 - banco de dados mariadb - ubuntu server.
1.5.0 - Implementado token JWT.

# Autor
José Tiago Toledo da Silva 
github.com/jtiagotoledo

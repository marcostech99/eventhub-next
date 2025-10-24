# EventHub-Next

Este é um projeto para buscar e visualizar eventos, utilizando a API da Ticketmaster.

## Como usar

### Pré-requisitos

*   Node.js (versão 20 ou mais recente)

### Instalação

2.  Instale as dependências:
    ```bash
    pnpm install
    ```

### Configuração

Para usar a API da Ticketmaster, você precisa de uma chave de API.

1.  Acesse o site [Ticketmaster Developer](https://developer.ticketmaster.com/) e crie uma conta.
2.  Crie uma nova aplicação para obter sua chave de API.
3.  Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave de API:
    ```
    NEXT_PUBLIC_TICKETMASTER_API_KEY=sua_chave_de_api
    ```

### Rodando a aplicação

Para iniciar o servidor de desenvolvimento, execute:

```bash
pnpm dev
```

Abra [http://localhost:3000] no seu navegador para ver o resultado.

### Outros comandos

*   `pnpm build`: Gera a versão de produção do projeto.
*   `pnpm start`: Inicia o servidor de produção.
*   `pnpm test`: Executa os testes.

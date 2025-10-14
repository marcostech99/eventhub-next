# 1 Chave de API Hardcoded (ticketmasterApi.js)
 
 A chave da API do Ticketmaster está diretamente codificada no arquivo.
 
 A chave da API deve ser movida para uma variável de ambiente. 

# 2 Filtro de Preço Não Funcional (SearchPage.jsx e ticketmasterApi.js)

O filtro de preço ("Gratuito" / "Pago") na página de busca, que é controlado pelo componente `EventFilters`, não tem efeito sobre os resultados da busca.

Em `SearchPage.jsx`, o valor do filtro `priceRange` não é incluído nos `URLSearchParams` ao chamar `handleFilterChange`.

Em `ticketmasterApi.js`, a função `fetchEvents` não possui lógica ou parâmetros para traduzir o filtro de preço em uma requisição válida para a API do Ticketmaster (que suporta filtros como `priceRangeId` ou `minPrice`/`maxPrice`).

# 3 Limpeza Incorreta da Função Debounce (SearchBar.jsx)

No `useEffect` do `SearchBar`, a função de limpeza (`return () => { clearTimeout(debouncedSearch); };`) tenta limpar o `debouncedSearch` diretamente. 

No entanto, `debouncedSearch` é a *função* debounced, não o ID do timer retornado por `setTimeout`.

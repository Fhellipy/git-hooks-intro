import { useState, useEffect } from "react";

function App() {
  //      get/Busca      set/Altera o valor do get
  const [repositories, setRepositories] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    /**
     * Método responsável por fazer requisições na api
     * E insere esse resultado na variável repositories
     * Altera o valor
     */
    const fetchFromGithub = async () => {
      // Requisição na api do git
      const url = "https://api.github.com/users/diego3g/repos";
      const response = await fetch(url);
      const data = await response.json();

      // altera o valor de repositories
      setRepositories(data);
    };

    fetchFromGithub();
  }, []);

  useEffect(() => {
    //Busca quantos favoritos tem o usuário
    const filtered = repositories.filter((repo) => repo.favorite);

    //Muda o titulo da página
    document.title = `Você tem ${filtered.length} favoritos`;
  }, [repositories]);

  useEffect(() => {
    /**
     * Método responsável por buscar a latitude e a longitude do usuário
     */
    const watchId = navigator.geolocation.watchPosition(handlePositionReceived);

    /**
     * Desmonta a aplicação de localização
     * Componente unmount
     */
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  function handlePositionReceived(coords) {
    /**
     * Desestrutura o parâmetro coords
     */
    const { latitude, longitude } = coords.coords;

    /**
     * Seta o valor da latitude e da longitude do usuário
     */
    setLocation({ latitude, longitude });
  }

  /**
   * Método responsável por favoritar/desfavoritar uma requisição
   */
  function handleFavorite(id) {
    const newRepositories = repositories.map((repo) => {
      /**
       * Se repo.id for = a id
       * Retorne repo e adicone o campo favorite com um valor boolean dinâmico
       * Se não retorne somente repo
       */
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo;
    });

    /**
     * Seta o novo valor de repositories
     * Adicionando o novo campo
     */
    setRepositories(newRepositories);
  }

  return (
    <>
      <div>
        <span>Localização</span>
        <br />
        Latitude: {location.latitude} <br />
        Longitude: {location.longitude}
      </div>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>
            {repo.name}
            {/* Criar um span se repo.favorite for true */}
            {repo.favorite && <span>(Favorito)</span>}
            <button onClick={() => handleFavorite(repo.id)}>Favoritar</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export { App };



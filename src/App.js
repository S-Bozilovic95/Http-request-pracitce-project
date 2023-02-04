import React, { useCallback, useEffect, useState } from "react";
import API from "./api/api";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.get("movies.json");
      const loadedMovies = [];

      for (const key in response.data) {
        loadedMovies.push({
          id: key,
          title: response.data[key].title,
          openingText: response.data[key].openingText,
          releaseDate: response.data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError("Something went wrong! ");
    }
    setIsLoading(false);
  }, []);

  // axios post method
  // headers je proizvoljni prop koji prosledjujem radi lakse
  // indentifikacije, nije obavezan
  const addMovieHandler = async (movie) => {
    const response = await API.post("movies.json", movie, {
      headers: { "Content-Type": "application/json" },
    });
  };

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>No Results</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;

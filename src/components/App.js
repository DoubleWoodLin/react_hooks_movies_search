import React, { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const MOVIE_API_URL = "https://www.omdbapi.com/?s=island&apikey=9abcca03";
const SEARCH = "MOVIE_SEARCH_REQUEST";
const SUCESS = "MOVIE_SEARCH_SUCESS";
const FAIL = "MOVIE_SEARCH_FAIL";

const intialState = {
  loading: true,
  movies: [],
  errorMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case SUCESS:
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, intialState);

  useEffect(() => {
    async function fetchData() {
      let response = await fetch(MOVIE_API_URL);
      response = await response.json();
      dispatch({
        type: SUCESS,
        payload: response.Search,
      });
    }
    fetchData();
  }, []);

  const search = async (searchValue) => {
    dispatch({
      type: SEARCH,
    });
    try {
      let response = await fetch(
        `https://www.omdbapi.com/?s=${searchValue}&apikey=9abcca03`
      );
      response = await response.json();
      if (response.Response === "True") {
        dispatch({
          type: SUCESS,
          payload: response.Search,
        });
      } else {
        dispatch({
          type: FAIL,
          errorMessage: response.Error,
        });
      }
    } catch (error) {
      alert(error);
      dispatch({
        type: FAIL,
        errorMessage: `${error.name}: ${error.message}`,
      });
    }
  };

  return (
    <div className="App">
      <Header text="MOVIE SEARCH" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movies</p>
      <div className="movies">
        {state.loading && !state.errorMessage ? (
          <span>loading...</span>
        ) : state.errorMessage ? (
          <div className="errorMessage">{state.errorMessage}</div>
        ) : (
          state.movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;

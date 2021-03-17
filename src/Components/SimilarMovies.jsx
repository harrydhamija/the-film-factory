// SimilarMovies
import { Link } from 'react-router-dom';
import firebase from './firebase.js';
import { useState, useEffect } from 'react';
import getSimilarMovies from './getSimilarMovies';
import MovieCard from './MovieCard';

const SimilarMovies = ({ searchedMovie, id, recommendedArray, setRecommendedArray }) => {
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [selectedArray, setSelectedArray] = useState([])
  // const [recommendedArray, setRecommendedArray] = useState([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (id) {
      // clear the movie suggestions(array) displayed from previous query.
      // setMovieSuggestions([]);
      getSimilarMovies(id, setMovieSuggestions, setLoading);
      setLoading(true);
    }
  }, [id]);

  const addToRecommendedArray = (movie) => {


    let repeatedMovie = false;
    recommendedArray.forEach((selectedMovie) => {
      if (selectedMovie.id === movie.id) {
        repeatedMovie = true;
        const cursor = recommendedArray.indexOf(selectedMovie);
        const selectedCursor = selectedArray.indexOf(selectedMovie.id)
        const tempSelectArray = [...selectedArray]
        const tempArray = [...recommendedArray];
        tempSelectArray.splice(selectedCursor, 1);
        setSelectedArray(tempSelectArray);
        tempArray.splice(cursor, 1);
        setRecommendedArray(tempArray);
      }
    });

    if (!repeatedMovie) {

      if (recommendedArray.length === 3) {
        alert('You have selected the maximum of 3 movies.');
        const tempArray = [...recommendedArray].slice(0, 3);
        setRecommendedArray(tempArray);
      } else {
        setSelectedArray([...selectedArray, movie.id]);
        setRecommendedArray([...recommendedArray, {
          title: movie.title,
          year: movie.year,
          language: movie.language,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          id: movie.id
        }]);
      }

    }




  };

  const pushPairToFirebase = () => {

    const usersMovie = {
      title: searchedMovie.title,
      poster: `https://image.tmdb.org/t/p/w500${searchedMovie.poster_path}`,
      id: searchedMovie.id,
      year: searchedMovie.release_date.slice(0, 4)
    }

    console.log(usersMovie, recommendedArray);

    const dbRef = firebase.database().ref();

    recommendedArray.forEach(movie => {

      dbRef.push({
        searchedMovie: usersMovie,
        similarMovie: movie
      })

    })

  }

  return (
    <div className="matchedMovies foreign">
      <h2>Foreign Language Films You Might Like</h2>

      <div className="saveMoviesRow">
        <h3>Add up to three films to the saved list.</h3>
        <Link to="/allTimeResults">
          <button onClick={pushPairToFirebase}>Save</button>
        </Link>
      </div>

      <div className="lowerMovieCardContainer">

        {loading
        ?<div className="resultsStatus">
          <div class="loadingBar">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        :movieSuggestions.length
          ?movieSuggestions.map((movie) => {
            return (
              <MovieCard
                selectedArray={selectedArray}
                key={movie.id}
                movie={movie}
                setSearchedMovie={(e) => addToRecommendedArray(e, movie)}
                setRecommendedArray={setRecommendedArray}
                setShowSuggestedFilms={() => void 0}>
                <p>{movie.language}</p>
              </MovieCard>
            );
          })
          :<div className="resultsStatus">
            <p>No recommended movies available.</p>
          </div>
          }
      </div>


    </div>
  );
};

export default SimilarMovies;

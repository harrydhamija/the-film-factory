// MovieCard

const MovieCard = ({ movie, setSearchedMovie, children }) => {

    const handleClick = () => {
        setSearchedMovie(movie);
    }

 
    return (
        <div className="movieCard" onClick={handleClick}>
            
            {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster for ${movie.title}`}></img>}
            <h3>{movie.title}</h3>

            {movie.release_date && <h4>({movie.release_date.slice(0, 4)})</h4>}
            
            {children}
            

        </div>
    )
}

export default MovieCard;
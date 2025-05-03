import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_ACCESS_TOKEN}`,
	},
};

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [movieList, setMovieList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchMovies = (query = "") => {
		setErrorMessage("");
		setMovieList([]);
		setIsLoading(true);

		const endpoint = `${API_BASE_URL}/${
			query
				? `search/movie?query=${encodeURIComponent(query)}`
				: "discover/movie?sort_by=popularity.desc"
		}`;
		fetch(endpoint, API_OPTIONS)
			.then((response) => response.json())
			.then((data) => setMovieList(data.results))
			.catch((error) => {
				console.log(error);
				setErrorMessage(
					"Error occurs while loading movies. Please try again later."
				);
			})
			.finally(() => setIsLoading(false));
	};

	useEffect(() => fetchMovies(searchTerm), [searchTerm]);

	return (
		<main>
			<div className="pattern" />

			<div className="wrapper">
				<header>
					<img src="/hero-fg.png" alt="Hero Banner" />
					<h1 className="font-awesome">
						Find <span className="text-gradient">Movies</span>{" "}
						You'll Enjoy Without the Hassle
					</h1>
					<Search
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</header>

				<section className="all-movies">
					<h2 className="mt-10 font-awesome">All movies</h2>

					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movieList.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}

export default App;

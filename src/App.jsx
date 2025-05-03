import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import TrendingCard from "./components/TrendingCard";

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
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	const [isTrendingLoading, setIsTrendingLoading] = useState(false);
	const [trendingMovies, setTrendingMovies] = useState([]);

	const [isPopularLoading, setIsPopularLoading] = useState(false);
	const [movieList, setMovieList] = useState([]);

	const fetchPopularMovies = (signal, query = "") => {
		setIsPopularLoading(true);

		const endpoint = `${API_BASE_URL}/${
			query
				? `search/movie?query=${encodeURIComponent(query)}`
				: "discover/movie?sort_by=popularity.desc"
		}`;
		fetch(endpoint, { ...API_OPTIONS, signal })
			.then((response) => response.json())
			.then((data) => {
				setMovieList(data.results);
				if (query && data.results.length > 0) {
					updateSearchCount(data.results[0]);
				}
			})
			.catch((error) => {
				console.log(error);
				setMovieList([]);
			})
			.finally(() => setIsPopularLoading(false));
	};

	const fetchTrendingMovies = () => {
		setIsTrendingLoading(true);
		getTrendingMovies()
			.then((movies) => setTrendingMovies(movies))
			.catch((error) => {
				console.log(error);
				setTrendingMovies([]);
			})
			.finally(() => setIsTrendingLoading(false));
	};

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

	useEffect(() => {
		const controller = new AbortController();
		fetchPopularMovies(controller.signal, debouncedSearchTerm);

		return () => controller.abort();
	}, [debouncedSearchTerm]);

	useEffect(() => fetchTrendingMovies(), []);

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

				{trendingMovies.length > 0 && (
					<section className="trending">
						<h2 className="font-awesome">Trending Movies</h2>

						{isTrendingLoading ? (
							<Spinner />
						) : (
							<ul>
								{trendingMovies.map((movie, index) => (
									<li key={movie.id}>
										<TrendingCard
											index={index}
											movie={movie}
										/>
									</li>
								))}
							</ul>
						)}
					</section>
				)}

				<section className="all-movies">
					<h2 className="font-awesome">Popular Movies</h2>

					{isPopularLoading ? (
						<Spinner />
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

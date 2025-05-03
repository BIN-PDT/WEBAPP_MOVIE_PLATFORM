const TrendingCard = ({ index, movie: { movie_id, poster_url } }) => {
	return (
		<>
			<p>{index + 1}</p>
			<img src={poster_url} alt={movie_id} />
		</>
	);
};

export default TrendingCard;

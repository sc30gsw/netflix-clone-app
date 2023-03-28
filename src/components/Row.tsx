import { useState, useEffect } from "react";
import instance from "../axios";
import "./Row.scss";

type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};

type Movie = {
  id: number;
  name: string;
  title: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await instance.get(fetchUrl);
      console.log(response);

      setMovies(response.data.results);
    };
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="row netflix-row">
      <h2>{title}</h2>
      <div className="row-posters">
        {/* ポスターコンテンツ */}
        {movies.map((movie, i) => (
          <img
            key={movie.id}
            className={`row-poster ${isLargeRow ? "row-poster-large" : ""}`}
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/${isLargeRow ? "w500" : "w300"}${
                    movie.poster_path
                  }`
                : "https://via.placeholder.com/500x750?text=Image+Not+Found"
            }
            alt={movie.name}
          />
        ))}
      </div>
    </div>
  );
};

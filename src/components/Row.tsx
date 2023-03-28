import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import Modal from "react-modal";
import instance from "../axios";
import "./scss/Row.scss";

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

type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#000000",
    padding: "0",
    border: "none",
    borderRadius: "10px",
    maxWidth: "700px",
    width: "90%",
    maxHeight: "90%",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  },
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await instance.get(fetchUrl);

      setMovies(
        response.data.results.map((movie: Movie) => ({
          ...movie,
        }))
      );
    };
    fetchData();
  }, [fetchUrl]);

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = async (movie: Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      const trailerurl = await instance.get(
        `/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTrailerUrl(null);
  };

  return (
    <div className="row netflix-row">
      <h2>{title}</h2>
      <div className="row-posters">
        {/* ポスターコンテンツ */}
        {movies.map((movie) => (
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
            onClick={() => handleClick(movie)}
          />
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Trailer Modal"
      >
        <div className="modal-header">
          {" "}
          <h2>{movies.length > 0 && movies[0].name}</h2>
          <button className="modal-close-btn" onClick={closeModal}>
            X
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {trailerUrl ? (
            <YouTube videoId={trailerUrl} opts={opts} />
          ) : (
            <img
              src={
                movies.length > 0
                  ? `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`
                  : "https://via.placeholder.com/500x750?text=Image+Not+Found"
              }
              alt={movies.length > 0 ? movies[0].name : ""}
              className="modal-poster"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

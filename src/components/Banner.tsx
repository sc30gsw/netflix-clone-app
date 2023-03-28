import React, { useState, useEffect } from "react";
import instance from "../axios";
import { requests } from "../request";
import "./scss/Banner.scss";

type movieProps = {
  title?: string;
  name?: string;
  orignal_name?: string;
  backdrop_path?: string;
  overview?: string;
};

export const Banner = () => {
  const [movie, setMovie] = useState<movieProps>({});
  useEffect(() => {
    const fetchData = async () => {
      const request = await instance.get(requests.feachNetflixOriginals);
      console.log(request.data.result);

      //apiからランダムで値を取得している
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    };
    fetchData();
  }, []);

  const handleClick = () => {
    const fetchData = async () => {
      const request = await instance.get(requests.feachNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      document.querySelector(".Banner")?.classList.add("change");
      setTimeout(() => {
        document.querySelector(".Banner")?.classList.remove("change");
      }, 500);
    };
    fetchData();
  };
  console.log(movie);

  // descriptionの切り捨てよう関数
  const truncate = (str: any, n: number) => {
    // undefinedを弾く
    if (str !== undefined) {
      return str.length > n ? str?.substr(0, n - 1) + "..." : str;
    }
  };

  return (
    <header
      className="Banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="Banner-contents">
        <h1 className="banner-title">
          {movie?.title || movie?.name || movie?.orignal_name}
        </h1>
        <div className="Banner-buttons">
          <button className="Banner-button">Play</button>
          <button className="Banner-button">My List</button>
          <button className="Banner-button" onClick={handleClick}>
            change
          </button>
        </div>

        <h1 className="Banner-description">{truncate(movie?.overview, 150)}</h1>
      </div>

      <div className="Banner-fadeBottom" />
    </header>
  );
};

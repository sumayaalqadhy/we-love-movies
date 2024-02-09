const knex = require("../db/connection");

const getAllTheaters = () => {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("*")
    .then(data => data.reduce((acc, item) => {
      let theater = acc.find(theater => theater.theater_id === item.theater_id);

      const movie = {
        movie_id: item.movie_id,
        title: item.title,
        runtime_in_minutes: item.runtime_in_minutes,
        rating: item.rating,
        description: item.description,
        image_url: item.image_url,
        is_showing: item.is_showing,
        theater_id: item.theater_id,
      };

      if (!theater) {
        theater = {
          theater_id: item.theater_id,
          name: item.name,
          address_line_1: item.address_line_1,
          address_line_2: item.address_line_2,
          city: item.city,
          state: item.state,
          zip: item.zip,
          movies: [],
        };
        acc.push(theater);
      }

      theater.movies.push(movie);

      return acc;
    }, []));
};

const list = () => getAllTheaters();

module.exports = {
  list,
};

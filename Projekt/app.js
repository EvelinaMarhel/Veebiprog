const API_KEY = "9b9f9a8f-a52f-4bd7-9566-92ab9d4792ab";   /* авторризация на сайте, чтобы получать ключи */
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";   /* ссылка на нужные API */
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";   /* API для поиска фильмов */

getMovies(API_URL_POPULAR);

  /* функция, совершает запрос и принимает данные */
async function getMovies(url) {
  const resp = await fetch(url, {   /* fetch посылает запрос и возвращает ответ*/
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  /* вызываем функцию */  
  const respData = await resp.json();
  showMovies(respData);
}

  /* разноцветный индикатор по рейтингу фильма */
function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}
  /* отображение карточек с фильмами */
function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  // Очищаем предыдущие фильмы
  document.querySelector(".movies").innerHTML = "";

    /* создаём карточку */
  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");   /* возвращает псевдомассив, содержащий все классы элемента */
    movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu}"   /* если не загрузится, то при наведение появится имя */
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`
        )}</div>
        ${
          movie.rating &&   /* убрали undefined в рейтинге */
          `
        <div class="movie__average movie__average--${getClassByRate(
          movie.rating
        )}">${movie.rating}</div>
        `
        }
      </div>
        `;
    moviesEl.appendChild(movieEl);   /* собрали див и добавили массив в movieEl */
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");   /* тут лежит фильм, который написали в поиск */

  /* чтобы не было перезагрузки страницы */
form.addEventListener("submit", (e) => {
  e.preventDefault();

    /* ищем фильм */
  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);   /* если мы ввели что-то в поиск, то нужно вызвать функцию getMovies и передаём в неё ссылку для поиска */

      /* запрос поиска обнуляется после запроса */
    search.value = "";
  }
});
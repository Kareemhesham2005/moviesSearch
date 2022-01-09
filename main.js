let api;
let movie;

document.querySelector("input").addEventListener("change", () => {
  movie = document.querySelector("input").value;
  api = `https://api.themoviedb.org/3/search/movie?api_key=345b387d09c0dedc6f7e22cd662f0656&query=${movie}`;
  getMovie(api);
});

async function getMovie(api) {
  const response = await fetch(api);
  const data = await response.json();
  postData(data);
}

function postData(data) {
  document.querySelector(".content").innerHTML = "";
  data.results.forEach((el) => {
    let image = `https://image.tmdb.org/t/p/w500${el.poster_path}`;
    let title = el.title;
    let adult = el.adult;
    let date = el.release_date;
    let overview = el.overview;
    let voteAvg = el.vote_average;
    let voteCount = el.vote_count;
    let id = el.id;
    postMovies(image, title, date, overview, id, voteAvg, voteCount);
  });
}

function postMovies(image, title, date, overview, id, voteAvg, voteCount) {
  let box = document.createElement("div");
  box.setAttribute("class", "box");

  box.innerHTML = `
  <div class = "image">
    <img src = "${image}" />
  </div>
  <h3>${title}</h3>
  <p>${overview}</p>
  <p>${date}</p>
  `;
  document.querySelector(".content").appendChild(box);

  box.onclick = () => {
    getMovieDetails(id);
    async function getMovieDetails(id) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=345b387d09c0dedc6f7e22cd662f0656`
      );
      const data = await res.json();
      postMovieDetails(data);
    }
    function postMovieDetails(data) {
      let gen2 = "";
      let production = "";
      data.genres.forEach((gen, index) => {
        if (index == data.genres.length - 1) {
          gen2 += gen.name;
        } else {
          gen2 += `${gen.name}, `;
        }
      });
      data.production_companies.forEach((producer, index) => {
        if (index == data.production_companies.length - 1) {
          production += producer.name;
        } else {
          production += `${producer.name}, `;
        }
      });
      let page = document.createElement("div");
      document.querySelector(".search").style.display = "none";
      document.querySelector(".content").style.display = "none";
      let loader = setInterval(() => {
        document.querySelector(".preLoader").style.display = "none";
      }, 2000);
      page.innerHTML = `
      <div class="preLoader">
        <img src = "./loader.gif" />
      </div>
      <div class = "icon">
      <span class = "one"></span>
      <span class = "two"></span>
      </div>
        <div class = "pageImage">
          <img src = "${image}" />
       </div>
      <div class = "pageContent">
      <h3>${title}</h3>
      <div class = "info">
      <p>${(data.runtime / 60).toFixed(1)}h</p>
      <p>${date}</p>
      <p>${gen2}</p>
      </div>
      <p>${overview}</p>
      <p>Rating: ${voteAvg}</p>
      <p>${voteCount} Voted</p>
      <h4>PRODUCED BY: </h4>
      <p>${production}</p>
      </div>
        `;
      page.setAttribute("class", "page");
      document.querySelector("body").appendChild(page);
      document.querySelector(".icon").onclick = () => {
        clearInterval(loader);
        document
          .querySelector("body")
          .removeChild(document.querySelector(".page"));
        document.querySelector(".search").style.display = "flex";
        document.querySelector(".content").style.display = "grid";
      };
    }
  };
}

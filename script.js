/* *************** Fetch Async/Await API Pokemon *************** */
/* hacer una referencia a donde se hará la inserción de la información */
const $sectionContent = document.getElementById("section-content");
const $sectionLinks = document.getElementById("section-links");
const $sectionPokemon = document.getElementById("section-pokemon");

/* hacer una referencia al contenido del template para después hacer una copia de ese contenido para trabajar sobre el mismo y tener un fragmento donde se hará toda la inserción para luego renderizar una sola vez al DOM */
const $templateNavbar = document.getElementById("template-navbar").content;
const $copyTemplateNavbar = $templateNavbar.cloneNode(true);
const $fragmentTemplateNavbar = document.createDocumentFragment();

/* hacer una referencia al contenido del template para después hacer una copia de ese contenido para trabajar sobre el mismo y tener un fragmento donde se hará toda la inserción para luego renderizar una sola vez al DOM */
const $templatePokemon = document.getElementById("template-pokemon").content;
const $copyTemplatePokemon = $templatePokemon.cloneNode(true);
const $fragmentTemplatePokemon = document.createDocumentFragment();

const $loader = document.getElementById("loader");

let pokeAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemons(url) {
  try {
    $loader.classList.remove("none");

    let respuesta = await fetch(url);
    // console.log(respuesta);
    let json = await respuesta.json();
    // console.log(json);

    let $prevLink;
    let $nextLink;

    if (!respuesta.ok)
      throw { status: respuesta.status, statusText: respuesta.statusText };

    /* **************************************************************************************************** */
    for (let i = 0; i < json.results.length; i++) {
      try {
        let respuesta = await fetch(json.results[i].url);
        // console.log(respuesta);
        let pokemonJSON = await respuesta.json();
        // console.log(pokemonJSON);

        if (!respuesta.ok)
          throw { status: respuesta.status, statusText: respuesta.statusText };

        /* ********** OBTENIENDO DATOS DE LA API ********** */
        $copyTemplatePokemon.getElementById("pokemon-image").src =
          pokemonJSON.sprites.front_default;
        $copyTemplatePokemon.getElementById("pokemon-image").alt =
          pokemonJSON.name;
        $copyTemplatePokemon.getElementById("pokemon-image").title =
          pokemonJSON.name;
        $copyTemplatePokemon.getElementById("pokemon-name").textContent =
          pokemonJSON.name.toUpperCase();

        $copyTemplatePokemon.getElementById("pokemon-hp").textContent =
          pokemonJSON.stats[0].stat.name.toUpperCase() +
          " " +
          pokemonJSON.stats[0].base_stat;
        $copyTemplatePokemon.getElementById("pokemon-attack").textContent =
          pokemonJSON.stats[1].stat.name.toUpperCase() +
          " " +
          pokemonJSON.stats[1].base_stat;
        $copyTemplatePokemon.getElementById("pokemon-defense").textContent =
          pokemonJSON.stats[2].stat.name.toUpperCase() +
          " " +
          pokemonJSON.stats[2].base_stat;

        $copyTemplatePokemon.getElementById("pokemon-weight").textContent =
          "WEIGHT" + " " + pokemonJSON.weight;
        $copyTemplatePokemon.getElementById("pokemon-height").textContent =
          "HEIGHT" + " " + pokemonJSON.height;

        if (pokemonJSON.types.length === 1) {
          $copyTemplatePokemon.getElementById("pokemon-type").textContent =
            "TYPE" + " " + pokemonJSON.types[0].type.name.toUpperCase();
        } else if (pokemonJSON.types.length === 2) {
          $copyTemplatePokemon.getElementById("pokemon-type").textContent =
            "TYPE" +
            " " +
            pokemonJSON.types[0].type.name.toUpperCase() +
            " / " +
            pokemonJSON.types[1].type.name.toUpperCase();
        }
        /* ************************************************ */

        let $cloneTemplatePokemon = document.importNode(
          $copyTemplatePokemon,
          true
        );
        $fragmentTemplatePokemon.appendChild($cloneTemplatePokemon);
      } catch (error) {
        // console.log(error);

        /* ****** SI HAY ERROR AL OBTENER DATOS POR CADA POKEMON ****** */
        $copyTemplatePokemon.getElementById("pokemon-image").src = "";
        $copyTemplatePokemon.getElementById("pokemon-image").alt =
          "Error al mostrar la información";
        $copyTemplatePokemon.getElementById("pokemon-image").title =
          "Error al mostrar la información";
        $copyTemplatePokemon.getElementById("pokemon-name").textContent =
          "Error al mostrar la información";

        $copyTemplatePokemon.getElementById("pokemon-hp").textContent = "HP -";
        $copyTemplatePokemon.getElementById("pokemon-attack").textContent =
          "ATTACK -";
        $copyTemplatePokemon.getElementById("pokemon-defense").textContent =
          "DEFENSE -";

        $copyTemplatePokemon.getElementById("pokemon-weight").textContent =
          "WEIGHT -";
        $copyTemplatePokemon.getElementById("pokemon-height").textContent =
          "HEIGHT -";

        $copyTemplatePokemon.getElementById("pokemon-type").textContent =
          "TYPE -----";
        /* ************************************************************ */

        let $cloneTemplatePokemon = document.importNode(
          $copyTemplatePokemon,
          true
        );
        $fragmentTemplatePokemon.appendChild($cloneTemplatePokemon);
      }
    }

    $loader.classList.add("none");

    /* alt + 174 =  « */
    /* alt + 175 =  » */
    $prevLink = json.previous
      ? `<a class="dark-link" href="${json.previous}">«</a>`
      : "";

    $nextLink = json.next
      ? `<a class="dark-link" href="${json.next}">»</a>`
      : "";

    $copyTemplateNavbar.getElementById("navbar").innerHTML =
      $prevLink + " " + $nextLink;

    let $cloneTemplateNavbar = document.importNode($copyTemplateNavbar, true);
    $fragmentTemplateNavbar.appendChild($cloneTemplateNavbar);

    $sectionLinks.appendChild($fragmentTemplateNavbar);
    $sectionPokemon.appendChild($fragmentTemplatePokemon);

    /* **************************************************************************************************** */
  } catch (error) {
    // console.log(error);
    $loader.classList.add("none");

    let message =
      error.statusText || "Ocurrió un error al mostrar la información";

    /* si "error.status" es "true", es decir, si es que tiene algún valor entonces....... */
    error.status
      ? ($sectionContent.innerHTML = `<p class="message-incorrect">Error ${error.status}: ${message}</p>`)
      : ($sectionContent.innerHTML = `<p class="message-incorrect">${message}</p>`);
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  loadPokemons(pokeAPI_URL);
  scrollTopButton();
});

$sectionLinks.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    e.preventDefault();
    $sectionLinks.innerHTML = "";
    $sectionPokemon.innerHTML = "";
    loadPokemons(e.target.getAttribute("href"));
  }
});

/* *************** Dark Theme *************** */
function darkTheme() {
  const $themeBtn = document.getElementById("dark-theme-btn");
  const $bodyBg = document.getElementById("body-bg");
  const $scrollBtn = document.getElementById("scroll-top-btn");

  let moon = "🌙";
  let sun = "☀️";

  const lightMode = () => {
    $sectionLinks.classList.remove("dark-mode");
    $sectionPokemon.classList.remove("dark-mode");
    $bodyBg.classList.remove("body-bg");
    $themeBtn.classList.remove("btn-bg");
    $scrollBtn.classList.remove("btn-bg");
    $loader.querySelectorAll(".wave").forEach((waveElement) => {
      waveElement.classList.remove("loader-color");
    });

    $themeBtn.textContent = moon;
    localStorage.setItem("theme", "light");
  };

  const darkMode = () => {
    $sectionLinks.classList.add("dark-mode");
    $sectionPokemon.classList.add("dark-mode");
    $bodyBg.classList.add("body-bg");
    $themeBtn.classList.add("btn-bg");
    $scrollBtn.classList.add("btn-bg");
    $loader.querySelectorAll(".wave").forEach((waveElement) => {
      waveElement.classList.add("loader-color");
    });

    $themeBtn.textContent = sun;
    localStorage.setItem("theme", "dark");
  };

  $themeBtn.addEventListener("click", (e) => {
    // console.log($themeBtn.textContent);
    if ($themeBtn.textContent === moon) {
      darkMode();
    } else {
      lightMode();
    }
  });

  document.addEventListener("DOMContentLoaded", (e) => {
    // cuando se cargue la página e independientemente del funcionamiento del click de la luna o el sol, queremos que cuando cargue el navegador vaya y pregunte al localStorage si existe una variable que controla si estamos con el tema oscuro o no y en base a eso aplique los estilos correspondientes
    if (localStorage.getItem("theme") === null) {
      // localStorage.getItem() es para obtener una variable del localStorage en donde "null" es cuando no hay niguna variable y es su valor por defecto
      localStorage.setItem("theme", "light"); // localStorage.setItem() asigna un valor al localStorage, tiene dos parámetros localStorage.setItem(llave o propiedad, valor de la llave)
    }

    if (localStorage.getItem("theme") === "light") {
      lightMode();
    }
    if (localStorage.getItem("theme") === "dark") {
      darkMode();
    }
  });
}

darkTheme();

/* *************** Scroll Top Button *************** */
function scrollTopButton() {
  const $scrollBtn = document.getElementById("scroll-top-btn");

  window.addEventListener("scroll", (e) => {
    /* distancia que se recorrió desde "top = 0" en pixeles, si el navegador no soporta ".pageYOffset" entonces usará ".documentElement.scrollTop" */
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // console.log(window.pageYOffset, document.documentElement.scrollTop);

    if (scrollTop > 400) {
      // si a más de 400 pixeles entonces....
      $scrollBtn.classList.remove("hidden");
    } else {
      // si a menos de 400 pixeles entonces....
      $scrollBtn.classList.add("hidden");
    }
  });

  $scrollBtn.addEventListener("click", (e) => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
      left: 0,
    });
  });
}

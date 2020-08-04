const apiKey = 'lKgvTS2XrODBkhDKQoEVhbT20xiE8G0f';
const urlRandom = 'https://api.giphy.com/v1/gifs/random?api_key=lKgvTS2XrODBkhDKQoEVhbT20xiE8G0f&tag=&rating=g';
const urlSearch = 'https://api.giphy.com/v1/gifs/search?api_key=lKgvTS2XrODBkhDKQoEVhbT20xiE8G0f&q=';
const urlTrending = 'https://api.giphy.com/v1/gifs/trending?api_key=lKgvTS2XrODBkhDKQoEVhbT20xiE8G0f&limit=25';


// Constantes para manejar DOM
const sailorDay = document.querySelector('#sailorDay');
const sailorNight = document.querySelector('#sailorNight');
const changeTheme = document.querySelector('#change-theme');
const mostrarDesplegable = document.querySelector('#dropdown');
const desplegable = document.querySelector('#container-desplegable');
const divContenedoresGifSugerimos = document.getElementsByClassName('containerOfEachGifSuggest');
const contenedorSugBusqueda = document.getElementById('container-sug-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');
const sectionHoyTeSugerimos = document.getElementById('bloque-hoy-te-sugerimos');
const sectionSugerimos = document.getElementById('contenedor-sugerimos');
const sectionTendencias = document.querySelector('.section-tendencias-resultados');
const contenedorGifsTendencias = document.getElementById('container-tendencias');
const btnBuscar = document.getElementById('btn-buscar');
const lupa = document.getElementById('lupa');
const textoBuscar = document.getElementById('buscar-lupa');
const titleSearched = document.getElementById('contenido-titulo');
const btnVerMas = document.getElementsByClassName('boton-ver-mas');
const logo = document.getElementById('logo');
// NODOS PARA BLOQUE SUGERENCIA
const sug1 = document.getElementById('sug1');
const sug2 = document.getElementById('sug2');
const sug3 = document.getElementById('sug3');
const btnSuggest1 = document.getElementById('btn1');
const btnSuggest2 = document.getElementById('btn2');
const btnSuggest3 = document.getElementById('btn3');
const favicon = document.getElementById('favicon');
let themePick = localStorage.getItem('tema') || ('');
btnBuscar.disabled = true;


// FUNCION COMPLETAR SUGERENCIAS DESDE API BLOQUE SUGERENCIAS

const getSuggestString = async () => {
    if (inputBusqueda.value !== '') {
        const urlStringSuggest = 'http://api.giphy.com/v1/tags/related/' + inputBusqueda.value + '?api_key=' + apiKey;
        const stringData = await fetch(urlStringSuggest);
        const stringDataJSON = await stringData.json()

        let sugerencia1 = stringDataJSON.data[0].name;
        console.log('papapapa' + stringDataJSON.data[0].name)
        sug1.innerText = sugerencia1;
        let sugerencia2 = stringDataJSON.data[1].name;
        sug2.innerText = sugerencia2;
        let sugerencia3 = stringDataJSON.data[2].name;
        sug3.innerText = sugerencia3;

        console.log(stringDataJSON);
    }
    else {
        console.log('Lo siento no hay resultados')
    }

}


// FUNCION MOSTRAR / OCULTAR BLOQUE SUGERENCIAS
function validateWhiteInput() {
    if (inputBusqueda.value == '') {
        showOff();
    }
    else {
        showOn();
    }

}
//FUNCIONES CAMBIAR ESTILO BOTON BUSCAR

function changeButtonBuscarD() {

    let theme = localStorage.getItem('tema');


    if (inputBusqueda.value === '' && theme == 'day') {
        btnBuscar.disabled = true;
        lupa.src = './assets/lupa_inactive.svg';
        textoBuscar.style.color = '#B4B4B4'
    }
    else if ((inputBusqueda.value !== '' && theme == 'day')) {
        btnBuscar.disabled = false;
        btnBuscar.classList.add('button-buscar-on');
        textoBuscar.style.color = '#110038';
        lupa.src = './assets/lupa.svg';

    }

}
function changeButtonBuscarN() {

    let theme = localStorage.getItem('tema');

    if (inputBusqueda.value === '' && theme == 'night') {
        btnBuscar.disabled = true;
        lupa.src = './assets/Combined_Shape.svg';
        textoBuscar.style.color = '#8F8F8F';
    }
    else if (inputBusqueda.value !== '' && theme == 'night') {
        btnBuscar.disabled = false;
        btnBuscar.classList.add('button-buscar-on');
        textoBuscar.style.color = '#FFFFFF';
        lupa.src = './assets/lupa_light.svg';

    }

}


function search() {
    getSuggestString();
    validateWhiteInput();
    changeButtonBuscarD();
    changeButtonBuscarN();
}

function showOff() {
    contenedorSugBusqueda.style.display = 'none';
}
function showOn() {
    contenedorSugBusqueda.style.display = 'flex';
}



//   MOSTRAR BOTONES TEMAS

mostrarDesplegable.addEventListener('click', () => {
    desplegable.classList.toggle('hidden');
})

// FUNCIONES TEMAS CON LocalStorage

function validateThemes() {
    let theme = localStorage.getItem('tema');
    if (theme == 'day') {
        changeTheme.setAttribute('href', './styles/sailor-day.css');
        logo.src = './assets/gifOF_logo.png';
        favicon.href = './assets/gifOF_logo.png';
    }
    else {
        changeTheme.setAttribute('href', './styles/sailor-night.css')
        logo.src = './assets/gifOF_logo_dark.png';
        lupa.src = './assets/Combined_Shape.svg';
        favicon.href = './assets/gifOF_logo_dark.png';
    }
}
validateThemes();

//   CAMBIAR TEMAS
sailorDay.addEventListener('click', () => {
    changeTheme.setAttribute('href', './styles/sailor-day.css')
    desplegable.classList.toggle('hidden');
    themePick = localStorage.setItem('tema', 'day');
    logo.src = './assets/gifOF_logo.png';
    favicon.href = './assets/gifOF_logo.png';
});

sailorNight.addEventListener('click', () => {
    changeTheme.setAttribute('href', './styles/sailor-night.css')
    desplegable.classList.toggle('hidden');
    themePick = localStorage.setItem('tema', 'night');
    logo.src = './assets/gifOF_logo_dark.png';
    lupa.src = './assets/Combined_Shape.svg';
    textoBuscar.style.color = '#8F8F8F';
    favicon.href = './assets/gifOF_logo_dark.png';
});






//FUNCIONES PARA BUSQUEDA DE GIFS EN BOTONES

btnSuggest1.addEventListener('click', () => {
    let input = sug1.innerText;
    inputBusqueda.value = input;
    searchFunctions(input);
})

btnSuggest2.addEventListener('click', () => {
    let input = sug2.innerText;
    inputBusqueda.value = input;
    searchFunctions(input);
})

btnSuggest3.addEventListener('click', () => {
    let input = sug3.innerText;
    inputBusqueda.value = input;
    searchFunctions(input);
})

btnBuscar.addEventListener('click', () => {
    let input = inputBusqueda.value;
    searchFunctions(input);
})



// FUNCION GET SEARCH API

const searchFunctions = async (stringSearch) => {
    showOff();
    try {
        const dataGifSearch = await fetch(urlSearch + stringSearch + '&limit=24');
        const dataGifSearchJON = await dataGifSearch.json();
        console.log(dataGifSearchJON)
        contenedorGifsTendencias.innerHTML = '';
        sectionHoyTeSugerimos.style.display = 'none';
        titleSearched.innerText = stringSearch + ':';


        for (const iterator of dataGifSearchJON.data) {
            let containerGif = document.createElement('div');
            let gif = document.createElement('img');
            let tag = document.createElement('div');
            let stringTag = document.createElement('p');

            contenedorGifsTendencias.appendChild(containerGif);
            containerGif.appendChild(gif);
            containerGif.appendChild(tag);
            tag.appendChild(stringTag);

            containerGif.setAttribute('class', 'containerGifSearched');
            gif.setAttribute('class', 'styleOfGifs');
            gif.setAttribute('src', iterator.images.downsized.url);
            gif.setAttribute('alt', iterator.title);
            tag.setAttribute('class', 'tags');
            stringTag.setAttribute('class', 'font-tags');

            let dataTags = iterator.title.split(' ');

            for (each of dataTags) {
                stringTag.innerHTML += ' #' + each;
            }

            gif.addEventListener('mouseover', () => {
                tag.style.display = 'block';
            })
            gif.addEventListener('mouseout', () => {
                tag.style.display = 'none';
            })
        }
    } catch{
        console.log('Lo sentimos, no se encontraron resultados');
    }
}

//FUNCION BUSCAR CON ENTER

inputBusqueda.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        btnBuscar.click()
        showOff();
    }
})


//FUNCION MOSTRAR GIF HOY TE SUGERIMOS - 4 gifs random

const getSuggestGif = async () => {
    for (let i = 0; i < 4; i++) {
        const dataGif = await fetch(urlRandom);
        const dataGifJSON = await dataGif.json();
        console.log(dataGifJSON.data);

        let gif = document.createElement('img');
        divContenedoresGifSugerimos[i].appendChild(gif);
        gif.setAttribute('src', dataGifJSON.data.images.downsized.url);
        gif.setAttribute('class', 'styleOfGifs')

        btnVerMas[i].addEventListener('click', () => {
            let input = dataGifJSON.data.title;
            let alternativeInput = 'Funny GIF';
            if (input == '') {
                inputBusqueda.value = alternativeInput;
                searchFunctions(alternativeInput);
            }
            else {
                inputBusqueda.value = input;
                searchFunctions(input);
            }


        })

        const titlesRandom = document.getElementsByClassName('titulo-randoms');
        titlesRandom[i].innerText = '#' + dataGifJSON.data.title;
        if (dataGifJSON.data.title == '') {
            titlesRandom[i].innerText = '#' + 'Funny GIF';
        }
    }
}
getSuggestGif()


// MOSTRAR GIFS TENDENCIAS

const getTrendingGif = async () => {
    const dataGif = await fetch(urlTrending);
    const dataGifJSON = await dataGif.json();
    console.log(dataGifJSON);
    return dataGifJSON;
}

getTrendingGif()
    .then((res) => {
        for (let i = 0; i < 25; i++) {
            let contenedorGif = document.createElement('div');
            let gif = document.createElement('img');
            let tag = document.createElement('div');
            let stringTag = document.createElement('p');

            contenedorGifsTendencias.appendChild(contenedorGif);
            contenedorGif.appendChild(gif);
            contenedorGif.appendChild(tag);
            tag.appendChild(stringTag);

            contenedorGif.setAttribute('class', 'containerGifSearched');
            gif.setAttribute('src', res.data[i].images.downsized.url);
            gif.setAttribute('class', 'styleOfGifs');
            gif.setAttribute('alt', res.data[i].title);
            tag.setAttribute('class', 'tags');
            stringTag.setAttribute('class', 'font-tags');

            let dataTags = res.data[i].title.split(' ');
            for (each of dataTags) {
                stringTag.innerHTML += ' #' + each;
            }

            if (i % 5 == 0) {
                contenedorGif.style.width = '50%';
                tag.style.width = '97%';
            }
            // MOSTRAR / OCULTAR TAGS
            gif.addEventListener('mouseover', () => {
                tag.style.display = 'block';
            })
            gif.addEventListener('mouseout', () => {
                tag.style.display = 'none';
            })

        }
    })


/*Creado por Ariel Blaskovich - 2020 - Cordoba - Argentina*/
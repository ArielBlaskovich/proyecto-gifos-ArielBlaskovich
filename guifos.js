const apiKey = 'lKgvTS2XrODBkhDKQoEVhbT20xiE8G0f';
const apiUpload = 'https://upload.giphy.com/v1/gifs';
const apiBaseUrl = 'https://api.giphy.com/v1/gifs/';

//constantes para manejar el DOM

const sailorDay = document.querySelector('#sailorDay');
const sailorNight = document.querySelector('#sailorNight');
const changeTheme = document.querySelector('#change-theme');
const mostrarDesplegable = document.querySelector('#dropdown');
const desplegable = document.querySelector('#container-desplegable');
const start = document.getElementById('start');
const video = document.querySelector('video');
const record = document.getElementById('record');
const stoped = document.getElementById('stop');
const restart = document.getElementById('restart');
const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const progressBar = document.getElementsByClassName('progress-bar-item');
const uploadMessage = document.getElementById('upload-msg');
const textDinamic = document.getElementById('dinamic-text-recorder');
const download = document.getElementById('download');
const copy = document.getElementById('copy');
const nav = document.getElementById('nav');
const main = document.getElementById('main');
const cancel = document.getElementById('cancel');
const copyModal = document.getElementById('copy-success');

// objeto recorder - global
let recorder;

//variable para descargar gif
let blobDownloadGif;

//Variable para manejar el timer
let recording = false;

// funcion para empezar a correr la camara y pedir al usuario que nos de acceso a la camara
function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    })
        .then(function (stream) {
            // usamos el stream de la camara como source de nuestro tag <video> en html
            video.srcObject = stream;
            video.play();

            record.addEventListener('click', () => {

                recording = !recording;
                document.getElementById('camera-button').src = './assets/recording.svg';

                if (recording === true) {
                    this.disabled = true;
                    recorder = RecordRTC(stream,
                        {
                            type: 'gif',
                            frameRate: 1,
                            quality: 10,
                            width: 360,
                            hidden: 240,
                            onGifRecordingStarted: function () {
                                console.log('started');
                            },
                        }
                    );
                    // empieza a grabar
                    recorder.startRecording();

                    getDuration();

                    // modificamos el dom
                    record.classList.add('button-listo');
                    record.innerHTML = 'Listo';
                    stoped.classList.add('button-listo');
                    document.getElementById('timer').classList.remove('hidden');
                    textDinamic.innerHTML = "Capturando Tu Guifo";

                    //cortamos el stream
                    recorder.camera = stream;
                } else {
                    this.disabled = true;
                    recorder.stopRecording(stopRecordingCallback);
                    recording = false;
                }
            });
        });
}


function stopRecordingCallback() {
    recorder.camera.stop();
    // seteamos el formato requerido a la data que vamos a enviar como body de nuestro POST request
    let form = new FormData();

    form.append('file', recorder.getBlob(), 'test.gif');

    upload.addEventListener('click', () => {
        uploadMessage.classList.remove('hidden');
        preview.classList.add('hidden');
        animateProgressBar(progressBar);
        uploadGif(form);
        document.getElementById('timer').classList.add('hidden');
        textDinamic.innerHTML = "Subiendo Gifo";
        upload.classList.add('hidden');
        restart.classList.add('hidden');
        cancel.classList.remove('hidden');

    })

    //obtenemos el blob con recorder, la cual ya tiene el gif guardado para el preview
    objectURL = URL.createObjectURL(recorder.getBlob());
    preview.src = objectURL;
    console.log('pipipi' + objectURL);
    blobDownloadGif = objectURL;
    download.href = blobDownloadGif;

    //modificamos dom para mostrar preview, remover timer

    preview.classList.remove('hidden');
    video.classList.add('hidden');
    document.getElementById('video-record-buttons').classList.add('hidden');
    document.getElementById('video-upload-buttons').classList.remove('hidden');
    textDinamic.innerHTML = "Una pequeña vista previa";
    document.getElementById('major').style.height = '520px'

    recorder.destroy();
    recorder = null;

}

start.addEventListener('click', () => {
    document.getElementById('major').classList.remove('hidden');
    document.getElementById('gif-instructions').classList.add('hidden');
    document.getElementById('pre-upload-video').classList.remove('hidden');


    getStreamAndRecord()
});

restart.addEventListener('click', () => {
    location.reload()
})

function uploadGif(gif) {

    //formateamos el post segun las necesidades particulares de la api de Giphy
    fetch(apiUpload + '?api_key=' + apiKey, {
        method: 'POST',
        signal: signal,
        body: gif,

    }).then(res => {
        console.log(res.status);
        if (res.status != 200) {
            uploadMessage.innerHTML = '<h3>Hubo un error subiendo tu Guifo</h3>'
        }
        return res.json();
    }).then(data => {
        uploadMessage.classList.add('hidden');
        document.getElementById('major').classList.add('hidden');
        document.getElementById('share-modal-wrapper').classList.remove('hidden');
        const gifId = data.data.id;
        console.log(gifId);
        getGifDetails(gifId);
    })
        .catch(error => {
            uploadMessage.innerHTML = '<h3>Hubo un error subiendo tu Guifo</h3>';
            console.error('Error:', error)
        });
}


// Cancelar subida Gif

const controller = new AbortController();
const signal = controller.signal;

function cancelFetch() {
    controller.abort();
    location.reload();
}





function getGifDetails(id) {
    fetch(apiBaseUrl + id + '?api_key=' + apiKey, {
        method: 'GET',
        mode: 'cors',

    })
        .then((res) => {

            return res.json();
        }).then(data => {
            console.log("loalaoslaolsoasl")
            const gifUrl = 'https://media2.giphy.com/media/' + data.data.id + '/giphy.gif';
            //const gifUrl = data.data.url;
            localStorage.setItem('gif' + data.data.id, JSON.stringify(data));

            //seteamos el DOM para mostrar nuestro modal de success
            // srcShare = data.data.images.fixed_height.url;
            // console.log(srcShare);
            document.getElementById('share-modal-preview').src = data.data.images.fixed_height.url;

            preview.classList.remove('hidden');
            //main.classList.add('gray');
            //nav.classList.add('gray');

            download.href = gifUrl;

            copy.addEventListener('click', async () => {
                await navigator.clipboard.writeText(gifUrl);
                console.log('hola')
                copyModal.classList.remove('hidden')
                copyModal.innerHTML = 'Link copiado con éxito!'
                setTimeout(() => { copyModal.classList.add('hidden') }, 1500);
            })

            document.getElementById('embed').addEventListener('click', async () => {
                await navigator.clipboard.writeText(data.data.embed_url)
                copyModal.classList.remove('hidden');
                copyModal.innerHTML = 'Código copiado con éxito!';
                setTimeout(() => { copyModal.classList.add('hidden') }, 500);
            })
            document.getElementById('finish').addEventListener('click', () => {
                location.reload();
            })
        })
        .catch((error) => {
            return error;
        })
}

// animacion barra Porgreso

let counter = 0;
function animateProgressBar(bar) {
    setInterval(() => {
        if (counter < bar.length) {
            bar.item(counter).classList.toggle('progress-bar-item-active');
            counter++;
        } else {
            counter = 0;
        }
    }, 200);
}

// funcion para obtener duracion del timer
function getDuration() {
    let seconds = 0;
    let minutes = 0;
    let timer = setInterval(() => {
        if (recording) {
            if (seconds < 60) {
                if (seconds <= 9) {
                    seconds = '0' + seconds;
                }
                document.getElementById('timer').innerHTML = `00:00:0${minutes}:${seconds}`;
                seconds++;
            } else {
                minutes++;
                seconds = 0;
            }
        } else {
            clearInterval(timer);
        }

    }, 1000);
}

function getMyGifs() {
    let gifosArray = [];

    for (let i = 0; i < localStorage.length; i++) {

        let item = localStorage.getItem(localStorage.key(i));

        console.log(item);

        if (item.includes('data')) {

            let itemJson = JSON.parse(item);
            gifosArray.push(itemJson.data.images.fixed_height.url)
            console.log(gifosArray)
        }
    }
    return gifosArray
}

window.addEventListener('load', () => {
    const localGifs = getMyGifs();
    console.log(localGifs);
    localGifs.forEach(item => {
        let img = document.createElement('img')
        img.src = item;
        img.classList.add('results-thumb');
        document.getElementById('results').appendChild(img);
    });
});

getMyGifs();

document.getElementById('share-done').addEventListener('click', () => {
    location.reload();
});


//   MOSTRAR BOTONES TEMAS

mostrarDesplegable.addEventListener('click', () => {
    desplegable.classList.toggle('hidden');
})

// CAMBIAR TEMAS

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
    favicon.href = './assets/gifOF_logo_dark.png';
});

// VALIDAR TEMA LOCAL STORAGE

function validateThemes() {
    let theme = localStorage.getItem('tema');
    if (theme == 'day') {
        changeTheme.setAttribute('href', './styles/sailor-day.css');
        logo.src = './assets/gifOF_logo.png';
        favicon.href = './assets/gifOF_logo.png';
        document.getElementById('camera-button').src = './assets/camera.svg';
    }
    else {
        changeTheme.setAttribute('href', './styles/sailor-night.css')
        logo.src = './assets/gifOF_logo_dark.png';
        favicon.href = './assets/gifOF_logo_dark.png';
        document.getElementById('camera-button').src = './assets/camera_light.svg';
    }
}
validateThemes();

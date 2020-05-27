const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const displayTracks = (data) => {
document.querySelector('#tracks').innerHTML = "";
  let counter= 0;
  for (const track of data) {
    if (counter === 5) {
      return;
    }
    console.log(track.name);
    console.log(track.artist.name);
    console.log(track.album.image_url);
    console.log(track.preview_url);
    console.log('------------');

    const template =
    `
    <section class="track-item preview" data-preview-track="${track.preview_url}">
    <img src="${track.album.image_url}">
    <i class="fas play-track fa-play" aria-hidden="true"></i>
    <div class="label">
        <h3>${track.name}</h3>
        <p>
            ${track.artist.name}
        </p>
    </div>
</section>`;
document.querySelector('#tracks').innerHTML += template;

    ++counter;
  }
  if (counter == 0) {
    alert("No Tracks were found");
  }
};

const playSong = (ev) => {
  const section = ev.currentTarget;
  const previewURL = section.getAttribute("data-preview-track");
  audioPlayer.setAudioFile(previewURL);
  audioPlayer.play();
  console.log(previewURL);
  console.log('play song!');
};

const makeAudioPlayerWorkForClick = () => {
  const trackItems = document.querySelectorAll('.track-item');
  for (const item of trackItems) {
    item.onclick = playSong;
  }
};

const getTracks = (term) => {

  let url = 'https://www.apitutor.org/spotify/simple/v1/search?type=track&q=' + term;
  fetch(url)
    .then(response => response.json())
    .then(displayTracks)
    .then(makeAudioPlayerWorkForClick);
};

const displayAlbums = (data) => {
document.querySelector('#albums').innerHTML = "";
  let counter= 0;
  for (const track of data) {
    if (counter === 10) {
      return;
    }
    if (counter == 0) {
      console.log("No Albums were returned");
    }
    console.log(track.id);
    console.log(track.name);
    console.log(track.image_url);
    console.log(track.spotify_url);
    console.log('------------');

    const template =
    `
    <section class="album-card" id="${track.id}">
    <div>
        <img src="${track.image_url}">
        <h3>${track.name}</h3>
        <div class="footer">
            <a href="${track.spotify_url}" target="_blank">
                view on spotify
            </a>
        </div>
    </div>
</section>`;
document.querySelector('#albums').innerHTML += template;

    ++counter;
  }
  if (counter == 0) {
    console.log("No Albums were returned");
  }
};

const getAlbums = (term) => {
    let url = 'https://www.apitutor.org/spotify/simple/v1/search?type=album&q=' + term;
    fetch(url)
      .then(response => response.json())
      .then(displayAlbums)
};

const getArtist = (term) => {
    //1. build the URL:
    let url = 'https://www.apitutor.org/spotify/simple/v1/search?type=artist&q=' + term;
    //2. issue the fetch command:
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data[0]);
            const artist = data[0];
            const template = `
                <section class="artist-card" id="${artist.id}">
                    <div>
                        <img src="${artist.image_url}">
                        <h3>${artist.name}</h3>
                        <div class="footer">
                            <a href="${artist.spotify_url}" target="_blank">
                                view on spotify
                            </a>
                        </div>
                    </div>
                </section>`;
            document.querySelector('#artist').innerHTML = template;
        });

};


const doSearch = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        console.log('Enter key has been pressed!');
        ev.preventDefault();
        search();
    }
};

document.querySelector('#search').onkeyup = doSearch;

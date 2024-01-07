import config from './apiKey.js';
const apiKey = config.API_KEY;
const authorization = config.AUTHORIZATION;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: authorization
  }
};

// 로드가 완료되면, 영화들을 불러오기
document.addEventListener('DOMContentLoaded', async function () {
    const $movieContainer = document.querySelector('#movie-container');
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, options);
        const data = await res.json();

        if (data.results) {
            data.results.forEach((movie) => {
                createCard(movie, $movieContainer);
            });
        }else{
            $movieContainer.textContent = 'NO MOVIES FOUND';
        }
    } catch (err){
        console.error("Error fetching data: ", err);
        $movieContainer.textContent = 'ERROR FETCHING DATA';
    }
});

// 영화 하나 당 카드 하나 생성하기
function createCard(movie, container) {
    const card = document.createElement('div');
    card.className = 'card';

    // card 클릭하면 id alert창에 띄우기
    card.addEventListener('click', () => showId(movie.id));

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = `${movie.title} Poster`;
    img.className = 'img';

    const title = document.createElement('h4');
    title.className = 'title';
    title.textContent = movie.title;

    const overview = document.createElement('p');
    overview.className = 'overview';
    overview.textContent = movie.overview;

    const voteAvg = document.createElement('small');
    voteAvg.className = 'voteAvg';
    voteAvg.textContent = `Rating: ${movie.vote_average}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(overview);
    card.appendChild(voteAvg);

    container.appendChild(card);
}

// 검색 버튼을 클릭하면 searchMovie나 searchMovie2 수행
document.getElementById('search-btn').addEventListener('click', searchMovie2);

// 엔터를 누르면 검색 버튼을 누른것과 동일한 효과를 주자
document.getElementById('search-input').addEventListener('keyup', function(event){
    if(event.key === 'Enter') document.getElementById('search-btn').click();
});

async function searchMovie(){
    const $movieContainer = document.querySelector('#movie-container');
    $movieContainer.innerHTML = ''; // 전의 카드들 지우기
    const $searchInput = document.querySelector('#search-input').value.toLowerCase(); // 대소문자 관계없이 검색 가능하게 하기

    // 빈 문자열이면, 
    if($searchInput === ''){
        $movieContainer.textContent = 'You haven\'t entered movie title yet.';
        return;
    }

    try{
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent($searchInput)}`);
        const data = await res.json();
    
        if(data.results.length !== 0){
            data.results.forEach((movie) => {
                createCard(movie, $movieContainer);
            });
        }else{
            $movieContainer.textContent = 'NO RESULTS';
        }
    }catch(err){
        console.error("Error fetching data: ", err);
        $movieContainer.textContent = 'ERROR FETCHING DATA';
    }
}

// filter로 검색기능 구현해봄 
async function searchMovie2(){
    const $movieContainer = document.querySelector('#movie-container');
    $movieContainer.innerHTML = ''; // 전의 카드들 지우기
    const $searchInput = document.querySelector('#search-input').value.toLowerCase(); // 대소문자 관계없이 검색 가능하게 하기

    // 빈 문자열이면, 
    if($searchInput === ''){
        $movieContainer.textContent = 'You haven\'t entered movie title yet.';
        return;
    }

    try{
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, options);
        const data = await res.json();
      
        if(data.results.length !== 0){
            let filteredMovies = data.results.filter(v => v.title.toLowerCase().includes($searchInput));
            if(filteredMovies.length === 0) $movieContainer.textContent = 'NO RESULTS';
        
            filteredMovies.forEach((movie) => {
                createCard(movie, $movieContainer);
            });
        }else{
            $movieContainer.textContent = 'NO RESULTS';
        }
    }catch(err){
        console.error("Error fetching data: ", err);
        $movieContainer.textContent = 'ERROR FETCHING DATA';
    }
}

// card 클릭하면 id alert창에 띄우기
const showId = (id) => {
    alert(`영화 id: ${id}`);
}
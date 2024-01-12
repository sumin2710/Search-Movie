import config from "./apiKey.js";

// ============================================================ //
// 전역 변수
// ============================================================ //

const API_KEY = config.API_KEY;

// ============================================================ //
// 렌더링
// ============================================================ //

// 영화 디테일 카드 만들기 + img 넣기
const createDetailCard = (movie, container) => {
  const card = document.createElement("div");
  card.className = "card";

  const $imgContent = document.querySelector(".img-content");
  const imgPath = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
  //$imgContent.style.backgroundImage = `url(${imgPath})`;
  console.log(imgPath);
  $imgContent.style = `background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #151515),
  url(${imgPath});
background-repeat: no-repeat;
background-size: cover;`;

  const title = document.createElement("h1");
  title.className = "title";
  title.textContent = movie.title;

  const overview = document.createElement("p");
  overview.className = "overview";
  overview.textContent = movie.overview;

  const voteAvg = document.createElement("small");
  voteAvg.className = "voteAvg";
  voteAvg.textContent = `Rating: ${movie.vote_average}/10`;

  card.appendChild(title);
  card.appendChild(overview);
  card.appendChild(voteAvg);

  container.appendChild(card);
};

// 리뷰 카드 만들기
const createReviewCard = (review, idx, container) => {
  const reviewCard = document.createElement("div");
  reviewCard.className = "reviewCard";

  const reviewUserName = document.createElement("p");
  reviewUserName.className = "reviewUserName";
  reviewUserName.textContent = `username: ${review.userName}`;

  const reviewContent = document.createElement("p");
  reviewContent.className = "reviewContent";
  reviewContent.textContent = `content: ${review.userReview}`;

  const btns = document.createElement("div");
  btns.className = "btns";

  // 수정 버튼
  const editBtn = document.createElement("button");
  editBtn.className = "editBtn";
  editBtn.textContent = "수정";
  editBtn.addEventListener("click", () => editReview(idx));

  // 삭제 버튼
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", () => deleteReview(idx));

  btns.appendChild(editBtn);
  btns.appendChild(deleteBtn);

  reviewCard.appendChild(reviewUserName);
  reviewCard.appendChild(reviewContent);
  reviewCard.appendChild(btns);

  container.appendChild(reviewCard);
};

// ============================================================ //
// 이벤트
// ============================================================ //

// url에서 id(movieId) 가져오기
const getMovieId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  return movieId;
};

// 영화 디테일 불러오기
const fetchMovieDetails = async () => {
  const $movieDetailContainer = document.querySelector("#movie-details");

  // url에서 id 가져오기
  const movieId = getMovieId();

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await res.json();
    createDetailCard(movie, $movieDetailContainer);
  } catch (err) {
    console.error("Error fetching data: ", err);
    $movieDetailContainer.textContent = "ERROR FETCHING DATA";
  }
};

// 그 영화에 대한 리뷰 리스트 보여주기
const displayReviewList = () => {
  const $reviewContainer = document.querySelector("#review-list");
  $reviewContainer.innerHTML = ""; // 안의 내용 지우기

  const movieId = getMovieId();

  const reviewList = JSON.parse(localStorage.getItem(movieId));

  if (reviewList === null) {
    $reviewContainer.textContent = "NO REVIEWS YET";
    return;
  }
  // 배열이니까 idx가 존재함 -> 그걸 갖다 쓰자!
  reviewList.forEach((review, idx) => {
    createReviewCard(review, idx, $reviewContainer);
  });
};

// 저장 버튼을 누르면 -> 그 영화에 대한 리뷰 저장하기
const saveReview = (event) => {
  event.preventDefault();
  const userName = document.getElementById("userName").value;
  const userPassword = document.getElementById("userPassword").value;
  const userReview = document.getElementById("userReview").value;

  // 유효성 검사 -> 입력 안했거나, 공백이거나
  if (userName === null || userName.trim() === "") {
    alert("Invalid username.");
    return;
  } else if (userReview === null || userReview.trim() === "") {
    alert("Please write review content.");
    return;
  } else if (userPassword === null || userPassword.trim() === "") {
    alert("Invalid password.");
    return;
  }

  const movieId = getMovieId(); // string
  // localStorage의 key : 영화 아이디(문자열), value = 객체들로 이루어진 배열(문자열)
  // 만약 키에 해당하는 값이 존재하지 않으면 null이 반환된다.
  if (localStorage.getItem(movieId) === null) {
    let tmp = [{ userName, userPassword, userReview }];
    localStorage.setItem(movieId, JSON.stringify(tmp)); // localStorage의 키, 값은 문자열이다.
  } else {
    const reviewList = JSON.parse(localStorage.getItem(movieId));
    reviewList.push({ userName, userPassword, userReview });
    localStorage.setItem(movieId, JSON.stringify(reviewList));
  }
  alert("Your review's been successfully saved!");
  // 화면 새로고침
  window.location.reload();

  // 리뷰 리스트 다시 보여주기
  displayReviewList();
};

// 수정 버튼을 누르면
const editReview = (idx) => {
  const movieId = getMovieId();
  const reviewList = JSON.parse(localStorage.getItem(movieId));
  const review = reviewList[idx];

  const password = prompt("Enter password.");
  if (password !== review.userPassword) {
    alert("Wrong password!!!");
    return;
  } else {
    const reviewContent = prompt("Edit your review~~", review.userReview);
    // 유효성 검사 -> 수정한 내용이 없거나 공백인지 검사
    if (reviewContent !== null && reviewContent.trim() !== "") {
      review.userReview = reviewContent; // update!
      localStorage.setItem(movieId, JSON.stringify(reviewList));
      displayReviewList(); // 업데이트된 리뷰 리스트 보여주기
      alert("Your review's been successfully edited.");
    } else {
      alert("wrong input.");
    }
  }
};

// 삭제
const deleteReview = (idx) => {
  const movieId = getMovieId();
  const reviewList = JSON.parse(localStorage.getItem(movieId));
  const review = reviewList[idx];

  const password = prompt("Enter password.");
  if (password !== review.userPassword) {
    alert("Wrong password!!!");
    return;
  } else {
    reviewList.splice(idx, 1); // idx부터 1개 요소 자르기
    localStorage.setItem(movieId, JSON.stringify(reviewList));
    displayReviewList();
    alert("Your review's been successfully deleted.");
  }
};

// init 함수 -> DOM TREE 로드되면 할 작업
const init = async () => {
  fetchMovieDetails(); // 영화 디테일 보여주기
  displayReviewList(); // 그 영화에 대한 리뷰들 보여주기
};

// ============================================================ //
// 함수 진입점
// ============================================================ //

// 로드가 완료되면 전체 함수 진입
document.addEventListener("DOMContentLoaded", async function () {
  // 저장 버튼 클릭하면 리뷰 저장
  document.getElementById("saveReviewBtn").addEventListener("click", saveReview);
  // 홈 로고 클릭하면 메인 페이지로 이동
  document.getElementById("home-logo").addEventListener("click", () => {
    window.location.href = "./movie_search.html";
  });

  await init();
});

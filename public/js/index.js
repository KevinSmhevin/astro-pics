/* global store $ */


function getAndDisplayPicture(id) {
  getOnePicture(id, displayPicture);
}


function getPictures(callback) {
  const queryData = {
    url: '/photos/all',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: callback,
  };
  $.ajax(queryData);
}

function getOnePicture(id, callback) {
  const queryData = {
    url: `/photos/${id}`,
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json',
    success: callback,
  };
  $.ajax(queryData);
}

function watchPictureBoxes() {
  $('.main-container').on('click', '.image-box', (event) => {
    event.preventDefault();
    const ID = $(event.currentTarget).find('.photoId').text();
    getAndDisplayPicture(ID);
  });
}

function watchExitButton() {
  $('.photo-box-screen-overlay').on('click', '.exit-button', (event) => {
    event.preventDefault();
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function renderPictures(entry) {
  return `
        <div class="box">
        <article class="image-box">
          <img class="gal-pic" src ="${entry.smallPicture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <p hidden class="photoId">${entry.id}</></li>
                       </ul>
          </article>
        </div>`;
  // adding to return div when feature is added
  // </li><button class="ph-btn-grey ph-button like-button"
  // type="button"><img src="pics/like.png"></button></li>
}

function displayPictures(data) {
  const pictureBoxes = data.photoPosts.map(item => renderPictures(item)).join('');
  $('.row').html(pictureBoxes);
}

function displayPicture(data) {
  const pictureBox = renderPicture(data);
  $('.photo-box-screen-overlay').html(pictureBox).fadeIn(500);
}

function renderPicture(entry) {
  return `
  <button type="button" class="exit-button"><img src="pics/icon.png" alt="exit"></button>
  <div class="photo-box-screen">
    <div class="single-photo-container">
      <img class="indv-pic" src="${entry.largePicture}">
    </div>
    <ul class="single-image-content">
      <li>Title: ${entry.title}</li>
      <li>Author: ${entry.author}</li>
      <li>Date: ${entry.date}</li>
    </ul>
    <p>${entry.description}</p>
  </div>
  `;
}

function getAndDisplayPictures() {
  getPictures(displayPictures);
}

function loadPage() {
  getAndDisplayPictures();
  watchPictureBoxes();
  watchExitButton();
}

$(loadPage);

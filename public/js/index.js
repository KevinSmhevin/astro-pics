/* global store $ */

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

function renderPictures(entry) {
  return `
        <div class="box">
          <img class="gal-pic" src ="${entry.picture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <li><p class="likes">${entry.likes}</p></li>
                       </ul>
        </div>`;
  // adding to return div when feature is added
  // </li><button class="ph-btn-grey ph-button like-button"
  // type="button"><img src="pics/like.png"></button></li>
}

function displayPictures(data) {
  const results = data.photoPosts.map(item => renderPictures(item)).join('');
  $('.row').html(results);
}

function getAndDisplayPictures() {
  getPictures(displayPictures);
}

function loadPage() {
  getAndDisplayPictures();
}

$(loadPage);

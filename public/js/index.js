/* global store $ */

const MOCK_PICTURES = {
  photoPosts: [
    {
      id: '1111',
      title: 'The Milky Way',
      picture: 'pics/space.jpg',
      author: 'Kevin Paras',
      description: 'taken in CA',
      likes: '5',
      date: '5/1/2018',
    },
    {
      id: '1112',
      title: 'Star Trails',
      picture: 'pics/space.jpg',
      author: 'Kevin Paras',
      description: 'compiled over 20 pics',
      likes: '5',
      date: '5/3/2018',
    },
    {
      id: '1113',
      title: 'Orion Nebula',
      picture: 'pics/space.jpg',
      author: 'Kevin Paras',
      description: 'taken during winter',
      likes: '100',
      date: '5/6/2018',
    },
    {
      id: '1114',
      title: 'Lunar Eclipse',
      picture: 'pics/space.jpg',
      author: 'Kevin Paras',
      description: 'its really bright',
      likes: '0',
      date: '5/9/2018',
    },
    {
      id: '1115',
      title: 'Another Milky Way',
      picture: 'pics/space.jpg',
      author: 'Kevin Paras',
      description: 'nice desert background',
      likes: '6',
      date: '6/1/2018',
    },
    {
      id: '1116',
      title: 'Starry Night',
      picture: 'pics/space.jpg',
      author: 'Vincent',
      description: 'famous picture',
      likes: '8',
      date: '7/1/2018',
    },
  ],
};

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
    getAndDisplayPicture(ID)
  });
}

function renderPictures(entry) {
  return `
        <div class="box">
        <article class="image-box">
          <img class="gal-pic" src ="${entry.picture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <li><p class="likes">${entry.likes}</p></li>
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
  $('.photo-box-screen').html(pictureBox).fadeIn(500);
}

function renderPicture(entry) {
  return `
  <img class="gal-pic" src ="${entry.picture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <li><p class="likes">${entry.likes}</p></li>
                           </ul>
  `
}

function getAndDisplayPictures() {
  getPictures(displayPictures);
}

function loadPage() {
  getAndDisplayPictures();
  watchPictureBoxes();
}

$(loadPage);

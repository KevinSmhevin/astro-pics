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

function getPictures(callbackFn) {
  setTimeout(() => { callbackFn(MOCK_PICTURES); }, 100);
}

function displayPictures(data) {
  const results = data.photoPosts.map(item => renderPictures(item)).join('');
  $('.row').html(results);
}

function renderPictures(entry) {
  return `
        <div class="box">
          <img class="gal-pic" src ="${entry.picture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <li><p class="likes">${entry.likes}</p></li>
                        </li><button class="ph-btn-grey ph-button like-button" type="button"><img src="pics/like.png"></button></li>
                       </ul>
        </div>`;
}
function getAndDisplayPictures() {
  getPictures(displayPictures);
}

function loadPage() {
  getAndDisplayPictures();
}

$(loadPage);

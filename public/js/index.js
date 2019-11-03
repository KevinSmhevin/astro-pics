// Object for storing global variables
const STATE = {
  viewportHeight: 0,
  viewportWidth: 0,
  id: '',
  viewport: '',
  errorLogin: '<div class="error-message">Incorrect Username or Password</div>',
  errorDelete: '<div class="error-message">This Post does not belong to you</div>',
  errorGeneral: '<div class="error-message">Something went wrong</div>',
  smallPicture: '',
  largePicture: '',
  tabIndex: 0,
};

// Global declaration for Cloudinary image uploader
$.cloudinary.config({ cloud_name: 'dljvx3nbw', secure: true });

// Functions to obtain local storage item and store to STATE object
function getUsername() {
  STATE.username = localStorage.getItem('username');
}

function checkAuthToken() {
  STATE.authChecker = localStorage.getItem('authToken');
}

// Checks viewport for responsive rendering

function mobileViewportChecker() {
  STATE.viewportWidth = $(window).width();
  STATE.viewportHeight = $(window).height();
  if ((STATE.viewportWidth < 600 && STATE.viewportHeight < 820) || STATE.viewportHeight < 451) {
    STATE.viewport = 'mobile';
  }
  console.log(STATE.viewport);
}

// display error functions

function displaySignUpError(err) {
  $('.photo-box-screen-overlay').append(`<div class="error-message">error: ${err} </div>`);
}

function displayLoginError() {
  $('.photo-box-screen-overlay').append(STATE.errorLogin);
}

function displayGeneralError() {
  $('.photo-box-screen-overlay').append(STATE.errorGeneral);
}

function displayCreatePictureError(err) {
  $('.photo-box-screen-overlay').append(`<div class="error-message">error: ${err} </div>`);
}

function displayDeleteError() {
  $('.photo-box-screen-overlay').append(STATE.errorDelete);
}

function displayUpdateError() {
  $('.photo-box-screen-overlay').append(STATE.errorUpdate);
}
// API request to server functions

function signUpRequest(userInfo, callback) {
  const queryData = {
    url: '/api/users/register',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(userInfo),
    success: callback,
    error(request, status, error) {
      displaySignUpError(request.responseJSON.message);
    },
  };
  $.ajax(queryData);
}

function loginRequest(userInfo, callback) {
  const queryData = {
    url: '/api/auth/login',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(userInfo),
    success: callback,
    error: displayLoginError,
  };
  $.ajax(queryData);
}

function getPictures(callback) {
  const queryData = {
    url: '/photos/all',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: callback,
    error: displayGeneralError,
  };
  $.ajax(queryData);
}

function getOnePicture(id, callback) {
  const queryData = {
    url: `/photos/${id}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: callback,
    error: displayGeneralError,
  };
  $.ajax(queryData);
}

function deletePicture(callback) {
  const queryData = {
    url: `/photos/${STATE.id}`,
    type: 'DELETE',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${STATE.authChecker}`);
    },
    success: callback,
    error: displayDeleteError,
  };
  $.ajax(queryData);
}
function createPicture(postData, callback) {
  const queryData = {
    url: '/photos/post',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${STATE.authChecker}`);
    },
    data: JSON.stringify(postData),
    success: callback,
    error(request, status, error) {
      displayCreatePictureError(request.responseJSON.message);
    },
  };
  $.ajax(queryData);
}

function updateContent(updateData, callback) {
  const queryData = {
    url: `/photos/${STATE.id}`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${STATE.authChecker}`);
    },
    data: JSON.stringify(updateData),
    success: callback,
    error: displayUpdateError,
  };
  $.ajax(queryData);
}

// Rendering functions

function renderPictures(entry) {
  return ` 
        <div class="box">
        <article role="article" class="image-box" tabindex="${STATE.tabIndex}">
          <img class="gal-pic" alt="${entry.title}" src ="${entry.smallPicture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <p hidden class="photoId">${entry.id}</></li>
                       </ul>
          </article>
        </div>`;
}

function renderMobilePicture(entry) {
  console.log('hello render');
  getUsername();
  if (STATE.authChecker && (STATE.username === STATE.originalArtist)) {
    console.log('hello inside of render');
    return `
    <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="photo-box-screen">
        <img class="indv-pic" src="${entry.smallPicture}">
      <ul class="single-image-content">
        <li>Title: ${entry.title}</li>
        <li>Author: ${entry.author}</li>
        <li>Date: ${entry.date}</li>
        <li>${entry.description}</li>
      </ul>
      <div class="button-container">
      <button type="button" class="edit-button ph-btn-grey ph-button">edit post</button>
      <button type="button" class="delete-button ph-btn-red ph-button form-button">delete post</button>
      </div>
    </div>
    `;
  }
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="photo-box-screen">
        <img class="indv-pic" src="${entry.smallPicture}">
      <ul class="single-image-content">
        <li>Title: ${entry.title}</li>
        <li>Author: ${entry.author}</li>
        <li>Date: ${entry.date}</li>
        <li>${entry.description}</li>
      </ul>
      </div>
  `;
}

function renderPicture(entry) {
  checkAuthToken();
  getUsername();
  if (STATE.authChecker && (STATE.username === STATE.originalArtist)) {
    return `
    <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="photo-box-screen">
        <img class="indv-pic" src="${entry.largePicture}">
      <ul class="single-image-content">
        <li>Title: ${entry.title}</li>
        <li>Author: ${entry.author}</li>
        <li>Date: ${entry.date}</li>
        <li>${entry.description}</li>
      </ul>
      <div class="button-container">
      <button type="button" class="edit-button ph-btn-grey ph-button">edit post</button>
      <button type="button" class="delete-button ph-btn-red ph-button">delete post</button>
      </div>
    </div>
    `;
  } return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="photo-box-screen">
      <img class="indv-pic" src="${entry.largePicture}">
    <ul class="single-image-content">
      <li>Title: ${entry.title}</li>
      <li>Author: ${entry.author}</li>
      <li>Date: ${entry.date}</li>
      <li>${entry.description}</li>
    </ul>
  </div>
  `;
}

function renderLoginWindow() {
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="login-window">
    <form id="login-form" action="#">
      <h4>Login</h4><br>
      <label for="username">Username</label>
      <input type="text" name="username" required/>
      <label for="password">Password</label>
      <input type="password" name="password" required/>
      <button type="submit" form="login-form" class="ph-btn-blue ph-button login-button">Login</button>
      <p>Not a member? Sign up! </p>
      <button type="button" class="ph-btn-blue ph-button sign-up-button">Sign Up</button>
    </form>
  </div>
  `;
}

function renderSignUpForm() {
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="sign-up-window">
    <form id="sign-up-form">
      <h4>Sign Up Form</h4><br>
      <label for="email">Email</label>
      <input type="email" name="email" required/>
      <label for="username">Username</label>
      <input type="text" name="username" required/>
     <label for="password">Password</label>
      <input type="password" name="password" required/>
      <label for="firstName">First Name</label>
      <input type="text" name="firstName" required/>
      <label for="lastName">Last Name</label>
      <input type="text" name="lastName" required/>
      <button type="submit" form="sign-up-form" class="ph-btn-blue ph-button sign-up-submit" value="submit">Sign Up</button>
      </form>
  </div>
  `;
}

function renderUserHome() {
  checkAuthToken();
  if (STATE.authChecker) {
    return `
      <div class="menu-bar">
      <span class="login-info">Logged in as ${localStorage.username}</span>
        <button type="button" class="ph-btn-grey ph-button log-out-button">Log Out</button>
      </div>
      <button type="button" class="ph-button ph-btn-blue post-button">Post</button>

      `;
  }
  return `
      <button type="button" class="ph-btn-grey ph-button login-sign-up-button">Login/Sign Up</button>
      `;
}

function renderPostForm() {
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="form-container">
      <form id="create-photo-post-form" action="#">
      <a href="#" id="upload_widget_opener" class="ph-btn-green ph-button form-button">Upload image</a>  
      <div class="image-upload-success"></div>
      <label for="title">Title</label>
      <input class="photo-form-field" type="text" name="title"/>
      <label for="description">Description</label>
      <input class="photo-form-field" type="text" name="description"/>
      <label for="author" hidden>Photographer</label>
      <input class="photo-form-field" type="text" name="author"/ value=${STATE.username} hidden>
      <label for="button"></label>
      <button type="submit" form="create-photo-post-form" class="ph-btn-grey ph-button form-button" value="submit">Post</button>
      </form>
      
    </div>
  `;
}

function renderUpdateForm(entry) {
  return `
    <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="form-container">
    <div class="error-container"></div>
        <img class="indv-pic" src="${entry.largePicture}">
      <form id="update-form" action="#">
      <input type="hidden" name="id" value="${entry.id}"/>
      <label for="title">Title</label>
      <input class="photo-form-field" type="text" name="title" value="${entry.title}"/>
      <label for="description">Description</label>
      <input class="photo-form-field" type="text" name="description" value="${entry.description}"/>
      <label for="button"></label>
      <button type="submit" form="update-form" class="ph-btn-grey ph-button form-button">Update</button>
      </form>
    </div>
    `;
}

function renderMobileUpdateForm() {
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="form-container">
      <img class="indv-pic" src="${entry.smallPicture}">
    <form id="update-form" action="#">
    <input type="hidden" name="id" value="${entry.id}"/>
    <label for="title">Title</label>
    <input class="photo-form-field" type="text" name="title" value="${entry.title}"/>
    <label for="description">description</label>
    <input class="photo-form-field" type="text" name="description" value="${entry.description}"/>
    <label for="button"></label>
    <button type="submit" form="update-form" class="ph-btn-grey ph-button form-button" value="submit">Update</button>
    </form>
  </div>
  `;
}

function renderDeletePrompt() {
  return `<div class="delete-prompt-box"> Are you sure you want to delete?
  <button type="button" class="yes-delete-button ph-btn-red ph-button">Yes</button>
      <button type="button" class="do-not-delete-button ph-btn-blue ph-button">No</button>
      </div>
  `;
}

function renderSignUpSuccessBox() {
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="success-sign-up-window">
  <h4> Your account has successfully been created! </h4>
  </div>
  `;
}

function renderLogInSuccessBox() {
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="success-sign-up-window">
  <h4> Successfully Logged In! </h4>
  </div>
  `;
}

// Display functions to call rendering

function displayUserHome() {
  const userHome = renderUserHome();
  $('nav').html(userHome).fadeIn(400);
}

function displayPictures(data) {
  STATE.tabIndex === 0;
  const pictureBoxes = data.photoPosts.reverse().map(item => renderPictures(item)).join('');
  $('.row').html(pictureBoxes);
}

function displayPicture(data) {
  STATE.tabIndex === -1;
  mobileViewportChecker();
  if (STATE.viewport === 'mobile') {
    console.log('it reaches here');
    const mobilePictureBox = renderMobilePicture(data);
    $('.photo-box-screen-overlay').html(mobilePictureBox).fadeIn(500);
  }
  const pictureBox = renderPicture(data);
  $('.photo-box-screen-overlay').html(pictureBox).fadeIn(500);
}

function getAndDisplayPicture(id) {
  getOnePicture(id, displayPicture);
}

function getAndDisplayPictures() {
  displayUserHome();
  getPictures(displayPictures);
}

function displayLoginWindow() {
  STATE.tabIndex === -1;
  const loginWindow = renderLoginWindow();
  $('.photo-box-screen-overlay').html(loginWindow).fadeIn(500);
}

function displaySignUpForm() {
  STATE.tabIndex === -1;
  const signUpForm = renderSignUpForm();
  $('.photo-box-screen-overlay').html(signUpForm).fadeIn(500);
}

function displayLoginSuccess() {
  getAndDisplayPictures();
  const successBox = renderLogInSuccessBox();
  $('.photo-box-screen-overlay').html(successBox).fadeIn(500).fadeOut(4000);
}

function displaySignUpSuccess() {
  getAndDisplayPictures();
  const successBox = renderSignUpSuccessBox();
  $('.photo-box-screen-overlay').html(successBox).fadeIn(500).fadeOut(4000);
}

function displayPostForm() {
  STATE.tabIndex === -1;
  getUsername();
  const formPost = renderPostForm();
  $('.photo-box-screen-overlay').html(formPost).fadeIn(500);
}

function displayUpdateForm(data) {
  STATE.tabIndex === -1;
  mobileViewportChecker();
  if (STATE.viewport === 'mobile') {
    $('.photo-box-screen-overlay').empty();
    const mobileUpdateForm = renderMobileUpdateForm(data);
    $('.photo-box-screen-overlay').html(mobileUpdateForm);
  }
  $('.photo-box-screen-overlay').empty();
  const updateForm = renderUpdateForm(data);
  $('.photo-box-screen-overlay').html(updateForm);
}

function displayUpdatedPicture() {
  $('.photo-box-screen-overlay').empty();
  getAndDisplayPicture(STATE.id);
}

function displayDeletePrompt() {
  const deletePromptBox = renderDeletePrompt();
  $('.photo-box-screen-overlay').html(deletePromptBox).fadeIn(500);
}

// Extra Success callbacks before calling display

function loginSuccessful(data) {
  localStorage.setItem('authToken', data.authToken);
  localStorage.setItem('username', data.username);
  displayLoginSuccess();
}

// Event Listeners

function watchSignUpSubmit() {
  $('.photo-box-screen-overlay').on('submit', '#sign-up-form', (event) => {
    event.preventDefault();
    const userInfo = {};
    $(event.currentTarget).serializeArray().forEach((attr) => {
      userInfo[attr.name] = attr.value;
    });
    signUpRequest(userInfo, displaySignUpSuccess);
  });
}

function watchSignUpButton() {
  $('.photo-box-screen-overlay').on('click', '.sign-up-button', (event) => {
    event.preventDefault();
    displaySignUpForm();
  });
}
function watchLoginButton() {
  $('nav').on('click', '.login-sign-up-button', (event) => {
    event.preventDefault();
    displayLoginWindow();
  });
}

function watchLoginSubmit() {
  $('.photo-box-screen-overlay').on('submit', '#login-form', (event) => {
    event.preventDefault();
    const userInfo = {};
    $(event.currentTarget).serializeArray().forEach((attr) => {
      userInfo[attr.name] = attr.value;
    });
    loginRequest(userInfo, loginSuccessful);
  });
}

function watchLogOutButton() {
  $('nav').on('click', '.log-out-button', (event) => {
    event.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    getAndDisplayPictures();
  });
}

function watchPostButton() {
  $('nav').on('click', '.post-button', (event) => {
    event.preventDefault();
    displayPostForm();
  });
}

function watchPictureBoxes() {
  $('.photo-container').on('click', '.image-box', (event) => {
    event.preventDefault();
    STATE.id = $(event.currentTarget).find('.photoId').text();
    STATE.originalArtist = $(event.currentTarget).find('.author').text();
    getAndDisplayPicture(STATE.id);
  });
}

function watchKeyPressPictureBoxes() {
  $('.photo-container').on('keypress', '.image-box', (event) => {
    const $focused = $(':focus');
    event.preventDefault();
    STATE.id = $($focused).find('.photoId').text();
    STATE.originalArtist = $($focused).find('.author').text();
    getAndDisplayPicture(STATE.id);
  });
}

function watchYesDeleteButton() {
  $('.photo-box-screen-overlay').on('click', '.yes-delete-button', (event) => {
    event.preventDefault();
    deletePicture(getAndDisplayPictures);
    $('.photo-box-screen-overlay').empty().fadeOut(2000);
  });
}
function watchDoNotDeleteButton() {
  $('.photo-box-screen-overlay').on('click', '.do-not-delete-button', (event) => {
    event.preventDefault();
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchUploadWidget() {
  $('.photo-box-screen-overlay').on('click', '#upload_widget_opener', () => {
    cloudinary.openUploadWidget({
      cloud_name: 'dljvx3nbw',
      upload_preset: 'phlaser_',
    },
    (error, result) => {
      STATE.photo = result[0].path;
      $('.image-upload-success').html('<h4>image upload successful!</h4>');
    });
  });
}

function watchPostFormSubmit() {
  $('.photo-box-screen-overlay').on('submit', '#create-photo-post-form', (event) => {
    event.preventDefault();
    STATE.largePicture = `http://res.cloudinary.com/dljvx3nbw/image/upload/b_rgb:050605,bo_0px_solid_rgb:ffffff,c_fit,h_550,o_100,q_100,w_550/${STATE.photo}`;
    STATE.smallPicture = `http://res.cloudinary.com/dljvx3nbw/image/upload/b_rgb:050605,bo_0px_solid_rgb:ffffff,c_lpad,h_375,o_100,q_100,w_375/${STATE.photo}`;
    const postData = {
      smallPicture: STATE.smallPicture,
      largePicture: STATE.largePicture,
    };
    $(event.currentTarget).serializeArray().forEach((attribute) => {
      postData[attribute.name] = attribute.value;
    });
    createPicture(postData, getAndDisplayPictures);
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchExitButton() {
  STATE.tabIndex === 0;
  $('.photo-box-screen-overlay').on('click', '.exit-button', (event) => {
    event.preventDefault();
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchModalExitScreen() {
  STATE.tabIndex === 0;
  $('.photo-box-screen-overlay').click(() => {
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchUpdateButton() {
  $('.photo-box-screen-overlay').on('click', '.edit-button', (event) => {
    event.preventDefault();
    getOnePicture(STATE.id, displayUpdateForm);
  });
}

function watchUpdateFormSubmit() {
  $('.photo-box-screen-overlay').on('submit', '#update-form', (event) => {
    event.preventDefault();
    const updateData = {};
    $(event.currentTarget).serializeArray().forEach((attribute) => {
      updateData[attribute.name] = attribute.value;
    });
    updateContent(updateData, displayUpdatedPicture);
  });
}

function watchDeleteButton() {
  $('.photo-box-screen-overlay').on('click', '.delete-button', (event) => {
    event.preventDefault();
    displayDeletePrompt();
  });
}

// load all event listeners

function loadPage() {
  getAndDisplayPictures();
  watchPictureBoxes();
  watchKeyPressPictureBoxes();
  watchUploadWidget();
  watchPostButton();
  watchPostFormSubmit();
  watchUpdateFormSubmit();
  watchDeleteButton();
  watchSignUpButton();
  watchLoginSubmit();
  watchDoNotDeleteButton();
  watchYesDeleteButton();
  watchSignUpSubmit();
  watchUpdateButton();
  watchLoginButton();
  watchLogOutButton();
  watchModalExitScreen();
  watchExitButton();
}

$(loadPage);

const STATE = {
  viewportHeight: 0,
  viewportWidth: 0,
  id: '',
};

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
    dataType: 'json',
    contentType: 'application/json',
    success: callback,
  };
  $.ajax(queryData);
}

function deletePicture() {
  const queryData = {
    url: `/photos/${STATE.id}`,
    type: 'DELETE',
    dataType: 'json',
    contentType: 'application/json',
    success: console.log('successfully deleted'),
  };
  $.ajax(queryData);
}
function createPicture(postData, callback) {
  const queryData = {
    url: '/photos/post',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(postData),
    success: callback,
  };
  $.ajax(queryData);
}

function updateContent(updateData, callback) {
  const queryData = {
    url: `/photos/${STATE.id}`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(updateData),
    success: callback,
    error(xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(xhr.responseText);
      alert(thrownError);
    },
  };
  $.ajax(queryData);
}

function getAndDisplayPicture(id) {
  getOnePicture(id, displayPicture);
}

function watchPictureBoxes() {
  $('.main-container').on('click', '.image-box', (event) => {
    event.preventDefault();
    STATE.id = $(event.currentTarget).find('.photoId').text();
    getAndDisplayPicture(STATE.id);
  });
}

function watchExitButton() {
  $('.photo-box-screen-overlay').on('click', '.exit-button', (event) => {
    event.preventDefault();
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchPostButton() {
  $('nav').on('click', '.post-button', (event) => {
    event.preventDefault();
    displayPostForm();
    watchUploadWidget();
  });
}

function watchPostFormSubmit() {
  $('#create-photo-post-form').submit((event) => {
    event.preventDefault();
    STATE.largePicture = `http://res.cloudinary.com/dljvx3nbw/image/upload/b_rgb:050605,bo_0px_solid_rgb:ffffff,c_fit,h_500,o_100,q_100,w_400/${STATE.photo}`;
    STATE.smallPicture = `http://res.cloudinary.com/dljvx3nbw/image/upload/b_rgb:050605,bo_0px_solid_rgb:ffffff,c_pad,h_375,o_100,q_100,w_375/${STATE.photo}`;
    const postData = {
      smallPicture: STATE.smallPicture,
      largePicture: STATE.largePicture,
    };
    $(event.currentTarget).serializeArray().forEach((attribute) => {
      postData[attribute.name] = attribute.value;
    });
    console.log(postData);
    createPicture(postData, getAndDisplayPictures);
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchUpdateFormSubmit() {
  $('.photo-box-screen-overlay').on('submit', '#update-form', (event) => {
    event.preventDefault();
    const updateData = {};
    $(event.currentTarget).serializeArray().forEach((attribute) => {
      updateData[attribute.name] = attribute.value;
    });
    if (updateData.title.length <= 15 && updateData.description.length <= 200) {
      updateContent(updateData, displayUpdatedPicture);
    } else {
      $('.error-container').html('<h4>Title must be under 16 characters. Description must be under 201 characters</h4>');
    }
  });
}

function titleLengthReq(title) {
  if (title.length <= 15) {
    return true;
  }
  return false;
}

function descriptionLengthReq(title) {
  if (title.length <= 15) {
    return true;
  }
  return false;
}

function watchUpdateButton() {
  $('.photo-box-screen-overlay').on('click', '.edit-button', (event) => {
    event.preventDefault();
    getOnePicture(STATE.id, displayUpdateForm);
  });
}

function displayUpdateForm(data) {
  $('.photo-box-screen-overlay').empty();
  const updateForm = renderUpdateForm(data);
  $('.photo-box-screen-overlay').html(updateForm);
}

function displayUpdatedPicture() {
  console.log('it reaches this function');
  $('.photo-box-screen-overlay').empty();
  getAndDisplayPicture(STATE.id);
}

function renderUpdateForm(entry) {
  viewportChecker();
  if (STATE.viewportWidth > 800 && STATE.viewportHeight > 680) {
    return `
    <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="form-container">
    <div class="error-container"></div>
      <div class="single-photo-container">
        <img class="indv-pic" src="${entry.largePicture}">
      </div>
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
  return `
  <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
  <div class="form-container">
    <div class="single-photo-container">
      <img class="indv-pic" src="${entry.smallPicture}">
    </div>
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


function watchUploadWidget() {
  $('#upload_widget_opener').on('click', () => {
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

// function watchUpload() {
//   $('.cloudinary-fileupload').bind('cloudinarydone', (e, data) => {
//     $('.preview').html(
//       $.cloudinary.imageTag(data.result.public_id,
//         {
//           format: data.result.format,
//           version: data.result.version,
//           crop: 'scale',
//           width: 200,
//         }),
//     );
//     $('.image_public_id').val(data.result.public_id);
//     console.log(data.result.public_id);
//     return true;
//   });
// }

function displayPostForm() {
  const formPost = renderPostForm();
  $('.photo-box-screen-overlay').html(formPost).fadeIn(500);
  watchPostFormSubmit();
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
      <label for="description">description</label>
      <input class="photo-form-field" type="text" name="description"/>
      <label for="author">Photographer</label>
      <input class="photo-form-field" type="text" name="author"/>
      <label for="button"></label>
      <button type="submit" form="create-photo-post-form" class="ph-btn-grey ph-button form-button" value="submit">Post</button>
      </form>
      
    </div>
  `;
}

function renderPictures(entry) {
  return `
        <div class="box">
        <article role="article" class="image-box">
          <img class="gal-pic" alt="${entry.title}" src ="${entry.smallPicture}">
                        <ul class="img-content">
                           <li><h4 class="img-title">${entry.title}</h4></li>
                           <li><h5 class="author">${entry.author}</h5></li>
                           <p hidden class="photoId">${entry.id}</></li>
                       </ul>
          </article>
        </div>`;
}

function displayPictures(data) {
  const pictureBoxes = data.photoPosts.map(item => renderPictures(item)).join('');
  $('.row').html(pictureBoxes);
}

function displayPicture(data) {
  const pictureBox = renderPicture(data);
  $('.photo-box-screen-overlay').html(pictureBox).fadeIn(500);
  watchUpdateFormSubmit();
  watchDeleteButton();
}

function viewportChecker() {
  STATE.viewportWidth = $(window).width();
  STATE.viewportHeight = $(window).height();
}

function renderPicture(entry) {
  viewportChecker();
  if (STATE.viewportWidth > 800 && STATE.viewportHeight > 680) {
    return `
    <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="photo-box-screen">
      <div class="single-photo-container">
        <img class="indv-pic" src="${entry.largePicture}">
      </div>
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
  }
  return `
    <button type="button" class="exit-button"><img src="pics/exit-button.png" alt="exit"></button>
    <div class="photo-box-screen">
      <div class="single-photo-container">
        <img class="indv-pic" src="${entry.smallPicture}">
      </div>
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

function watchDeleteButton() {
  $('.delete-button').click((event) => {
    event.preventDefault();
    displayDeletePrompt();
  });
}

function displayDeletePrompt() {
  const deletePromptBox = renderDeletePrompt();
  $('.photo-box-screen-overlay').html(deletePromptBox).fadeIn(500);
  console.log(STATE.id);
  watchDoNotDeleteButton();
  watchYesDeleteButton();
}

function renderDeletePrompt() {
  return `<div class="delete-prompt-box"> Are you sure you want to delete?
  <button type="button" class="yes-delete-button ph-btn-red ph-button">Yes</button>
      <button type="button" class="do-not-delete-button ph-btn-blue ph-button">No</button>
      </div>
  `;
}
function getAndDisplayPictures() {
  getPictures(displayPictures);
}

function watchYesDeleteButton() {
  $('.yes-delete-button').click((event) => {
    event.preventDefault();
    deletePicture();
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}

function watchDoNotDeleteButton() {
  $('.do-not-delete-button').click((event) => {
    event.preventDefault();
    window.location.reload(true);
    $('.photo-box-screen-overlay').empty().fadeOut(500);
  });
}
$.cloudinary.config({ cloud_name: 'dljvx3nbw', secure: true });

function loadPage() {
  getAndDisplayPictures();
  watchPictureBoxes();
  watchExitButton();
  watchPostButton();
  watchUpdateButton();
}

$(loadPage);

const STATE = {
  viewportHeight: 0,
  viewportWidth: 0,
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
    datatype: 'json',
    contentType: 'application/json',
    success: callback,
  };
  $.ajax(queryData);
}

function createPicture(postData, callback) {
  const queryData = {
    url: '/photos/post',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify(postData),
    success: callback,
  };
  $.ajax(queryData);
}

function getAndDisplayPicture(id) {
  getOnePicture(id, displayPicture);
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

function watchPostButton() {
  $('nav').on('click', '.post-button', (event) => {
    event.preventDefault();
    displayPostForm();
    let upload = new FileUploadWithPreview('astroUpload');
    // watchUploadWidget();
  });
}


function displayPostForm() {
  const formPost = renderPostForm();
  $('.photo-box-screen-overlay').html(formPost).fadeIn(500);
}
// {/* <a href="#" id="upload_widget_opener">Upload image</a> */}
function renderPostForm() {
  return `
  <button type="button" class="exit-button"><img src="pics/icon.png" alt="exit"></button>
    <div class="form-container">
      <form id="create-photo-post-form">
            <div class="custom-file-container" data-upload-id="astroUpload">
                <label>Upload (Single File) <a href="javascript:void(0)" class="custom-file-container__image-clear" title="Clear Image">x</a></label>
                <label class="custom-file-container__custom-file" >
                    <input type="file" class="custom-file-container__custom-file__custom-file-input" accept="image/*">
                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                    <span class="custom-file-container__custom-file__custom-file-control"></span>
                </label>
                <div class="custom-file-container__image-preview"></div>
            </div>


      <label for="title">Title</label>
      <input type="text" name="title"/>
      <label for="description">description</label>
      <input type="text" name="description"/>
      <label for="author">Photographer</label>
      <input type="text" name="author"/>
      <button type="submit" class="ph-btn-grey ph-button form-button">Post</button>
      </form>
    </div>
  `;
}

// function watchUploadWidget() {
//   $('#upload_widget_opener').on('click', () => {
//     cloudinary.openUploadWidget({ cloud_name: 'dljvx3nbw', upload_preset: 'phlaser_', form: '#create-photo-post-form', field_name: 'photo', thumbnails: '.photo-slot'},
//       (error, result) => { console.log(error, result); });
//   });
// }


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

function viewportChecker() {
  STATE.viewportWidth = $(window).width();
  STATE.viewportHeight = $(window).height();
}

function renderPicture(entry) {
  viewportChecker();
  if (STATE.viewportWidth > 800 && STATE.viewportHeight > 680) {
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
        <li>${entry.description}</li>
      </ul>
    </div>
    `;
  }
  return `
    <button type="button" class="exit-button"><img src="pics/icon.png" alt="exit"></button>
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
    </div>
    `;
}

function getAndDisplayPictures() {
  getPictures(displayPictures);
}

function watchUpload() {
  $('.cloudinary-fileupload').bind('cloudinarydone', (e, data) => {
    $('.preview').html(
      $.cloudinary.imageTag(data.result.public_id,
        {
          format: data.result.format,
          version: data.result.version,
          crop: 'scale',
          width: 200,
        }),
    );
    $('.image_public_id').val(data.result.public_id);
    console.log(data.result.public_id);
    return true;
  });
}

$.cloudinary.config({ cloud_name: 'dljvx3nbw', secure: true });

function loadPage() {
  getAndDisplayPictures();
  watchPictureBoxes();
  watchExitButton();
  watchPostButton();
  watchUpload();
}

$(loadPage);

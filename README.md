# astro-pics
-----------------

https://pacific-fjord-73675.herokuapp.com/

A simple node, express and mongo app where you can share and post your space-related photos! 

Sample Login Info:
Username: testpenguin5
password: testpenguin5

Features: 
-----------------
view Readme-Pictures folder to see corresponding pictures

- Available for all users:
  - View all the post on the landing page. (see Landing-Page.png)
  - Login or signup and create an account. (see Login-Screen.png or Sign-Up-Screen.png)
  - Click on an image to view enlarged image with information. (see Image-Screen.png)
  
- Available one a user has created an account and signed in:'
  - View your home page with a post button (see Home-Screen.png)
  - Upload an image and create a post. (see Upload-Screen.png)
  - Delete or edit your own post. (see User-Post-Screen.png)
  
Technologies used:
-----------------
- Node
- Express
- Passport
- MongoDB
- Javascript
- Jquery
- Cloudinary
- HTML/CSS

API
-----------------
Get all post: GET --> /photos/all 

Get a single post: GET --> /photos/:id

Requires authentication:

Creating a post: POST --> /photos/post

Updating a post: PUT --> /photos/:id

Deleting a post: DELETE --> /photos:id
 


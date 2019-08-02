# Family Doggo
A MERN (MongoDB, Express, React, Node.js) web application to keep track on the daily walks with the family dog(s). Start keeping track by
registering with an email, verifying it, login, create a family, register dog, and invite others to start adding walks after every walk with the family dog.
[Click here to see a running example of the Family Doggo web application.](https://familydoggo.herokuapp.com/)
## Basic Info
* Uses MongoDB for data storage
* Express and Node.js in the backend
* React in the frontend
* Socket.io is used for the walks, meaning that a family's walks are in real-time
## Usage
Configuration variables are under the config folders (one in root folder, one in client folder). In development mode a **.env** file was used and
for production mode (Heroku) the configuration variables were manually added through the CLI.
### What you will need to do
First of all you will need to create a gmail account and save the credentials as configuration variables (username in config/config.js and password in the .env file).
After that create a **.env** file and store: 
* `GMAIL_PASSWORD` 
* `MONGO_URI` 
* `COOKIE_SECRET` 
* `JWT_SECRET` 
* and `REACT_APP_SERVER_API` if you want to use it in production
After that just run `npm install`, `npm run client-install`, and finally `npm run dev` and you should be ready to go.

Make sure you don't forget to change `GMAIL_USERNAME` in config/config.js.

## License

MIT License

# SCM-backend

Supply chain management system. This is the backend of the system. Written in:
* Node.js
* Express
* Mongoose

Using the following technologies:
* MongoDB
* OAuth2 (Google Sign-In)
* Google Maps Directions and DistanceMatrix APIs
* AWS SES
* ESLint

# Installation and configuration

Install the dependencies using the following command:
```
npm install
```

Edit `.env` file to have values for the following properties:
* `PORT` - HTTP server port
* `DB_HOST` - MongoDB hostname
* `DB_NAME` - MongoDB database name
* `CLIENT_REDIRECT` - URL for client redirect after Google Sign In
* `CLIENT_ID` - Google OAuth2 client id
* `CLIENT_SECRET` - Google OAuth client secret
* `JWT_SECRET` - JWT secret used for token encryption
* `UI_URL` - URL for UI
* `GOOGLE_MAPS_API_KEY` - Google API key with permissions to access Maps, Directions and Distance Matrix APIs
* `AWS_ACCESS_KEY_ID` - AWS access key with permissions to access SES
* `AWS_SECRET_ACCESS_KEY` - AWS secret access key with permissions to access SES


# Running

## Run server in development mode
```
npm run start:dev
```

## Run MongoDB locally
```
C:/Users/Polya/mongodb/bin/mongod.exe --dbpath=c:/Users/Polya/mongodb_data
```

## Run server in production
```
npm start
```

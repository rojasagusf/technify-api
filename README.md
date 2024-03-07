# Technify api

## Usage

### Run in testing mode

##### Create a new .env file with default settings

##### Execute:

`npm install`

##### Then:

`npm run dev`

### Run in production mode

##### Execute:

`npm install`

##### Then:

`npm start`

### Run tests

##### Execute:

`docker build -t "testbuild" . && docker run --name=database -e MYSQL_ROOT_PASSWORD=testpass -e MYSQL_DATABASE=test -e MYSQL_PASSWORD=testpass -e MYSQL_USER=root -d mysql:latest && docker run --name=test --link=database:database --env-file .env.test testbuild npm test; docker rm test; docker rm -f database;`

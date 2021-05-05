# airlineDB
airline management system

clone directory using 
`git clone git@github.com:vkapur2202/airlineDB.git`
or
`git clone https://github.com/vkapur2202/airlineDB.git`

cd into the project by typing 
`cd airlineDB` 
into your terminal.

then, run:
`npm install`
in order to get all of the dev dependencies

in order to get your .env file working properly, use the link sent in the slack.
create a file called .env (perhaps using `touch .env` in your terminal) within the root directory and then add the line of code:
CONNECTION_STRING = {insert connection link here}

execute `node seed.js` to reset/seed the database.

alternatively, run `npm run reset-db` to reset/seed the database.

in order to re-initialize the database (if any changes are made to the init_db.sql file), run the folloiwing command in the terminal with the appropriate password.

psql --host=airline-management-db.cb7isu5t5kyq.us-east-2.rds.amazonaws.com --port=5432 --username postgres --password --dbname=airlinesDB < database/init_db.sql


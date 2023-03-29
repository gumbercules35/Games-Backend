# Gumbercules House Of Games API

Created for the Back End Portfolio week of the NorthCoders Bootcamp this API provides communication to a database for a Board Game review website, which will allow users to post reviews on their favourite board games and comment on other reviews!

[Check it out here!](gumbercules-hog-api.onrender.com)

## Initial Setup

**_This API was created using NODE v19.7.0 and psql (PostgreSQL) 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1) Please ensure you have these version (or compatible) installed_**

1. Clone this repo to your local machine using terminal
   > _git clone https://github.com/gumbercules35/Games-Backend.git_
2. Install required dependencies using the node package manager

   > _npm install_

3. This API uses dotenv to securely handle creation of database names. Please follow these steps:

   1. Choose the desired names for your databases in db/setup.sql
   2. Create two .env files .env.test and .env.development
   3. In each file, declare the environment variable PGDATABASE = <your_database_name_here>

      > make sure to use the relevant database names.

   4. use the following command in terminal to create the databases
      > _npm run setup-dbs_

4. Seed the **_local_** database by running the following command in terminal

   > _npm run seed_

5. Check everything is in place by running the test suite using:

   > _npm test app.js_

6. If all tests pass setup has been successful

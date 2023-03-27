# Northcoders House of Games API

## Initial Setup

This API uses dotenv to securely handle creation of database names. Please follow these steps to get started:
-Install dependencies with npm install
-Choose the desired names for your databases in db/setup.sql
-Create two .env files .env.test and .env.development
-In each file, declare the environment variable PGDATABASE = <your_database_name_here>, making sure to use the relevant database names.

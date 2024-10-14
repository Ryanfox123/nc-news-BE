Instructions to setup .env files

In order to correctly setup .env files and connect to your database you will need to create 2 .env files. First will
be your development file, name this '.env.development' and inside this file set a variable named 'PGDATABASE'. This
will be set to the name of your development database, ex: 'PGDATABASE:MY_DATABASE'. Repeat this for your second file
instead named '.env.test' where your variable will instead be set to your test database name. This will allow our
connection.js file to properly connect to the intended database depending on whether youre testing or using it for
development purposes. Make sure these files are ignored by git.

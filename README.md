# NC-NEWS-BACKEND

An express API to mimic a service such as reddit, a classic article based news backend that can provide
articles, comments and users information.

## Prerequisites

- [node v22](https://nodejs.org/en/blog/announcements/v22-release-announce)
- Ensure postgres is running, and create a `.env`, see [.env.example](./.env.example)

## Install dependencies

```sh
nc-news-be $ npm install
```

## Running the application

Before running the application, you'll need to ensure the database has been `migrated` and `seeded`

```sh
nc-news-be $ npm run setup-dbs
nc-news-be $ npm run setup-seed
```

Once completed, to start the application:

```sh
nc-news-be $ npm start
```

I am using Supabase to host my database and Render to host my api. You should now be able to visit `https://nc-news-app-ftk2.onrender.com/api/articles`, for a full list of possible endpoints, view [endpoints.json](./endpoints.json).

## Creating .ENV files

This project requires 2 .env files to be created to work locally, one for your testing, one for development. Inside each file should contain variables that will assign the database you intend to connect to. Look inside [connection.js](./db/connection.js) to understand better how this works.

For example inside `.env.test` you would find:
`PGDATABASE=example_test_db`.

# NC-NEWS-BE

An express API to...

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

You should now be able to visit `http://localhost:8080/api/topics`, for a full list of topics, view [endpoints.json](./endpoints.json).

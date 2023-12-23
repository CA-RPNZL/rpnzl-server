# RPNZL Server

Developed by [Carmina](https://github.com/CarminaF), [Emily](https://github.com/e-mehegan), [Stephen](https://github.com/StevieG46) and [Helen](https://github.com/hotteok219) for Coder Academy T3A2 Part B assignment.

## Links

Visit RPNZL here: [https://rpnzl.studio/](https://rpnzl.studio)

- [Client repository](https://github.com/CA-RPNZL/rpnzl-client)
- [Server repository](https://github.com/CA-RPNZL/rpnzl-server)
- [Docs repository](https://github.com/CA-RPNZL/rpnzl-docs)

## Scripts

Before running the app, please ensure you have Mongo DB stored locally or have a Mongo DB cloud set up.

Depending on your operating system, you may also need to ensure Mongo DB is running in the background when running locally. (Refer to: [Manage mongod Processes](https://www.mongodb.com/docs/manual/tutorial/manage-mongodb-processes/)).

An example local Mongo DB database URI could be `mongodb://localhost:27017/rpnzl`.

You will need to create a `.env` file, which you can reference from the `.env.sample`.

### Seeding the database

When seeding the database, please wait till you reach the log `Finished seeding appointments`.

Example:
```
Database connected.
Creating seed data
Finished seeding services
Finished seeding users
Finished seeding appointments
```

Once you've reached that stage, hit `Ctrl + C` to exit.

#### `npm run seed`

Use this script to seed the production database.

#### `npm run dev-seed`

Use this script to seed the local database.

### Wiping the database

For `prod` environments, please log into your Mongo DB cloud and remove the data. Don't forget to reseed.

#### `npm run dev-wipe`

Use this script to wipe the local database. Don't forget to reseed.

### Running the app

#### `npm start`

Use this script to start the app in prod.

#### `npm run dev`

Use this script to start the app locally.

### Testing the app

Please ensure you seed your database prior to testing.

#### `npm test`

Use this script to test the app using Jest.

#### `npm run test-coverage`

Use this script to test, and view the test coverage, using Jest.
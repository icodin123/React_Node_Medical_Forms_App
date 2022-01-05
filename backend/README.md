# DocForm Backend

## Requirements

- node.js
- npm

## Setup

- Run `npm install` (This should install production and development dependencies)
- Run `npm run dev` to start server
- The server will be running on port `3000`

## Database Setup

- Create a database with the name `docform`
- Use the sql files under `/db` to create the necessary tables
- Modify the `.env` file to contain the correct credentials

## Scripts

- `npm run lint`
  - This will run the linter on all files.
- `npm run test`
  - This will run the api unit tests.
- `npm run dev`
  - This will start a development server using nodemon.

## Note

- We are using [eslint](https://eslint.org/) to lint our code.
- For our backend testing we are using [mocha.js](https://mochajs.org/).
- To keep our code clean we are using [husky](https://www.npmjs.com/package/husky). Husky will automatically run the linter and tests on commits and pushes.

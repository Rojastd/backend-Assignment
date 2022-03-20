const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "friendsdata.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/friends/", async (request, response) => {
  const getFriendsQuery = `
SELECT
*
FROM
friends
;`;
  const friendsArray = await database.all(getFriendsQuery);
  response.send(friendsArray);
});

app.get("/friends/:id/", async (request, response) => {
  const { id } = request.params;

  const getFriendQuery = `
SELECT
*
FROM
friends
WHERE
id = ${id};`;
  const friend = await database.get(getFriendQuery);
  response.send(friend);
});

app.post("/friends/", async (request, response) => {
  const friendDetails = request.body;
  const { id, name } = friendDetails;
  console.log(id, name);
  const addFriendQuery = `
  INSERT INTO
  friends (id,name)
  VALUES
  (${id},'${name}');`;
  await database.run(addFriendQuery);
  response.send("Friend Added Successfully");
});

module.exports = app;

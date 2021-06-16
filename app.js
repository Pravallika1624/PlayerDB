const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const app = express();
app.use(express.json());
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

//Get Players
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT * FROM cricket_team ORDER BY player_id;
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//Add Player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team
    (player_name,jersey_number,role) VALUES ('${player_name}',${jersey_number},'${role}');`;
  await db.run(addPlayerQuery);

  response.send("Player Added to Team");
});

//GetPlayer
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//Update Player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const UpdateQuery = `UPDATE cricket_team SET player_name='${player_name}',jersey_number=${jersey_number},
  role='${role}' WHERE player_id=${playerId};`;
  await db.run(UpdateQuery);
  response.send("Player Details Updated");
});

//Delete Player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;

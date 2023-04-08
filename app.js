const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const DBpath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());

let db = null;

const ConnectDB = async () => {
  try {
    db = await open({
      filename: DBpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running on localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error is ${e.message}`);
  }
};

ConnectDB();

//convert to object
const ConverttoObj = (items) => {
  return {
    player_id: items.player_id,
    player_name: items.player_name,
    jersey_number: items.jersey_number,
    role: items.role,
  };
};

//Get method

app.get("/players/", async (req, res) => {
  const query = `SELECT * FROM cricket_team`;
  const detail = await db.all(query);
  //   console.log(typeof GetAllPlayerRes);
  res.send(detail.map((item) => ConverttoObj(item)));
});

// Post method

app.post("/players/", async (req, res) => {
  const { playerName, jerseyNum, role } = req.body;
  let addQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)
  VALUES('${playerName}','${jerseyNum}','${role}')`;
  await db.run(addQuery);
  res.send(`Player Added to Team`);
});

// get player detail using player id

app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const query = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;
  const playerDetail = await db.get(query);
  res.send(ConverttoObj(playerDetail));
});

//update player detail

app.put("/players/:playerId", async (req, res) => {
  const { playerId } = req.param;
  const { playerName, jerseyNum, role } = req.body;
  const query = `UPDATE cricket_team SET player_name='${playerName}',
  jersey_number='${jerseyNum}',role='${role}' WHERE player_id='${playerId}'`;
  await db.run(query);
  res.send("Player Details Updated");
});

//delete player on table

app.delete("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const query = `DELETE FROM cricket_team WHERE player_id='${playerId}'`;
  await db.run(query);
  res.send("Player Removed");
});

module.exports = app;

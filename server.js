const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  db.select("*")
    .from("Accounts")
    .then(accounts => {
      console.log(accounts);
      res.status(200).json(accounts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "failed to get the list of posts" });
    });
});

server.post("/", (req, res) => {
  // add a post
  // insert into posts () values ()
  db("Accounts")
    .insert(req.body) // will generate a warning on console when using sqlite, ignore that
    .then(ids => {
      // adding that return sends any errors up the chain to be
      // handled by the catch in line 50. Reading up on Promises will make it clearer.
      return getById(ids[0]).then(inserted => {
        res.status(201).json(inserted);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "failed to add the post" });
    });
});

server.put("/:id", (req, res) => {
  db("Accounts")
    .where({ id: req.params.id })
    .update(req.body)
    .then(() => {
      // adding that return sends any errors up the chain to be
      // handled by the catch in line 50. Reading up on Promises will make it clearer.
      return getById(req.params.id).then(inserted => {
        res.status(200).json(inserted);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "failed to add the post" });
    });
});

server.delete("/:id", (req, res) => {
  db("Accounts")
    .where({ id: req.params.id })
    .del()
    .then(() => {
      res.status(200).json({ message: "account deleted" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "failed to add the post" });
    });
});

module.exports = server;

function getById(id) {
  return db("Accounts")
    .where({ id })
    .first();
}

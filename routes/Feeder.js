const express = require("express");
const router = express.Router();

const { FeederServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    name: req.body.name,
    diameter: req.body.diameter,
  };

  FeederServices.create(data).then((result) => {
    res.send(result);
  });
});

router.get("/getAll", (req, res) => {
  FeederServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const feederId = req.body.id;

  FeederServices.getById(feederId).then((data) => {
    res.send(data);
  });
});

router.post("/delete", (req, res) => {
  const feederId = req.body.id;

  console.log(req.body);
  FeederServices.delete(feederId).then((data) => {
    res.send(data);
  });
});

router.post("/deleteAll", (req, res) => {
  FeederServices.deleteAll().then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

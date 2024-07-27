const express = require("express");
const router = express.Router();

const { LfaServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    name: req.body.name,
    diameter: req.body.diameter,
  };

  console.log(data)
  LfaServices.create(data).then((result) => {
    res.send(result);
  });
});

router.get("/getAll", (req, res) => {
  LfaServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const lfaId = req.body.id;

  LfaServices.getById(lfaId).then((data) => {
    res.send(data);
  });
});

router.post("/delete", (req, res) => {
  const lfaId = req.body.id;

  LfaServices.delete(lfaId).then((data) => {
    res.send(data);
  });
});

router.post("/deleteAll", (req, res) => {
  LfaServices.deleteAll().then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

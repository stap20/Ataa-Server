const express = require("express");
const router = express.Router();

const { ElectronicBoardServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    macAddr: req.body.mac_addr,
  };

  ElectronicBoardServices.create(data).then((result) => {
    res.send(result);
  });
});

router.get("/getAll", (req, res) => {
  ElectronicBoardServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const electronicBoardId = req.body.id;

  ElectronicBoardServices.getById(electronicBoardId).then((data) => {
    res.send(data);
  });
});

router.post("/delete", (req, res) => {
  const electronicBoardId = req.body.id;

  ElectronicBoardServices.delete(electronicBoardId).then((data) => {
    res.send(data);
  });
});

router.post("/deleteAll", (req, res) => {
  ElectronicBoardServices.deleteAll().then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

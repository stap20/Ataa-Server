const express = require("express");
const router = express.Router();

const { MachineTypeServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    name: req.body.name,
  };

  MachineTypeServices.create(data).then((result) => {
    res.send(result);
  });
});

router.get("/getAll", (req, res) => {
  MachineTypeServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const machineTypeId = req.body.id;

  MachineTypeServices.getById(machineTypeId).then((data) => {
    res.send(data);
  });
});

router.post("/delete", (req, res) => {
  const machineTypeId = req.body.id;

  MachineTypeServices.delete(machineTypeId).then((data) => {
    res.send(data);
  });
});

router.post("/deleteAll", (req, res) => {

  MachineTypeServices.deleteAll().then((data) => {
    res.send(data);
  });
});



// Export the router
module.exports = router;

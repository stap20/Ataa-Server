const express = require("express");
const router = express.Router();

const { MachineServices } = require("@services");

router.post("/create", (req, res) => {
  const machineData = req.body.machine;

  const data = {
    noOfneedles: req.body.no_of_needles,
    coursws: req.body.coursws,
    wales: req.body.wales,
    diameter: req.body.diameters,
    machineId: req.body.machine_id,
  };

  //left it later
  MachineServices.create(data).then((result) => {
    res.send(result);
  });
});

router.get("/getAll", (req, res) => {
  MachineServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const machineId = req.body.id;

  MachineServices.getById(machineId).then((data) => {
    res.send(data);
  });
});

router.post("/delete", (req, res) => {
  const machineId = req.body.id;

  MachineServices.delete(machineId).then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

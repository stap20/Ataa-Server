const express = require("express");
const router = express.Router();

const { MachineProfileServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    profileData: req.body.profileData,
    machineTypeId: req.body.machineTypeId,
    feederList: req.body.feederList.map(
      ({ id, yarn_count, number_of_feeder }) => ({
        id,
        count: yarn_count,
        noOfFeeder: number_of_feeder,
      })
    ),
    lfaList: req.body.lfaList,
    
  };

  MachineProfileServices.create(data).then((result) => {
    res.send(result);
  });
});

router.get("/getAll", (req, res) => {
  MachineProfileServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const machineProfileId = req.body.id;

  MachineProfileServices.getById(machineProfileId).then((data) => {
    res.send(data);
  });
});

router.post("/delete", (req, res) => {
  const machineProfileId = req.body.id;

  MachineProfileServices.delete(machineProfileId).then((data) => {
    res.send(data);
  });
});

router.post("/deleteAll", (req, res) => {
  MachineProfileServices.deleteAll().then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

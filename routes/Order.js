const express = require("express");
const router = express.Router();

const { OrderServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    startDate: req.body.start_date,
    endDate: req.body.end_date,
    target_weight: req.body.target_weight,
    target_rolls: req.body.target_rolls,
    complete_weight: req.body.complete_weight,
    complete_rolls: req.body.complete_rolls,
    workingMachines: req.body.working_machines,
  };

  OrderServices.create(data).then((result) => {
    res.send(result);
  });
});

router.post("/delete", (req, res) => {
  const orderId = req.body.id;

  OrderServices.delete(orderId).then((data) => {
    res.send(data);
  });
});

router.get("/getAll", (req, res) => {
  OrderServices.getAll().then((data) => {
    res.send(data);
  });
});

router.get("/get", (req, res) => {
  const orderId = req.body.id;

  OrderServices.getById(orderId).then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

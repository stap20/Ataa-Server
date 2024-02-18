const express = require("express");
const router = express.Router();

const { MessageServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    acceptMessage: req.body.acceptMessage,
    rejectMessage: req.body.rejectMessage,
    rejectStorageMessage: req.body.rejectStorageMessage,
  };

  MessageServices.create(data).then((result) => {
    res.send(result);
  });
});

router.post("/getMessages", (req, res) => {
  MessageServices.getMessage().then((data) => {
    res.send(data);
  });
});

router.post("/updateMessage", (req, res) => {
  const data = {
    id: req.body.id,
    acceptMessage: req.body.acceptMessage,
    rejectMessage: req.body.rejectMessage,
    rejectStorageMessage: req.body.rejectStorageMessage,
  };
  MessageServices.update(data).then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

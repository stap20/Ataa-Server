const express = require("express");
const router = express.Router();
const { Uploader } = require("@utils");

const { DonationServices } = require("@services");

router.post("/create", Uploader.upload.array("images"), (req, res) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_";
  const results = [];

  req.files.forEach((image, index) => {
    let imageId = "";
    for (let i = 0; i < 16; i++) {
      imageId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const typeName = "donation";
    const isIncludedCompressed = req.body.isCompressed;

    const imageName = imageId + "_" + Date.now();

    const compressedImageName = imageId + "_" + Date.now() + "_comp";

    const params = {
      image: image,
      imageName: imageName,
      uploadPath: "uploads/" + typeName,
    };

    if (isIncludedCompressed) {
      params.compressed = { name: compressedImageName };
    }

    const result = Uploader.logic(params);
    results.push(result);
  });

  const imagesList = results.map((item) => {
    return item.path;
  });

  const data = {
    donatorId: req.user.userId,
    quantity: req.body.quantity,
    imagesList: imagesList,
    donationTypeId: req.body.donationTypeId,
    donationDescription: req.body.donationDescription, // Note: This is a multiline description
  };

  DonationServices.create(data).then((result) => {
    console.log(req.body.donationTypeId);
    res.send(result);
  });
});

router.post("/getAllDonations", (req, res) => {
  DonationServices.getAllDonations().then((result) => {
    res.send(result);
  });
});

router.post("/getPendingDonations", (req, res) => {
  const user = { id: "65cdc3bdc683a9fcd8ba8221", role: "moderator" };
  if (user.role === "moderator") {
    DonationServices.getPendingDonations().then((result) => {
      res.send(result);
    });
  } else {
    DonationServices.getPendingDonationsByUserId(user.id).then((result) => {
      res.send(result);
    });
  }
});

router.post("/getHistoryDonations", (req, res) => {
  const user = {
    id: req.user.userId,
    role: req.user.userRole,
  };

  if (user.role !== "user") {
    DonationServices.getHistoryDonations().then((result) => {
      res.send(result);
    });
  } else {
    DonationServices.getHistoryDonationByUserId(user.id).then((result) => {
      res.send(result);
    });
  }
});

router.post("/getStorageDonations", (req, res) => {
  DonationServices.getSorageDonations().then((result) => {
    res.send(result);
  });
});

router.post("/emptyStorageDonations", (req, res) => {
  DonationServices.emptySorageDonations().then((result) => {
    res.send(result);
  });
});

router.post("/acceptDonation", (req, res) => {
  const id = req.body.id;
  DonationServices.acceptDonationStatus(id, "accepted").then((result) => {
    res.send(result);
  });
});

router.post("/cancelDonation", (req, res) => {
  const id = req.body.id;

  console.log(req.body);
  DonationServices.updateDonationStatus(id, "canceled").then((result) => {
    res.send(result);
  });
});

router.post("/declineDonation", (req, res) => {
  const id = req.body.id;

  DonationServices.updateDonationStatus(id, "declined").then((result) => {
    res.send(result);
  });
});

module.exports = router;

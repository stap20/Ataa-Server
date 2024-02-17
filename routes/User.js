const express = require("express");
const router = express.Router();
const { Uploader } = require("@utils");
const { UserServices } = require("@services");

router.post("/createModerator", Uploader.upload.single("image"), (req, res) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_";

  let imageId = "";
  for (let i = 0; i < 16; i++) {
    imageId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const typeName = "user";
  const isIncludedCompressed = req.body.isCompressed;

  // Check if an image file has been uploaded
  let profileImage = null;
  if (req.file) {
    const imageName = imageId + "_" + Date.now();
    const compressedImageName = isIncludedCompressed
      ? imageId + "_" + Date.now() + "_comp"
      : null;

    const params = {
      image: req.file,
      imageName: imageName,
      uploadPath: "uploads/" + typeName,
      compressed: compressedImageName ? { name: compressedImageName } : null,
    };

    const result = Uploader.logic(params);
    profileImage = result.path; // Set the profile image path if uploaded
  }

  // Construct the data object for creating the user profile
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    countryCode: req.body.countryCode,
    profileImage: profileImage ?? null,
    role: "moderator",
  };

  UserServices.create(data).then((result) => {
    res.send(result);
  });
});

router.post("/edit", Uploader.upload.single("image"), (req, res) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_";

  let imageId = "";
  for (let i = 0; i < 16; i++) {
    imageId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const typeName = "user";
  const isIncludedCompressed = req.body.isCompressed;

  // Check if an image file has been uploaded
  let profileImage = null;
  if (req.file) {
    const imageName = imageId + "_" + Date.now();
    const compressedImageName = isIncludedCompressed
      ? imageId + "_" + Date.now() + "_comp"
      : null;

    const params = {
      image: req.file,
      imageName: imageName,
      uploadPath: "uploads/" + typeName,
      compressed: compressedImageName ? { name: compressedImageName } : null,
    };

    const result = Uploader.logic(params);
    profileImage = result.path; // Set the profile image path if uploaded
  }

  // Construct the data object for creating the user profile
  const data = {
    id: req.user.userId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    countryCode: req.body.countryCode,
    profileImage: profileImage ?? req.body.profileImage,
  };

  UserServices.update(data).then((result) => {
    res.send(result);
  });
});

router.post("/editModerator", Uploader.upload.single("image"), (req, res) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_";

  let imageId = "";
  for (let i = 0; i < 16; i++) {
    imageId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const typeName = "user";
  const isIncludedCompressed = req.body.isCompressed;

  // Check if an image file has been uploaded
  let profileImage = null;
  if (req.file) {
    const imageName = imageId + "_" + Date.now();
    const compressedImageName = isIncludedCompressed
      ? imageId + "_" + Date.now() + "_comp"
      : null;

    const params = {
      image: req.file,
      imageName: imageName,
      uploadPath: "uploads/" + typeName,
      compressed: compressedImageName ? { name: compressedImageName } : null,
    };

    const result = Uploader.logic(params);
    profileImage = result.path; // Set the profile image path if uploaded
  }

  // Construct the data object for creating the user profile
  const data = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    countryCode: req.body.countryCode,
    profileImage: profileImage ?? req.body.profileImage,
  };

  UserServices.update(data).then((result) => {
    res.send(result);
  });
});

router.post("/deleteModerator", (req, res) => {
  const userId = req.body.id;
  UserServices.deleteUserById(userId).then((data) => {
    res.send(data);
  });
});

router.post("/getModerator", (req, res) => {
  const userId = req.body.id;
  UserServices.getUserById(userId).then((data) => {
    res.send(data);
  });
});

router.post("/getAllModerators", (req, res) => {
  UserServices.getAllUsers("moderator").then((data) => {
    res.send(data);
  });
});

router.post("/getUser", (req, res) => {
  const userId = req.body.id;
  UserServices.getUserById(userId).then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

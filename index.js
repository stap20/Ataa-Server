// Import necessary modules
require("module-alias/register");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const config = require("./config");
const jwt = require("jsonwebtoken");
const { Guard } = require("@utils");
const { UserServices } = require("@services");
const {
  userRoutes,
  categoryRoutes,
  donationRoutes,
  messagesRoutes,
} = require("@routes");

const app = express();
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(config.dbConnection)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error: ", err);
  });

app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, countryCode, password } = req.body;
    const user = await UserServices.getUserPhone(phoneNumber, countryCode);

    if (!user.success || user.data.password !== password) {
      return res.send({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const token = jwt.sign(
      { userId: user.data.id, userRole: user.data.role },
      "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.send({
      success: true,
      message: "Login successful",
      user: user.data,
      token,
    });
  } catch (error) {
    console.error("Error:", error);
    res.send({ success: false, message: "Internal server error" });
  }
});

app.post("/signup", (req, res) => {
  const data = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: req.body.password,
    countryCode: req.body.countryCode,
  };

  UserServices.create(data).then((result) => {
    res.send(result);
  });
});

app.get("/download/*", (req, res) => {
  var filePath = req.params[0];
  filePath = filePath.replace(/(\.\w+)$/, "_comp$1");

  res.download(`./${filePath}`, (err) => {
    if (err) {
      console.log("Error in download: ", err);
      return res.status(500).send("Error downloading image");
    } else {
      console.log("image downloaded successfully");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.use(Guard);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/donation", donationRoutes);
app.use("/message", messagesRoutes);
app.post("/logout", (req, res) => {
  try {
    return res.send({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error:", error);
    return res.send({ success: false, message: "Logout failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}2366`);
});

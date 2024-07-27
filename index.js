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
  ElectronicBoardRoutes,
  LfaRoutes,
  FeederRoutes,
  MachineTypeRoutes,
  MachineProfileRoutes,
  MachineRoutes
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

app.use("/user", userRoutes);
app.use("/electronic_board", ElectronicBoardRoutes);
app.use("/feeder", FeederRoutes);
app.use("/lfa", LfaRoutes);
app.use("/machine_type", MachineTypeRoutes);
app.use("/machine_profile", MachineProfileRoutes);
app.use("/machine", MachineRoutes);


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

app.get("/", (req, res) => {
  res.send("Server Working");
});

// app.use(Guard);

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
  console.log(`Server is running on port ${PORT}`);
});

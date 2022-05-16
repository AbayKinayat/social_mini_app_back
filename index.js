require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const api = require("./api");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const whitelist = ['http://localhost:3000'] 
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api", api);

const start = () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();
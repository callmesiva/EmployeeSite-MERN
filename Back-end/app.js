const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./dbConfig");
const helmet = require("helmet");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

//allowed origin
const corsOptions = {
  origin: "https://employee-site-mern.vercel.app/",
};
app.use(cors(corsOptions));

// Server and DB status check API
app.get("/app/status", async (req, res) => {
  if (db.readyState === 1) {
    res
      .status(200)
      .json({ serverStatus: "OK", database: "Connection successful" });
  } else {
    res.status(500).json({ serverStatus: "Error", error: "Connection error" });
  }
});

const postData = require("./SRC/route/postRoute");
app.use("/", postData);
app.listen(process.env.PORT);

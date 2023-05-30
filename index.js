const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");
const cors = require("cors");
require("dotenv").config()

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); //application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //update to match detail you make requests from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  //set up graphql endpoint
  //graphiql: true -- sets playground
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error ouccred.";
      const code = err.originalError.code || 500;

      return { message: message, status: code, data: data };
    },
  })
);

//error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `${MONGO_SRV}`
  )
  .then((result) => {
    app.listen(8080);
    console.log("server listening at port 8080");
  })
  .catch((err) => console.log(err));

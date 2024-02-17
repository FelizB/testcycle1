const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

try {
  mongoose
    .connect("mongodb://localhost:27017/land", {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("connected to database");
      try {
        app.listen(5000, () => {
          console.log("App is running on port 5000");
        });
      } catch (error) {
        console.log("Some error occurred!");
      }
    });
} catch (error) {
  console.log("Could not connect to mongoose" + error);
}

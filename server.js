const app = require("./app");
const mongoose = require("mongoose");

const { HOST_DB } = process.env;

mongoose
  .connect(HOST_DB)
  .then(() => {
    app.listen(3001);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

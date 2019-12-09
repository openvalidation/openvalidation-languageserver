const njre = require("njre");

njre
  .install(8, { type: "jre" })
  .then(dir => {})
  .catch(err => {
    console.log(err);
  });

const njc = require("node-java-connector");

njc
  .install(8, { type: "jre" })
  .then(dir => {})
  .catch(err => {
    console.log(err);
  });

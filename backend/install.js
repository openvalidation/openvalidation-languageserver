const njb = require("node-java-connector");

njb
  .install(8, { type: "jre" })
  .then(dir => {})
  .catch(err => {
    console.log(err);
  });

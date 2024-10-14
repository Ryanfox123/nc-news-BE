const app = require("./app.js");
app.listen(8080, (err) => {
  if (err) {
    console.log("err -->", err);
  } else console.log("listening on port 8080");
});

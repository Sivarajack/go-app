const { response } = require("express");
const express = require("express");
const app = express();
const path = require("path");
const sites = require("./siteMap.json");
var dir = path.join(__dirname, "public");
const fs = require("fs");
var bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.get("/", (req, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});
app.get("/:path", (req, response) => {
  const name = req.params.path;
  const url = sites[name];
  if (!url) {
    response.sendFile(path.join(__dirname, "error.html"));
    return;
  }
  response.writeHead(302, {
    Location: url,
  });
  response.end();
});
app.post("/addSite", (req, response) => {
  const { name, url } = req.body;
  if (name && url) {
    if (Object.keys(sites).includes(name)) {
      response.sendStatus(409);
      return;
    }
    sites[name] = url;
    fs.writeFileSync("./siteMap.json", JSON.stringify(sites));
    response.sendStatus(201);
  }
});
app.listen(80);

import "dotenv/config";
import { cleanEnv, str } from "envalid";
const env = cleanEnv(process.env, {
  SERVER_LINK: str(),
});
import fs from "fs";
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { create } from "express-handlebars";
import { randomUUID } from "node:crypto";
import fileUpload from "express-fileupload";
const app = express();
const server = createServer(app);
const io = new Server(server);
//handle view templating
const hbs = create();

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("asset"));
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));
// static
app.use(express.static("asset"));
// handle video upload view
app.get("/upload", (req, res, next) => {
  res.render("upload", { layout: false });
});

// handle text input view
app.get("/text/:id", function (req, res) {
  res.render("text", { layout: false, id: req.params.id });
});
// handle text input API
io.on("connection", (socket) => {
  console.log("a user connected");
});
app.post("/api/text", function (req, res) {
  console.log("api/text");
  if (req.body.id && req.body.message) {
    const { id, message } = req.body;
    console.log(id, message);
    io.emit(id, message);
    return res.send("success");
  }
  return res.status(500).send("unknown error occured");
});
// handle video view
app.get("/video/:id", function (req, res) {
  res.render("video", {
    layout: false,
    id: req.params.id,
    textlink: join(env.SERVER_LINK, "text", req.params.id),
  });
});
// handle video select view
app.get("/", function (req, res) {
  res.render("home", {
    layout: false,
    videoLink: fs
      .readdirSync(join(__dirname, "asset", "videos"))
      .filter((name) => name.endsWith(".mp4"))
      .map((link) => join("video", link.split(".")[0])),
  });
});
// hanlde video upload api
app.use(
  fileUpload({
    createParentPath: true,
    preserveExtension: true,
    tempFileDir: "/tmp/",
  })
);
app.post("/api/upload", function (req, res) {
  console.log("api/upload");
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let video = req.files.video;
  if (Array.isArray(video)) {
    return res.status(400).send("only 1 video is allowed/upload");
  }
  if (!video) {
    return res.status(400).send("No video field found");
  }
  if (!video.name.endsWith("mp4")) {
    return res.status(400).send("only mp4 video is allowed");
  }
  const uuid = randomUUID();
  // Use the mv() method to place the file somewhere on your server
  video.mv(join(__dirname, "asset", "videos", uuid + ".mp4"), function (err) {
    if (err) return res.status(500).send(err);
    res.status(200).send(uuid);
  });
});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

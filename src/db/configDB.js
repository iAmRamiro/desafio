import mongoose from "mongoose";

const URI =
  "mongodb+srv://iAmRamiro:lafamilia123@cluster0.q4vycww.mongodb.net/session47315?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("connected to db"))
  .catch((e) => console.log(e));

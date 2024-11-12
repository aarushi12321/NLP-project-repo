const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const dbConnect = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/mydatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.log("connected");
      },
      (error) => {
        console.error(`Connection error: ${error.stack}`);
        process.exit(1);
      }
    );
};

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.json({ success: true });
});

app.post("/api/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    console.log("User saved:", user);
    res.json({ success: true, userId: user._id });
  } else {
    res.json({ success: false });
  }
});

app.use("/api/chats", chatRoutes);

dbConnect();

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

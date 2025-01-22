const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connection");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
require("dotenv").config();

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user')

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGO_URI).then(() =>
  console.log("MongoDB Connected!")
);

app.set("view engine", "ejs");  
app.set("views", path.resolve("./views"));



app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());



app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);


app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
        
    if (!entry) {
      return res.status(404).send("no url found");
    }
    res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

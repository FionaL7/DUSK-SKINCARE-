if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");
const Product = require("./models/product");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const Cart = require("./models/cart");
const cartRoute = require("./routes/cart");
const paymentRoute = require("./routes/payment");
const Review = require("./models/review");
const reviewRoute = require("./routes/review");
const MongoStore = require("connect-mongo");
const ExpressError = require("./utils/expressError");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// || "mongodb://localhost:27017/dusk";
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(cookieParser());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
const secret = process.env.SECRET || "somesecret";
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    httpOnly: true,
    // sameSite: "none",
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
    exprires: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

const scriptSrcUrls = [
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  // "https://kit.fontawesome.com/",
  "https://ka-f.fontawesome.com/",
  "https://res.cloudinary.com/dh3n7ma5g/",
];
const styleSrcUrls = [
  "https://cdnjs.cloudflare.com/",
  "https://kit.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  // "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://res.cloudinary.com/dh3n7ma5g/",
];
const connectSrcUrls = ["https://res.cloudinary.com/dh3n7ma5g/"];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: [
        "'self'",
        "'unsafe-inline'",
        // "https://use.fontawesome.com",
        "https://ka-f.fontawesome.com/",
        "https://res.cloudinary.com/",
      ],
      scriptSrc: [
        "'unsafe-inline'",
        "'unsafe-eval'",
        "'self'",
        ...scriptSrcUrls,
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        ,
        // "https://use.fontawesome.com",
        ...styleSrcUrls,
      ],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      mediaSrc: ["https://res.cloudinary.com/"],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/",
        "https://images.unsplash.com/",
      ],

      fontSrc: [
        "'self'",
        "fonts.googleapis.com",
        // "themes.googleusercontent.com",
        "fonts.gstatic.com",
        // "https://use.fontawesome.com",
        "https://ka-f.fontawesome.com/",
      ],
    },
    // crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-site" },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log(req.user);
  // console.log(req.user);
  next();
});

app.use("/", userRoute);
app.use("/product", productRoute);
app.use("/product/:id/reviews", reviewRoute);
app.use("/", cartRoute);
app.use("/", paymentRoute);

app.get("/", async (req, res) => {
  if (res.locals.currentUser) {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (cart == null) {
      const cartLength = 0;
      res.render("home", { cart, cartLength });
    } else {
      const cart = await Cart.findOne({ userId }).populate("products");
      const cartLength = cart.products.length;
      console.log();
      res.render("home", { cart, cartLength });
    }
  } else {
    let cartLength = 0;
    res.render("home", { cartLength });
  }
});

app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Not found");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err }); // render the error template
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});

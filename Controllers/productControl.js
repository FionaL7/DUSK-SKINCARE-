const Product = require("../models/product");
const Cart = require("../models/cart");
const Review = require("../models/review");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const products = await Product.find({});
  if (res.locals.currentUser) {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (cart == null) {
      const cartLength = 0;
      res.render("Shop/index", { products, cart, cartLength });
    } else {
      const cart = await Cart.findOne({ userId }).populate("products");
      const cartLength = cart.products.length;
      res.render("Shop/index", { products, cart, cartLength });
    }
  } else {
    let cartLength = 0;
    res.render("Shop/index", { products, cartLength });
  }
};

module.exports.newProductForm = (req, res) => {
  res.render("Shop/new");
};

module.exports.addProduct = async (req, res) => {
  const newProduct = await new Product(req.body.product);
  newProduct.user = req.user._id;
  newProduct.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await newProduct.save();
  req.flash("success", "product added");
  res.redirect("/product");
};

module.exports.showPage = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const product = await Product.findById(id).populate("reviews");
  if (req.user) {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (cart == null) {
      const cartLength = 0;
      res.render("Shop/show", { product, cart, cartLength });
    } else {
      const cart = await Cart.findOne({ userId }).populate("products");
      const cartLength = cart.products.length;
      res.render("Shop/show", { product, cart, cartLength });
    }
  } else {
    let cartLength = 0;
    res.render("Shop/show", { product, cartLength });
  }
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deleted = await Product.findByIdAndDelete(id);
  res.redirect("/product");
};

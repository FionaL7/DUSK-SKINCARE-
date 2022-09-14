const Product = require("../models/product");
const Cart = require("../models/cart");
const Address = require("../models/address");
const User = require("../models/user");

module.exports.addToCart = async (req, res) => {
  const { id, name, price, quantity, images } = req.body;
  const x = req.body.id.toString();
  const product = await Product.findById(x);
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });

  if (cart) {
    const prodIndex = cart.products.findIndex((p) => p.id === product.id);

    if (prodIndex > -1) {
      let productItem = cart.products[prodIndex];
      productItem.quantity += 1;
      productItem.price = product.price * productItem.quantity;
      product.inStock -= productItem.quantity;

    
    } else {
      product.quantity = 1;
      cart.products.push(product);
    }
    await cart.save();
    req.flash("success", "Successfully added to cart");
    res.redirect(`/product/${product._id}`);
  } else {
    const newCart = await new Cart({
      userId: userId,
      product: [{ quantity: 0, price: 0, name: "", images: [] }],
    });
    newCart.save();
    req.flash("success", "Cart created");
    res.redirect("/");
  }
};

module.exports.getCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate("products");
  if (!cart || cart.products === []) {
    res.render("Shop/emptycart");
  } else {
    let arr = [];
    for (var i = 0; i < cart.products.length; i++) {
      arr.push(cart.products[i].price);
    }
    let tax = Math.random() * 3;
    console.log(tax);
    let total = arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);

    res.render("Shop/cart", { cart, total });
  }
};

module.exports.addressForm = async (req, res) => {
  res.render("Shop/address");
};

module.exports.submitAddress = async (req, res) => {
  const userId = req.user._id;
  const address = await new Address(req.body);
  const user = await User.findById(userId).populate("addresses");
  await user.addresses.push(address);
  address.user = user;
  address.save();
  user.save();
  res.redirect("/payment");
};

module.exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const product = await Product.findById(id);
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { products: { name: product.name } } }
  );

  res.redirect("/cart");
};

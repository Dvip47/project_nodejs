const express = require("express");
const router = express.Router();
require("../DB/connection");
const Product = require("../model/productSchema");
const User = require("../model/userSchema");
const Order = require("../model/orderSchema");
const authenticate = require("../middleware/authentication");

// add Product
router.post("/addProduct", async (req, res) => {
  const { id, category, src, title, description, Price, discount } = req.body;
  if (!id || !title || !Price || !description) {
    return res.status(442).json({ error: "Check all required feild" });
  }
  try {
    const productExist = await Product.findOne({ description: description });
    if (productExist) {
      return res.status(442).json({ error: "Product already exist" });
    }
    const product = new Product({
      id,
      category,
      src,
      title,
      description,
      Price,
      discount,
    });
    let x = await product.save();

    res.status(201).json({ message: "Product Added Successfulll" });
  } catch (err) {
    console.log(err);
  }
});

// registation

router.post("/registation", async (req, res) => {
  const { name, mobile, email, pass, cpass } = req.body;
  if (!name || !email || !mobile || !pass || !cpass) {
    return res.status(422).json({ error: " Check all require feild" });
  }
  try {
    const userExist = await User.findOne({ mobile: mobile });
    if (userExist?.mobile) {
      console.log("user already exist");
      return res.status(422);
    }
    const user = new User({
      name,
      email,
      mobile,
      pass,
      cpass,
    });
    let x = await user.save();
    // console.log(x);
    res.status(201).json({ message: "registation successfully" });
  } catch (err) {
    console.log(err);
  }
});

// login
router.post("/signin", async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res.status(400).json({ error: "Fill All Feilds" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      if (pass !== userLogin.pass) {
        res.status(400).json({ message: "Invalid Password" });
      }
      res.json({ message: "user Sign in successfully" });
    } else {
      res.status(400).json({ message: "Invalid email" });
    }
  } catch (err) {
    console.log(err);
  }
});

//order

router.post("/order", async (req, res) => {
  const {
    fname,
    lname,
    companyName,
    street,
    city,
    state,
    pinCode,
    mobile,
    email,
    productName,
    quantity,
    price,
    pMode,
  } = req.body;

  if (
    !fname ||
    !lname ||
    !street ||
    !city ||
    !state ||
    !pinCode ||
    !mobile ||
    !email ||
    !productName ||
    !quantity ||
    !price ||
    !pMode
  ) {
    return res.status(400).json({ error: "Check All Required Feild" });
  }
  try {
    const order = new Order({
      fname,
      lname,
      companyName,
      street,
      city,
      state,
      pinCode,
      mobile,
      email,
      productName,
      quantity,
      price,
      pMode,
    });
    let x = await order.save();
    // console.log(x);
    return res.status(201).json({ message: "Order Placed" });
  } catch (err) {
    console.log(err);
  }
});

//admin
router.get("/admin", async (req, res) => {
  let data = await Order.find({});
  return res.status(200).json({ success: true, message: data });
});

//user
router.get("/user", async (req, res) => {
  let data = await User.find({});
  return res.status(200).json({ success: true, message: data });
});

//sofalist
router.get("/sofa", async (req, res) => {
  let data = await Product.find({ category: "Sofa" });
  return res.status(200).json({ success: true, message: data });
});

module.exports = router;

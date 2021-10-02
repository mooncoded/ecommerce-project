const express = require("express");
const Products = require("../models/product");
const multer = require("multer");
const multerConfig = require("../../config/multer");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/consult", async (req, res) => {
  if (req.query.id != null) {
    await Products.findById(req.query.id, function (err, arr) {
      if (err) {
        res.send(err);
      }
      if (arr != null) {
        res.json(arr);
      }
    });
  } else {
    await Products.find({}, function (err, arr) {
      if (err) {
        res.send(err);
      }
      res.json(arr);
    });
  }
});

router.get("/consult_similar_products", async (req, res) => {
  if (req.query.category != null) {
    let category = req.query.category;
    let id = req.query.id;

    await Products.find({ category }, function (err, arr) {
      if (err) {
        res.send(err);
      }
      res.json(arr.filter((item) => item._id != id));
    });
  }
});

router.use(authMiddleware);

router.post(
  "/register",
  multer(multerConfig).single("file"),
  async (req, res) => {
    const { filename: key } = req.file;
    const {
      name,
      description,
      brand,
      category,
      tags,
      countInStock,
      deliveryPrice,
      price,
      quantity,
      portion,
    } = req.body;

    try {
      const products = await Products.create({
        name: name,
        description: description,
        brand: brand,
        category: category,
        tags: JSON.parse(tags),
        countInStock: countInStock,
        deliveryPrice: deliveryPrice,
        price: price,
        quantity: quantity,
        portion: portion,
        image: key,
      });
      return res.status(200).send(products);
    } catch (err) {
      return res.status(400).send({
        error: `Registration failed, please try it again. --> ${err}`,
      });
    }
  }
);

module.exports = (app) => app.use("/product", router);

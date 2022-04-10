const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");

exports.createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    let images = req.body.images;
    let length = images.length;
    let upldedImgs = [];

    for (let i = 0; i < length; i++) {
      let myCloud = await cloudinary.v2.uploader.upload(images[i], {
        folder: "properties",
        width: 150,
        crop: "scale",
      });
      let img = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      upldedImgs.push(img);
    }

    req.body.images = upldedImgs;
    req.body.user = req.user.id;
    let response = await Product.create(req.body);
    res.status(201).json({ response, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    let resultPerPage = 5;
    let apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
    let response = await apiFeature.query;
    let numOfFilteredProduct = response.length;
    apiFeature.pagination(resultPerPage);
    response = await apiFeature.query;
    res.status(200).json({
      success: true,
      response,
      numOfFilteredProduct,
      message: `product fetched`,
      resultPerPage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductDetails = async (req, res, next) => {
  try {
    let response = await Product.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: `product not found` });
    }
    res.status(200).json({ response, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let response = await Product.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: `product not found` });
    }
    let images = [];
    images = req.body.images;

    const imagesLinks = [];

    if (images != undefined) {
      if (images[0].public_id) {
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i].url, {
            folder: "properties",
            public_id: images[i].public_id,
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      } else if (!images[0].public_id) {
        for (let i = 0; i < response.images.length; i++) {
          await cloudinary.v2.uploader.destroy(response.images[i].public_id, {
            folder: "properties",
          });
        }
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "properties",
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }

      req.body.images = imagesLinks;
    }

    response = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    });

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    let response = await Product.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: `product not found` });
    }
    await response.remove();
    res
      .status(200)
      .json({ success: true, message: `product deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

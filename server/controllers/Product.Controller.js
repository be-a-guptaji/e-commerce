import Product from "../models/Product.Model.js";

export const createProduct = async (req, res) => {
  try {
    req.body.discountedPrice =
      Math.round(
        (req.body.price -
          (req.body.price * req.body.discountPercentage) / 100) *
          100
      ) / 100;

    const product = await Product.create(req.body);

    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const pageSize = parseInt(req.query._limit) || 12;
    const page = parseInt(req.query._page) || 1;
    let productsQuery;

    if (req.query.admin === "true") {
      productsQuery = Product.find();
    } else {
      productsQuery = Product.find({ deleted: false });
    }

    if (req.query.category) {
      productsQuery = productsQuery
        .where("category")
        .equals(req.query.category);
    }

    if (req.query.brand) {
      productsQuery = productsQuery.where("brand").equals(req.query.brand);
    }

    if (req.query._sort && req.query._order) {
      productsQuery = productsQuery.sort({
        [req.query._sort]: req.query._order,
      });
    }

    const totalProducts = await Product.countDocuments(
      productsQuery.getQuery()
    );

    productsQuery = productsQuery.skip(pageSize * (page - 1)).limit(pageSize);

    const products = await productsQuery.exec();

    const totalPages = Math.ceil(totalProducts / pageSize);

    res.set("X-Total-Count", totalProducts);
    return res.status(200).json({
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error, could not retrieve products",
      error: error.message,
    });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        discountedPrice:
          Math.round(
            (req.body.price -
              (req.body.price * req.body.discountPercentage) / 100) *
              100
          ) / 100,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

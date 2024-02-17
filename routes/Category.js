const express = require("express");
const router = express.Router();

const { CategoryServices } = require("@services");

router.post("/create", (req, res) => {
  const data = {
    type: req.body.type,
    title: req.body.title,
    icon: req.body.icon,
  };

  CategoryServices.create(data).then((result) => {
    res.send(result);
  });
});

router.post("/deleteCategory", (req, res) => {
  const categoryId = req.body.id;
  CategoryServices.deleteCategoryById(categoryId).then((data) => {
    res.send(data);
  });
});

router.post("/getAllCategories", (req, res) => {
  const categoryId = req.body.id;
  CategoryServices.getAllCategory(categoryId).then((data) => {
    res.send(data);
  });
});

router.post("/getCategory", (req, res) => {
  const categoryId = req.body.id;
  CategoryServices.getCategoryById(categoryId).then((data) => {
    res.send(data);
  });
});

// Export the router
module.exports = router;

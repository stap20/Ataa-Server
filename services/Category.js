const { Category } = require("@schemas");

const CategoryServices = {
  create: async (data) => {
    try {
      const newCategory = new Category(data);
      const category = await newCategory.save();
      return {
        success: true,
        data: category,
        message: "Category created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create category",
      };
    }
  },
  getAllCategory: async () => {
    try {
      const category = await Category.find();
      return {
        success: true,
        data: category,
        message: "Categories retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve categories",
      };
    }
  },
  deleteCategoryById: async (categoryId) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
        return {
          success: false,
          message: "Category not found",
        };
      }
      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete category",
      };
    }
  },
  getCategoryById: async (categoryId) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return {
          success: false,
          message: "Category not found",
        };
      }
      return {
        success: true,
        data: category,
        message: "Category retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve category",
      };
    }
  },
};
module.exports = CategoryServices;

const { Lfa } = require("@schemas");

const LfaServices = {
  create: async (data) => {
    try {
      const newLfa = new Lfa(data);
      const lfa = await newLfa.save();
      return {
        success: true,
        data: lfa,
        message: "Lfa created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create lfa",
      };
    }
  },

  getAll: async () => {
    try {
      const Lfas = await Lfa.find();
      return {
        success: true,
        data: Lfas,
        message: "Lfas retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve lfas",
      };
    }
  },

  getById: async (LfaId) => {
    try {
      const lfa = await Lfa.findById(LfaId);
      if (!lfa) {
        return {
          success: false,
          message: "Lfa not found",
        };
      }
      return {
        success: true,
        data: lfa,
        message: "Lfa retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve lfa",
      };
    }
  },

  delete: async (LfaId) => {
    try {
      const deletedLfa = await Lfa.findByIdAndDelete(
        LfaId
      );
      if (!deletedLfa) {
        return {
          success: false,
          message: "Lfa not found",
        };
      }
      return {
        success: true,
        message: "Lfa deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete lfa",
      };
    }
  },

  deleteAll: async () => {
    try {
      const deleteResult = await Lfa.deleteMany({});

      if (!deleteResult.deletedCount === 0) {
        return {
          success: false,
          message: "No lfas found to delete",
        };
      }
      return {
        success: true,
        message: "All lfas deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete all lfas",
      };
    }
  },
};
module.exports = LfaServices;

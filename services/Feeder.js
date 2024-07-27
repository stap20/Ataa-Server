const { Feeder } = require("@schemas");

const FeederServices = {
  create: async (data) => {
    try {
      const newFeeder = new Feeder(data);
      const feeder = await newFeeder.save();
      return {
        success: true,
        data: feeder,
        message: "Feeder created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create feeder",
      };
    }
  },

  getAll: async () => {
    try {
      const Feeders = await Feeder.find();
      return {
        success: true,
        data: Feeders,
        message: "Feeders retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve feeders",
      };
    }
  },

  getById: async (feederId) => {
    try {
      const feeder = await Feeder.findById(feederId);

      if (!feeder) {
        return {
          success: false,
          message: "Feeder not found",
        };
      }

      return {
        success: true,
        data: feeder,
        message: "Feeder retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve feeder",
      };
    }
  },

  delete: async (feederId) => {
    try {
      const deletedFeeder = await Feeder.findByIdAndDelete(
        feederId
      );
      if (!deletedFeeder) {
        return {
          success: false,
          message: "Feeder not found",
        };
      }
      return {
        success: true,
        message: "Feeder deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete feeder",
      };
    }
  },

  deleteAll: async () => {
    try {
      const deleteResult = await Feeder.deleteMany({});

      if (!deleteResult.deletedCount === 0) {
        return {
          success: false,
          message: "No feeders found to delete",
        };
      }
      return {
        success: true,
        message: "All feeders deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete all feeders",
      };
    }
  },
};
module.exports = FeederServices;

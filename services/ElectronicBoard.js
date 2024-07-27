const { ElectronicBoard } = require("@schemas");

const ElectronicBoardServices = {
  create: async (data) => {
    try {
      const newElectronicBoard = new ElectronicBoard(data);
      const electronicBoard = await newElectronicBoard.save();

      return {
        success: true,
        data: electronicBoard,
        message: "ElectronicBoard created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create electronicBoard",
      };
    }
  },

  getAll: async () => {
    try {
      const ElectronicBoards = await ElectronicBoard.find();
      return {
        success: true,
        data: ElectronicBoards,
        message: "ElectronicBoards retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve electronicBoards",
      };
    }
  },

  getById: async (electronicBoardId) => {
    try {
      const electronicBoard = await ElectronicBoard.findById(electronicBoardId);

      if (!electronicBoard) {
        return {
          success: false,
          message: "ElectronicBoard not found",
        };
      }

      return {
        success: true,
        data: electronicBoard,
        message: "ElectronicBoard retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve electronicBoard",
      };
    }
  },

  delete: async (electronicBoardId) => {
    try {
      const deletedElectronicBoard = await ElectronicBoard.findByIdAndDelete(
        electronicBoardId
      );
      if (!deletedElectronicBoard) {
        return {
          success: false,
          message: "ElectronicBoard not found",
        };
      }
      return {
        success: true,
        message: "ElectronicBoard deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete electronicBoard",
      };
    }
  },

  deleteAll: async () => {
    try {
      const deleteResult = await ElectronicBoard.deleteMany({});

      if (!deleteResult.deletedCount === 0) {
        return {
          success: false,
          message: "No electronicBoards found to delete",
        };
      }
      return {
        success: true,
        message: "All electronicBoards deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete all electronicBoards",
      };
    }
  },
};
module.exports = ElectronicBoardServices;

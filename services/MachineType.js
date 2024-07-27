const { MachineType } = require("@schemas");

const MachineTypeServices = {
  create: async (data) => {
    try {
      const newMachineType = new MachineType(data);
      const machineType = await newMachineType.save();
      return {
        success: true,
        data: machineType,
        message: "Machine type created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create machine type",
      };
    }
  },

  getAll: async () => {
    try {
      const machineTypes = await MachineType.find();
      return {
        success: true,
        data: machineTypes,
        message: "Machine types retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve machine types",
      };
    }
  },

  getById: async (machineTypeId) => {
    try {
      const machineType = await MachineType.findById(machineTypeId);
      if (!machineType) {
        return {
          success: false,
          message: "Machine type not found",
        };
      }
      return {
        success: true,
        data: machineType,
        message: "Machine type retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve machine type",
      };
    }
  },

  delete: async (machineTypeId) => {
    try {
      const deletedMachineType = await MachineType.findByIdAndDelete(
        machineTypeId
      );
      if (!deletedMachineType) {
        return {
          success: false,
          message: "Machine type not found",
        };
      }
      return {
        success: true,
        message: "Machine type deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete machine type",
      };
    }
  },

  deleteAll: async () => {
    try {
      const deleteResult = await MachineType.deleteMany({});

      if (!deleteResult.deletedCount === 0) {
        return {
          success: false,
          message: "No machine types found to delete",
        };
      }
      return {
        success: true,
        message: "All machine types deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete all machine types",
      };
    }
  },
};
module.exports = MachineTypeServices;

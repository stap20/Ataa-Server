const { MachineProfile, MachineLFA, MachineFeeder } = require("@schemas");
const { ObjectId } = require("mongodb");

const MachineProfileServices = {
  create: async ({ profileData, machineTypeId, feederList, lfaList }) => {
    try {
      // Create MachineProfile
      const newMachineProfile = new MachineProfile({
        ...profileData,
        machineTypeId: machineTypeId,
      });
      const machineProfile = await newMachineProfile.save();

      // Create related data in MachineLFA
      const machineLFAPromises = lfaList.map(async (lfaId) => {
        const machineLFAData = {
          machineProfileId: machineProfile._id,
          lfaId: lfaId,
        };
        const newMachineLFA = new MachineLFA(machineLFAData);
        return await newMachineLFA.save();
      });
      await Promise.all(machineLFAPromises);

      // Create related data in MachineFeeder
      const machineFeederPromises = feederList.map(async (feeder) => {
        const machineFeederData = {
          machineProfileId: machineProfile._id,
          feederId: feeder.id,
          count: feeder.count,
          noOfFeeder: feeder.noOfFeeder,
        };
        const newMachineFeeder = new MachineFeeder(machineFeederData);
        return await newMachineFeeder.save();
      });
      await Promise.all(machineFeederPromises);

      return {
        success: true,
        data: machineProfile,
        message: "Machine Profile and related data created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create machine profile and related data",
      };
    }
  },

  getAll: async () => {
    try {
      const MachineProfiles = await MachineProfile.aggregate([
        {
          $lookup: {
            from: "machinelfas", // name of the MachineLFA collection
            localField: "_id",
            foreignField: "machineProfileId",
            as: "machineLFAs",
          },
        },
        {
          $lookup: {
            from: "machinefeeders", // name of the MachineFeeder collection
            localField: "_id",
            foreignField: "machineProfileId",
            as: "machineFeeders",
          },
        },
        {
          $lookup: {
            from: "machinetypes", // name of the MachineType collection
            localField: "machineTypeId",
            foreignField: "_id",
            as: "machineType",
          },
        },
        {
          $unwind: "$machineType", // Unwind the machineType array
        },
        {
          $lookup: {
            from: "machines", // name of the Machine collection
            localField: "machineId",
            foreignField: "_id",
            as: "machine",
          },
        },
        {
          $unwind: {
            path: "$machine",
            preserveNullAndEmptyArrays: true, // Preserve documents that don't have a matching machine
          },
        },
        {
          $project: {
            name: "$profileName",
            type: "$machineType.name",
            noOfNeedles: "$noOfneedles",
            coursws: "$coursws",
            wales: "$wales",
            diameter: "$diameter",
            noOfFeeders: { $size: "$machineFeeders" },
            noOfLfa: { $size: "$machineLFAs" },
            machineName: "$machine.name", // Project machine name directly
          },
        },
      ]);

      return {
        success: true,
        data: MachineProfiles,
        message: "Machine Profiles retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve machine profiles",
      };
    }
  },

  getById: async (machineProfileId) => {
    try {
      const objectId = new ObjectId(machineProfileId);

      const machineProfile = await MachineProfile.aggregate([
        {
          $match: { _id: objectId }, // Filter by the specified machineProfileId
        },
        {
          $lookup: {
            from: "machinelfas", // name of the MachineLFA collection
            localField: "_id",
            foreignField: "machineProfileId",
            as: "machineLFAs",
          },
        },
        {
          $lookup: {
            from: "machinefeeders", // name of the MachineFeeder collection
            localField: "_id",
            foreignField: "machineProfileId",
            as: "machineFeeders",
          },
        },
        {
          $lookup: {
            from: "machinetypes", // name of the MachineType collection
            localField: "machineTypeId",
            foreignField: "_id",
            as: "machineType",
          },
        },
        {
          $unwind: "$machineType", // Unwind the machineType array
        },
        {
          $lookup: {
            from: "machines", // name of the Machine collection
            localField: "machineId",
            foreignField: "_id",
            as: "machine",
          },
        },
        {
          $unwind: {
            path: "$machine",
            preserveNullAndEmptyArrays: true, // Preserve documents that don't have a matching machine
          },
        },
        {
          $project: {
            name: "$profileName",
            type: "$machineType.name",
            noOfNeedles: "$noOfneedles",
            coursws: "$coursws",
            wales: "$wales",
            diameter: "$diameter",
            noOfFeeders: { $size: "$machineFeeders" },
            noOfLfa: { $size: "$machineLFAs" },
            machineName: "$machine.name", // Project machine name directly
          },
        },
      ]);

      if (!machineProfile) {
        return {
          success: false,
          message: "Machine Profile not found",
        };
      }
      return {
        success: true,
        data: machineProfile[0],
        message: "Machine Profile retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve machine profile",
      };
    }
  },

  delete: async (machineProfileId) => {
    try {
      const objectId = new ObjectId(machineProfileId);

      // Delete related data from MachineLFA collection
      await MachineLFA.deleteMany({ machineProfileId: objectId });

      // Delete related data from MachineFeeder collection
      await MachineFeeder.deleteMany({ machineProfileId: objectId });

      // Delete MachineProfile
      const deletedMachineProfile = await MachineProfile.findByIdAndDelete(
        objectId
      );

      if (!deletedMachineProfile) {
        return {
          success: false,
          message: "Machine profile not found",
        };
      }
      return {
        success: true,
        message: "Machine profile deleted successfully",
      };
    } catch (error) {
      console.log(error)
      return {
        success: false,
        error: error,
        message: "Failed to delete machine profile",
      };
    }
  },

  deleteAll: async () => {
    try {
      // Delete all related data from MachineLFA collection
      await MachineLFA.deleteMany({});

      // Delete all related data from MachineFeeder collection
      await MachineFeeder.deleteMany({});

      // Delete all MachineProfiles
      await MachineProfile.deleteMany({});

      return {
        success: true,
        message: "All Machine Profiles and related data deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to delete all Machine Profiles and related data",
      };
    }
  },
};
module.exports = MachineProfileServices;

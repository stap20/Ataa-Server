const { Machine, MachineLogs, MachineEvents } = require("@schemas");

const MachineServices = {
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
      // Aggregate data for all machines
      const allMachinesData = await MachineLogs.aggregate([
        {
          $sort: { createdAt: -1 }, // Sort to get the latest records first
        },
        {
          $group: {
            _id: "$register_id",
            latestLog: { $first: "$$ROOT" }, // Get the latest record for each register_id
            totalMinutes: { $sum: 1 },
          },
        },
        {
          $project: {
            speed: "$latestLog.proxSpeed",
            progress: "$latestLog.progress",
            createdAt: "$latestLog.createdAt",
            workingHours: {
              $ceil: { $divide: ["$totalMinutes", 60] },
            },
          },
        },
        {
          $lookup: {
            from: "machines",
            localField: "_id",
            foreignField: "register_id",
            as: "machineData",
          },
        },
        {
          $unwind: {
            path: "$machineData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            speed: 1,
            progress: 1,
            createdAt: 1,
            workingHours: 1,
            machineId: "$machineData._id",
            machineName: "$machineData.name",
            machineNumber: "$machineData.model",
            machineAddress: "$machineData.machineAddress",
          },
        },
        {
          $lookup: {
            from: "events",
            let: { register_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$register_id", "$$register_id"],
                  },
                },
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: "latestEvent",
          },
        },
        {
          $addFields: {
            isStopped: {
              $cond: [
                {
                  $gt: [
                    { $toDate: "$createdAt" },
                    {
                      $toDate: {
                        $arrayElemAt: ["$latestEvent.createdAt", 0],
                      },
                    },
                  ],
                },
                false,
                true,
              ],
            },
            stopReason: {
              $arrayElemAt: ["$latestEvent.type", 0],
            },
          },
        },
        {
          $lookup: {
            from: "events",
            let: { register_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$register_id", "$$register_id"],
                  },
                },
              },
              {
                $group: {
                  _id: "$type",
                  count: {
                    $sum: {
                      $cond: [{ $eq: ["$type", "IDEAL"] }, 1, 0],
                    },
                  },
                  totalDuration: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$type", "COMPLETE_ROLL"],
                        },
                        {
                          $multiply: ["$count", 60, 3, 1000],
                        },
                        {
                          $subtract: [
                            {
                              $toLong: "$endEventDate",
                            },
                            {
                              $toLong: "$startEventDate",
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              {
                $match: {
                  _id: { $ne: "COMPLETE_ROLL" },
                },
              },
              {
                $group: {
                  _id: null,
                  stoppedDuration: {
                    $sum: {
                      $trunc: {
                        $divide: [{ $sum: "$totalDuration" }, 3600000], // Convert milliseconds to hours
                      },
                    },
                  },
                },
              },
            ],
            as: "stoppedHours",
          },
        },
        {
          $unwind: {
            path: "$stoppedHours",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            stoppedHours: {
              $ifNull: ["$stoppedHours.stoppedDuration", 0],
            }, // Set stoppedHours to 0 if no data found
          },
        },
        {
          $addFields: {
            efficiency: {
              $multiply: [
                {
                  $divide: [
                    "$workingHours",
                    {
                      $add: ["$workingHours", "$stoppedHours"],
                    },
                  ],
                },
                100,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "events",
            let: { register_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$register_id", "$$register_id"],
                  },
                },
              },
              {
                $match: {
                  type: "COMPLETE_ROLL",
                },
              },
              {
                $count: "completedRollEventsCount",
              },
            ],
            as: "completedRollEvents",
          },
        },
        {
          $addFields: {
            numberOfRoll: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$completedRollEvents.completedRollEventsCount",
                    0,
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "machineorders",
            localField: "machineId",
            foreignField: "machineId",
            as: "machineOrders",
          },
        },
        {
          $unwind: {
            path: "$machineOrders",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "machineOrders.orderId",
            foreignField: "_id",
            as: "orderData",
          },
        },
        {
          $addFields: {
            orderNumber: { $arrayElemAt: ["$orderData.order_number", 0] },
          },
        },
        {
          $project: {
            latestEvent: 0,
            orderData: 0,
            machineOrders: 0,
            completedRollEvents: 0,
          },
        },
      ]).allowDiskUse(true);

      return {
        success: true,
        data: allMachinesData,
        message: "All machines data retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve all machines data",
      };
    }
  },

  getById: async (machineId) => {
    try {
      const machine = await Machine.findOne({ register_id: machineId });

      if (!machine) {
        return {
          success: false,
          message: "Machine not found",
        };
      }

      const machineData = await MachineLogs.aggregate([
        {
          $match: { register_id: machineId }, // Filter by the specific machine's register_id
        },
        {
          $sort: { createdAt: -1 }, // Sort to get the latest records first
        },
        {
          $group: {
            _id: "$register_id",
            latestLog: { $first: "$$ROOT" }, // Get the latest record for the specific machine's register_id
            totalMinutes: { $sum: 1 },
          },
        },
        {
          $project: {
            speed: "$latestLog.proxSpeed",
            progress: "$latestLog.progress",
            createdAt: "$latestLog.createdAt",
            workingHours: {
              $ceil: { $divide: ["$totalMinutes", 60] },
            },
          },
        },
        {
          $lookup: {
            from: "machines",
            localField: "_id",
            foreignField: "register_id",
            as: "machineData",
          },
        },
        {
          $unwind: {
            path: "$machineData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            speed: 1,
            progress: 1,
            createdAt: 1,
            workingHours: 1,
            machineId: "$machineData._id",
            machineName: "$machineData.name",
            machineNumber: "$machineData.model",
            machineAddress: "$machineData.machineAddress",
          },
        },
        {
          $lookup: {
            from: "events",
            let: { register_id: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$register_id", "$$register_id"] } } },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: "latestEvent",
          },
        },
        {
          $addFields: {
            isStopped: {
              $cond: [
                {
                  $gt: [
                    { $toDate: "$createdAt" },
                    {
                      $toDate: { $arrayElemAt: ["$latestEvent.createdAt", 0] },
                    },
                  ],
                },
                false,
                true,
              ],
            },
            stopReason: { $arrayElemAt: ["$latestEvent.type", 0] },
          },
        },
        {
          $lookup: {
            from: "events",
            let: { register_id: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$register_id", "$$register_id"] } } },
              {
                $group: {
                  _id: "$type",
                  count: {
                    $sum: { $cond: [{ $eq: ["$type", "IDEAL"] }, 1, 0] },
                  },
                  totalDuration: {
                    $sum: {
                      $cond: [
                        { $eq: ["$type", "COMPLETE_ROLL"] },
                        { $multiply: ["$count", 60, 3, 1000] },
                        {
                          $subtract: [
                            { $toLong: "$endEventDate" },
                            { $toLong: "$startEventDate" },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              { $match: { _id: { $ne: "COMPLETE_ROLL" } } },
              {
                $group: {
                  _id: null,
                  stoppedDuration: {
                    $sum: {
                      $trunc: {
                        $divide: [{ $sum: "$totalDuration" }, 3600000], // Convert milliseconds to hours
                      },
                    },
                  },
                },
              },
            ],
            as: "stoppedHours",
          },
        },
        {
          $unwind: { path: "$stoppedHours", preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            stoppedHours: { $ifNull: ["$stoppedHours.stoppedDuration", 0] }, // Set stoppedHours to 0 if no data found
          },
        },
        {
          $addFields: {
            efficiency: {
              $multiply: [
                {
                  $divide: [
                    "$workingHours",
                    {
                      $add: ["$workingHours", "$stoppedHours"],
                    },
                  ],
                },
                100,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "events",
            let: { register_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$register_id", "$$register_id"],
                  },
                },
              },
              {
                $match: {
                  type: "COMPLETE_ROLL",
                },
              },
              {
                $count: "completedRollEventsCount",
              },
            ],
            as: "completedRollEvents",
          },
        },
        {
          $addFields: {
            numberOfRoll: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$completedRollEvents.completedRollEventsCount",
                    0,
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "machineorders",
            localField: "machineId",
            foreignField: "machineId",
            as: "machineOrders",
          },
        },
        {
          $unwind: {
            path: "$machineOrders",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "machineOrders.orderId",
            foreignField: "_id",
            as: "orderData",
          },
        },
        {
          $addFields: {
            orderNumber: { $arrayElemAt: ["$orderData.order_number", 0] },
          },
        },
        {
          $project: {
            latestEvent: 0,
            orderData: 0,
            machineOrders: 0,
            completedRollEvents: 0,
          },
        },
      ]).allowDiskUse(true);

      return {
        success: true,
        data: machineData,
        message: "Machine retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve machine",
      };
    }
  },

  delete: async (machineId) => {
    try {
      const machine = await Machine.findOneAndDelete({
        register_id: machineId,
      });

      if (!machine) {
        return {
          success: false,
          message: "Machine not found",
        };
      }

      return {
        success: true,
        message: "Machine deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete machine",
      };
    }
  },

  deleteAll: async () => {
    try {
      const deleteResult = await Machine.deleteMany({});

      if (!deleteResult.deletedCount === 0) {
        return {
          success: false,
          message: "No machines found to delete",
        };
      }
      return {
        success: true,
        message: "All machines deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete all machines",
      };
    }
  },
};
module.exports = MachineServices;

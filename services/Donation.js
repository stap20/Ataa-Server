const { Donation, Category } = require("@schemas");
const { ObjectId } = require("mongodb");

const DonationServices = {
  create: async ({
    donationTypeId,
    donatorId,
    quantity,
    imagesList,
    donationDescription,
  }) => {
    try {
      const category = await Category.findById(donationTypeId);
      if (!category) {
        return {
          success: false,
          isSpaceIssue: false,
          message: "No category found with the specified ID",
        };
      }

      const remainingSpace = category.maxLimit - category.inStorage;

      if (remainingSpace >= quantity) {
        const newDonation = new Donation({
          donationTypeId,
          donatorId,
          quantity,
          imagesList,
          donationDescription,
        });
        const donation = await newDonation.save();
        return {
          success: true,
          isSpaceIssue: false,
          data: donation,
          message: "Donation created successfully",
        };
      } else {
        return {
          success: false,
          isSpaceIssue: true,
          message:
            "Not enough space in the category to accommodate the donation",
        };
      }
    } catch (error) {
      return {
        success: false,
        isSpaceIssue: false,
        error: error,
        message: "Failed to create donation",
      };
    }
  },

  getAllDonations: async () => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "donatorId",
            foreignField: "_id",
            as: "donatorInfo",
          },
        },
        {
          $unwind: "$donatorInfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "donationTypeId",
            foreignField: "_id",
            as: "donationType",
          },
        },
        {
          $unwind: "$donationType",
        },
        {
          $project: {
            _id: 1,
            name: "$donatorInfo.name",
            profileImage: "$donatorInfo.profileImage",
            quantity: 1,
            status: 1,
            imagesList: 1,
            type: "$donationType.type",
            donationDescription: 1,
            date: 1,
            donationNumber: 1,
          },
        },
      ];

      const donations = await Donation.aggregate(pipeline);

      return {
        success: true,
        data: donations,
        message: "Donations retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve donations",
      };
    }
  },

  deleteDonationById: async (donationId) => {
    try {
      const deletedDonation = await Donation.findByIdAndDelete(donationId);
      if (!deletedDonation) {
        return {
          success: false,
          message: "Donation not found",
        };
      }
      return {
        success: true,
        message: "Donation deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete donation",
      };
    }
  },

  updateDonationStatus: async (donationId, status) => {
    try {
      const filter = { _id: new ObjectId(donationId) };
      const update = { $set: { status: status } };
      const result = await Donation.updateOne(filter, update);

      console.log(donationId);
      if (result.modifiedCount === 1) {
        return {
          success: true,
          message: "Donation status updated successfully",
        };
      } else {
        return {
          success: false,
          message:
            "No donation found with the specified ID or the status is already updated",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to update donation status",
      };
    }
  },

  acceptDonationStatus: async (donationId) => {
    try {
      const donation = await Donation.findById(donationId);
      if (!donation) {
        return {
          success: false,
          isSpaceIssue: false,
          message: "No donation found with the specified ID",
        };
      }

      const category = await Category.findById(donation.donationTypeId);
      if (!category) {
        return {
          success: false,
          isSpaceIssue: false,
          message: "No category found with the specified ID",
        };
      }

      const quantity = donation.quantity;

      // Check if there is enough space in the category to accommodate the donation
      const remainingSpace = category.maxLimit - category.inStorage;
      if (remainingSpace >= quantity) {
        // Update donation status and isInStorage
        donation.status = "accepted";
        donation.isInStorage = true;
        await donation.save();

        // Update category's inStorage quantity
        category.inStorage += quantity;
        await category.save();

        return {
          success: true,
          isSpaceIssue: false,
          message: "Donation status updated successfully",
        };
      } else {
        return {
          success: false,
          isSpaceIssue: true,
          message:
            "Not enough space in the category to accommodate the donation",
        };
      }
    } catch (error) {
      return {
        success: false,
        isSpaceIssue: false,
        error: error,
        message: "Failed to update donation status",
      };
    }
  },

  getPendingDonations: async () => {
    try {
      const pipeline = [
        {
          $match: {
            status: "pending",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "donatorId",
            foreignField: "_id",
            as: "donatorInfo",
          },
        },
        {
          $unwind: "$donatorInfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "donationTypeId",
            foreignField: "_id",
            as: "donationType",
          },
        },
        {
          $unwind: "$donationType",
        },
        {
          $project: {
            _id: 1,
            donatorName: "$donatorInfo.name",
            profileImage: "$donatorInfo.profileImage",
            quantity: 1,
            status: 1,
            imagesList: 1,
            type: "$donationType.type",
            donationDescription: 1,
            date: 1,
            donationNumber: 1,
          },
        },
      ];

      const donations = await Donation.aggregate(pipeline);

      return {
        success: true,
        data: donations,
        message: "Donations retrieved successfully",
      };
    } catch (errors) {
      return {
        success: false,
        error: errors,
        message: "Failed to retrieve donations",
      };
    }
  },

  getPendingDonationsByUserId: async (userId) => {
    try {
      const pipeline = [
        {
          $match: {
            donatorId: new ObjectId(userId),
            status: "pending",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "donatorId",
            foreignField: "_id",
            as: "donatorInfo",
          },
        },
        {
          $unwind: "$donatorInfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "donationTypeId",
            foreignField: "_id",
            as: "donationType",
          },
        },
        {
          $unwind: "$donationType",
        },
        {
          $project: {
            _id: 1,
            donatorName: "$donatorInfo.name",
            profileImage: "$donatorInfo.profileImage",
            quantity: 1,
            status: 1,
            imagesList: 1,
            type: "$donationType.type",
            donationDescription: 1,
            date: 1,
            donationNumber: 1,
          },
        },
      ];

      const donations = await Donation.aggregate(pipeline);

      return {
        success: true,
        data: donations,
        message: "Donations retrieved successfully",
      };
    } catch (errors) {
      return {
        success: false,
        error: errors,
        message: "Failed to retrieve donations",
      };
    }
  },

  getHistoryDonations: async () => {
    try {
      const pipeline = [
        {
          $match: {
            status: { $nin: ["pending", "canceled"] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "donatorId",
            foreignField: "_id",
            as: "donatorInfo",
          },
        },
        {
          $unwind: "$donatorInfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "donationTypeId",
            foreignField: "_id",
            as: "donationType",
          },
        },
        {
          $unwind: "$donationType",
        },
        {
          $project: {
            _id: 1,
            donatorName: "$donatorInfo.name",
            profileImage: "$donatorInfo.profileImage",
            quantity: 1,
            status: 1,
            imagesList: 1,
            type: "$donationType.type",
            donationDescription: 1,
            date: 1,
            donationNumber: 1,
          },
        },
      ];

      const donations = await Donation.aggregate(pipeline);

      return {
        success: true,
        data: donations,
        message: "Donations retrieved successfully",
      };
    } catch (errors) {
      return {
        success: false,
        error: errors,
        message: "Failed to retrieve donations",
      };
    }
  },

  getHistoryDonationByUserId: async (userId) => {
    try {
      const pipeline = [
        {
          $match: {
            donatorId: new ObjectId(userId),
            status: { $ne: "pending" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "donatorId",
            foreignField: "_id",
            as: "donatorInfo",
          },
        },
        {
          $unwind: "$donatorInfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "donationTypeId",
            foreignField: "_id",
            as: "donationType",
          },
        },
        {
          $unwind: "$donationType",
        },
        {
          $project: {
            _id: 1,
            donatorName: "$donatorInfo.name",
            profileImage: "$donatorInfo.profileImage",
            quantity: 1,
            status: 1,
            imagesList: 1,
            type: "$donationType.type",
            donationDescription: 1,
            date: 1,
            donationNumber: 1,
          },
        },
      ];

      const donations = await Donation.aggregate(pipeline);

      return {
        success: true,
        data: donations,
        message: "Donations retrieved successfully",
      };
    } catch (errors) {
      return {
        success: false,
        error: errors,
        message: "Failed to retrieve donations",
      };
    }
  },

  getSorageDonations: async () => {
    try {
      const pipeline = [
        {
          $match: {
            isInStorage: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "donatorId",
            foreignField: "_id",
            as: "donatorInfo",
          },
        },
        {
          $unwind: "$donatorInfo",
        },
        {
          $lookup: {
            from: "categories",
            localField: "donationTypeId",
            foreignField: "_id",
            as: "donationType",
          },
        },
        {
          $unwind: "$donationType",
        },
        {
          $project: {
            _id: 1,
            donatorName: "$donatorInfo.name",
            profileImage: "$donatorInfo.profileImage",
            quantity: 1,
            status: 1,
            imagesList: 1,
            type: "$donationType.type",
            donationDescription: 1,
            date: 1,
            donationNumber: 1,
          },
        },
      ];

      const donations = await Donation.aggregate(pipeline);

      return {
        success: true,
        data: donations,
        message: "Donations retrieved successfully",
      };
    } catch (errors) {
      return {
        success: false,
        error: errors,
        message: "Failed to retrieve donations",
      };
    }
  },

  emptySorageDonations: async () => {
    try {
      // Update all donations with isInStorage set to true to false
      await Donation.updateMany({ isInStorage: true }, { isInStorage: false });

      // Set the inStorage quantity of all categories to 0
      await Category.updateMany({}, { inStorage: 0 });

      return {
        success: true,
        message: "Empty storage successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to empty storage",
      };
    }
  },
};
module.exports = DonationServices;

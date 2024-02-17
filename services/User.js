const { User } = require("@schemas");

const UserServices = {
  create: async ({
    name,
    email,
    password,
    phoneNumber,
    countryCode,
    role = "user",
    profileImage = null,
  }) => {
    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return {
          success: false,
          message: "Phone Number already exists",
        };
      }

      // Create a new user instance
      const newUser = new User({
        name,
        email,
        password,
        phoneNumber,
        countryCode,
        role,
        profileImage,
      });

      // Save the user to the database
      const user = await newUser.save();

      return {
        success: true,
        data: user,
        message: "User created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to create user",
      };
    }
  },
  update: async ({
    id,
    name,
    email,
    password,
    phoneNumber,
    countryCode,
    profileImage,
  }) => {
    try {
      // Find the user by their ID
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return {
          success: false,
          message: "User not found",
        };
      }

      console.log(phoneNumber);
      // Update user details
      existingUser.name = name;
      existingUser.email = email;
      existingUser.password = password;
      existingUser.phoneNumber = phoneNumber;
      existingUser.countryCode = countryCode;
      existingUser.profileImage = profileImage;

      // Save the updated user to the database
      const updatedUser = await existingUser.save();

      return {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to update user",
      };
    }
  },
  getAllUsers: async (role) => {
    try {
      const users = await User.find({ role: role });
      return {
        success: true,
        data: users,
        message: "Users retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve users",
      };
    }
  },
  deleteUserById: async (userId) => {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return {
          success: false,
          message: "User not found",
        };
      }
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to delete user",
      };
    }
  },
  getUserById: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }
      return {
        success: true,
        data: user,
        message: "User retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve user",
      };
    }
  },
  getUserPhone: async (phoneNumber, countryCode) => {
    try {
      const user = await User.findOne({ phoneNumber, countryCode });
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }
      return {
        success: true,
        data: user,
        message: "User retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve user",
      };
    }
  },
};
module.exports = UserServices;

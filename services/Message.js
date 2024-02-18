const { Message } = require("@schemas");

const CategoryServices = {
  create: async (data) => {
    try {
      const newMessage = new Message(data);
      const message = await newMessage.save();
      return {
        success: true,
        data: message,
        message: "Message created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to create message",
      };
    }
  },
  getMessage: async () => {
    try {
      const message = await Message.findOne();
      return {
        success: true,
        data: message,
        message: "Message retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        message: "Failed to retrieve message",
      };
    }
  },
  update: async ({ id, acceptMessage, rejectMessage, rejectStorageMessage }) => {
    try {
      // Find the user by their ID
      const existingMessage = await Message.findById(id);
      if (!existingMessage) {
        return {
          success: false,
          message: "Message not found",
        };
      }

      // Update user details
      existingMessage.acceptMessage = acceptMessage;
      existingMessage.rejectMessage = rejectMessage;
      existingMessage.rejectStorageMessage = rejectStorageMessage;

      // Save the updated user to the database
      const updatedMessage = await existingMessage.save();

      return {
        success: true,
        data: updatedMessage,
        message: "Message updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to update message",
      };
    }
  },
};
module.exports = CategoryServices;

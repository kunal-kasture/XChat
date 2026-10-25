const Room = require("../models/Room");
const mongoose = require("mongoose");

const initRoom = async (req, res) => {
  try {
    const { otheruser } = req.body;

    if (!otheruser) {
      return res.status(400).json({
        success: false,
        message: "Other user is required to create a chat room",
      });
    }

    const currentUserId = req.user._id;

    let room = await Room.findOne({
      users: { $all: [currentUserId, otheruser] },
    }).populate("users", "_id fullName username email avatar");

    if (room) {
      return res.status(200).json({
        success: true,
        data: {
          _id: room._id,
          users: room.users,
        },
        message: "Room initialized successfully",
      });
    }

    const newRoom = await Room.create({
      users: [currentUserId, otheruser],
    });

    const populatedRoom = await Room.findById(newRoom._id).populate(
      "users",
      "_id fullName username email avatar",
    );

    return res.status(200).json({
      success: true,
      data: {
        _id: populatedRoom._id,
        users: populatedRoom.users,
      },
      message: "Room initialized successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "DB error during room creation",
    });
  }
};

const getUserRooms = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const rooms = await Room.find({
      users: currentUserId,
    }).populate("users", "_id fullName username email avatar");

    return res.status(200).json({
      success: true,
      data: rooms.map((room) => ({
        _id: room._id,
        users: room.users,
      })),
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "DB error during fetch",
    });
  }
};

module.exports = {
  initRoom,
  getUserRooms,
};

import User from "../models/User.js";
import bcrypt from "bcrypt";
import Notification from "../models/Notification.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const followingCount = await User.countDocuments({
      followers: id,
    });
    const followersCount = await User.countDocuments({
      followings: id,
    });

    res.status(200).json({
      user,
      followingCount: followingCount,
      followersCount: followersCount,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const followingCount = await User.countDocuments({
      followers: id,
    });
    const followersCount = await User.countDocuments({
      followings: id,
    });
    res
      .status(200)
      .json({ followingCount: followingCount, followersCount: followersCount });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getSuggestionUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(id);
    const following = currentUser.followings.map((friend) => friend);
    const suggestions = await User.find({ _id: { $nin: [...following, id] } });
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
// NOTIFICATION

export const getNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ user: id })
      .populate("friend", "username picturePath")
      .populate("postId", "image content")
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const F1 = await Promise.all(
      user.followings.map((id) => User.findById(id))
    );
    const formattedFollowings = F1.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );
    const F2 = await Promise.all(user.followers.map((id) => User.findById(id)));
    const formattedFollowers = F2.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );
    const currentUser = await User.findById(id);
    const following = currentUser.followings.map((friend) => friend);
    const suggestions = await User.find({ _id: { $nin: [...following, id] } });

    res
      .status(200)
      .json({ formattedFollowings, formattedFollowers, suggestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const followFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (!friend.followers.includes(id)) {
      friend.followers.push(id);
      await friend.save();
      const notification = new Notification({
        type: "follow",
        user: friend._id,
        friend: id,
        content: "Started Following You",
      });
      await notification.save();
    }
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (!user.followings.includes(friendId)) {
      user.followings.push(friendId);
      await user.save();
    }

    const F1 = await Promise.all(
      user.followings.map((id) => User.findById(id))
    );
    const formattedFollowings = F1.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );

    const F2 = await Promise.all(user.followers.map((id) => User.findById(id)));
    const formattedFollowers = F2.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );

    // const currentUser = await User.findById(id);
    // const following = currentUser.followings.map((friend) => friend);
    // const suggestions = await User.find({ _id: { $nin: [...following, id] } });
    console.log("HI 1");

    const updatedUser = await User.findById(id);

    res
      .status(200)
      .json({ formattedFollowings, formattedFollowers, updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unFollowFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (friend.followers.includes(id)) {
      const index = friend.followers.indexOf(id);
      friend.followers.splice(index, 1);
      await friend.save();
    }

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (user.followings.includes(friendId)) {
      const index = user.followings.indexOf(friendId);
      user.followings.splice(index, 1);
      await user.save();
    }

    const F1 = await Promise.all(
      user.followings.map((id) => User.findById(id))
    );
    const formattedFollowings = F1.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );
    const F2 = await Promise.all(user.followers.map((id) => User.findById(id)));
    const formattedFollowers = F2.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );
    const currentUser = await User.findById(id);
    const following = currentUser.followings.map((friend) => friend);
    const suggestions = await User.find({ _id: { $nin: [...following, id] } });

    const updatedUser = await User.findById(id);

    res
      .status(200)
      .json({
        formattedFollowings,
        formattedFollowers,
        suggestions,
        updatedUser,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const followBackFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (!friend.followers.includes(id)) {
      // Check if userId is not already in followers
      friend.followers.push(id);
      await friend.save();
    }

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (!user.followings.includes(friendId)) {
      // Check if userIdToFollow is not already in following
      user.followings.push(friendId);
      await user.save();
    }

    const F1 = await Promise.all(
      user.followings.map((id) => User.findById(id))
    );
    const formattedFollowings = F1.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );
    const F2 = await Promise.all(user.followers.map((id) => User.findById(id)));
    const formattedFollowers = F2.map(
      ({ _id, username, name, picturePath }) => {
        return { _id, username, name, picturePath };
      }
    );
    const currentUser = await User.findById(id);
    const following = currentUser.followings.map((friend) => friend);
    const suggestions = await User.find({ _id: { $nin: [...following, id] } });

    const updatedUser = await User.findById(id);

    res
      .status(200)
      .json({
        formattedFollowings,
        formattedFollowers,
        suggestions,
        updatedUser,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      username,
      email,
      bio,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    let user = await User.findById(id);
    if (user) {
      user.username = username.trim() || user.username;
      user.name = name.trim() || user.name;
      user.bio = bio.trim() || user.bio;
      user.email = email.trim() || user.email;
      if (oldPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
          return res.status(400).json({ error: "Invalid Old Password. " });

        if (newPassword == confirmPassword) {
          const salt = await bcrypt.genSalt();
          const passwordHash = await bcrypt.hash(confirmPassword, salt);
          user.password = passwordHash;
        } else {
          return res
            .status(400)
            .json({ error: "Old password not same to new password" });
        }
      }

      const updatedUser = await user.save(); // Save the changes to the user object
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(404).json({ error: "Email or Username Already Exists!" });
  }
};

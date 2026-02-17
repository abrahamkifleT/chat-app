import User from "../models/User.js";
import Message from "../models/message.js";

// Get all users except the logged in user

export const getUsersForSidebar = async(req, res) => {
   try {
      const userId = req.user._id
      const filterUser = await User.find({_id: {$ne: userId}}).select("-password");

    //   Count number of messages not seen
    const unseenMessages = {}
    const promises = filterUser.map(async(user)=> {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false
      })
      if(messages.length > 0){
        unseenMessages[user._id] = messages.length
      }
    })
    await Promise.all(promises)
    res.json({success: true, users: filterUser, unseenMessages})
   } catch (error) {
      console.log(error.message)
      res.json({success: false, message: error.message})
   }
}
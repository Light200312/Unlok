import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Sends a notification between two users
 * @param {Object} options
 * @param {String} options.senderId
 * @param {String} options.receiverId
 * @param {String} options.type - "friend" | "clan" | "quest"
 * @param {String} options.message
 */
export const sendNotification = async ({ senderId, receiverId, type, message }) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  if (!sender || !receiver) throw new Error("Sender or receiver not found");

  const notifId = uuidv4();

  const notif = {
    notificationId: notifId,
    type,
    direction: "received",
    sender: senderId,
    receiver: receiverId,
    message,
  };

  const sentNotif = {
    ...notif,
    direction: "sent",
  };

  receiver.requestsNotifications.push(notif);
  sender.requestsNotifications.push(sentNotif);

  await receiver.save();
  await sender.save();

  return notifId;
};

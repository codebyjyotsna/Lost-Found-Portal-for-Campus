const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Example Notification Schema
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', NotificationSchema);

// Function to send notifications
async function sendNotifications(newPost) {
  try {
    const query = {
      type: newPost.type === 'Lost' ? 'Found' : 'Lost',
      tags: { $in: newPost.tags },
    };

    const matchingPosts = await Post.find(query);

    matchingPosts.forEach(async (post) => {
      const user = await User.findById(post.userId);

      // Save Notification
      const notification = new Notification({
        userId: user._id,
        postId: newPost._id,
        message: `We found a match for your post! Check out the post titled "${newPost.title}".`,
      });
      await notification.save();

      // Send Email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Lost & Found Match Notification',
        text: `We found a match for your post: "${newPost.title}". Visit the portal to view the details.`,
      };

      await transporter.sendMail(mailOptions);
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

module.exports = { sendNotifications };

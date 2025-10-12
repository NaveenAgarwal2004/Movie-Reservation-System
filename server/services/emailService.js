const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates = {
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmed - ${booking.movie.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 CineMax</h1>
            <h2>Booking Confirmed!</h2>
          </div>
          
          <div class="content">
            <p>Dear ${booking.user.firstName},</p>
            <p>Your booking has been confirmed! Here are your ticket details:</p>
            
            <div class="booking-details">
              <h3>${booking.movie.title}</h3>
              <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
              <p><strong>Theater:</strong> ${booking.theater.name}</p>
              <p><strong>Date:</strong> ${new Date(booking.showtime.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${booking.showtime.time}</p>
              <p><strong>Seats:</strong> ${booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}</p>
              <p><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
            </div>
            
            <p>Please arrive at least 15 minutes before showtime.</p>
            <p>Show this email or your booking reference at the theater entrance.</p>
            
            <center>
              <a href="${process.env.CLIENT_URL}/booking-confirmation/${booking.bookingReference}" class="button">
                View Ticket
              </a>
            </center>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing CineMax!</p>
            <p>For support, contact us at support@cinemax.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  bookingReminder: (booking) => ({
    subject: `Reminder: ${booking.movie.title} - Today!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Movie Reminder</h1>
          </div>
          
          <div class="content">
            <p>Hi ${booking.user.firstName},</p>
            <p>This is a friendly reminder that your movie starts today!</p>
            
            <h3>${booking.movie.title}</h3>
            <p><strong>Time:</strong> ${booking.showtime.time}</p>
            <p><strong>Theater:</strong> ${booking.theater.name}</p>
            <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
            
            <p>See you at the movies! 🍿</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset</h1>
          </div>
          
          <div class="content">
            <p>Hi ${user.firstName},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            
            <center>
              <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" class="button">
                Reset Password
              </a>
            </center>
            
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  welcomeEmail: (user) => ({
    subject: 'Welcome to CineMax! 🎬',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .feature { background: white; padding: 15px; border-radius: 8px; text-align: center; }
          .button { display: inline-block; padding: 12px 24px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 Welcome to CineMax!</h1>
            <p>Your gateway to amazing movie experiences</p>
          </div>
          
          <div class="content">
            <p>Hi ${user.firstName},</p>
            <p>Welcome aboard! We're thrilled to have you as part of the CineMax family.</p>
            
            <h3>What you can do with CineMax:</h3>
            <div class="features">
              <div class="feature">
                <h4>🎟️ Easy Booking</h4>
                <p>Book tickets in seconds</p>
              </div>
              <div class="feature">
                <h4>💺 Seat Selection</h4>
                <p>Pick your perfect seat</p>
              </div>
              <div class="feature">
                <h4>⭐ Reviews</h4>
                <p>Share your thoughts</p>
              </div>
              <div class="feature">
                <h4>📱 Mobile Tickets</h4>
                <p>No printing needed</p>
              </div>
            </div>
            
            <center>
              <a href="${process.env.CLIENT_URL}/movies" class="button">
                Browse Movies
              </a>
            </center>
            
            <p>Happy movie watching! 🍿</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const emailContent = emailTemplates[template](data);

    const info = await transporter.sendMail({
      from: `"CineMax" <${process.env.SMTP_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Scheduled reminder emails (can be triggered by cron job)
const sendBookingReminders = async () => {
  try {
    const Booking = require('../models/Booking');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      'showtime.date': {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
      },
      status: 'confirmed',
    })
      .populate('user', 'email firstName')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'theater', select: 'name' },
        ],
      });

    for (const booking of bookings) {
      if (booking.user?.email) {
        await sendEmail(booking.user.email, 'bookingReminder', booking);
      }
    }

    console.log(`Sent ${bookings.length} reminder emails`);
  } catch (error) {
    console.error('Send reminders error:', error);
  }
};

module.exports = {
  sendEmail,
  sendBookingReminders,
  emailTemplates,
};

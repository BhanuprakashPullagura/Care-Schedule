import nodemailer from "nodemailer";

const sendEmail = async (to, subjectOrOtp, htmlContent = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let subject;
    let html;

    // ✅ IF ONLY OTP (OLD USAGE)
    if (!htmlContent) {
      subject = "Your OTP for Login";
      html = `
        <h2>Your OTP is: ${subjectOrOtp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `;
    } 
    // ✅ NEW USAGE (CUSTOM EMAILS)
    else {
      subject = subjectOrOtp;
      html = htmlContent;
    }

    await transporter.sendMail({
      from: `"Care Schedule" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("Email sent successfully ✅");

  } catch (error) {
    console.log("Email sending failed:", error.message);
  }
};

export default sendEmail;
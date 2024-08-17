import nodemailer from "nodemailer"

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  service: "Gmail",

  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

export const sendAddClaimMail = async (req: any, res: any) => {
  let { formerDetails, billType, claimPeriodFrom, claimPeriodTo, totalClaimedAmount } = req.body

  let mailOptions = {
    to: formerDetails.email,
    subject: "Claim registered Successfully.",
    html:
      `<h3>Hi ${formerDetails.name},</h3>` +
      `<p>Your <b>${billType}</b> claim  for period from <b>${claimPeriodFrom}</b> to <b>${claimPeriodTo}</b> of <b>Rs. ${totalClaimedAmount}</b> is succesfully registered.</p>` +
      `<p>Warm regards,</p>` +
      `<p>Team UPSC</p>`
  }
  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    return false
  }
}

export const sendOTP = async (req: any, res: any) => {
  let email = req.body.email
  let token = req.body.token

  let mailOptions = {
    to: email,
    subject: "Reset your Password",
    html:
      "<h3>Click on the below link to reset your password. </h3>" +
      "<h4 style='font-weight:bold;'>" +
      "http://localhost:3000/resetpassword?t=" +
      token +
      "</h4>" // html body
  }
  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    return false
  }
}

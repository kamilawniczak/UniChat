const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.sendEmail = ({ to, sender, subject, html, attachments, text }) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  };

  let transporter = nodemailer.createTransport(config);

  // let MailGenerator = new Mailgen({
  //   theme: "default",
  //   product: {
  //     name: "Mailgen",
  //     link: "https://mailgen.js/",
  //   },
  // });

  // let response = {
  //   body: {
  //     name: "Daily Tuition",
  //     intro: "Your bill has arrived!",
  //     table: {
  //       data: [
  //         {
  //           item: "Nodemailer Stack Book",
  //           description: "A Backend application",
  //           price: "$10.99",
  //         },
  //       ],
  //     },
  //     outro: "Looking forward to do more business",
  //   },
  // };

  // let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
    attachments,
  };

  transporter.sendMail(message);
};

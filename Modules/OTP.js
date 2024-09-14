const mongoose = require('mongoose');
const MailSender = require('../Utile/MailSender');

const OTPschema = new mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: Number
    },
    Status: {
        type: Date
    }
})



// a function ->to send mail
async function sendVerificationEmail(email, otp) {
    try {
        const mailRseponse = await MailSender(email, "Sign up Otp", otp);
        console.log("email send success fully : ", mailRseponse);

    } catch (error) {
        console.log("error occured while sending mails: ", error);
        // throw error;
    }
}

OTPschema.post("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);

    next;
})


module.exports = mongoose.model('OTP', OTPschema)
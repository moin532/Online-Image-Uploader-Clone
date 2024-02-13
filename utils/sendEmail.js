const nodeMailer = require('nodemailer');

const sendEmail = async(options)=>{
    
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        service:process.env.SMTP_SERVICE,
        port: 2525,
        ssl: false,
        tls: true,
        auth:{
            user: process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        },
    })

    const mailoptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    };

    await transporter.sendMail(mailoptions);
   
}

module.exports = sendEmail;


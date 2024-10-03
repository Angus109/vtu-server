import sgMail from '@sendgrid/mail'
import {CONFIG} from '../config'
const config= CONFIG()

export const sendMail =async  (receiver_email:any, subject:any, email_body:any)=>{
    
    //console.log('in the mail functiion');
    
    try{
        sgMail.setApiKey(`${process.env.SEND_GRID_EMAIL_KEY}`)
        const message = {
           to: receiver_email, 
           from:{
               name:`${process.env.SEND_GRID_NAME}`,
               email:`${process.env.SEND_GRID_EMAIL}`
           },
           subject,
           text:'Email from Easytopup',
           html:email_body
        }

        const response = await sgMail.send(message)
        console.log('Email sent successfully');
        
    }catch(ex){
       console.log(ex);
       
    }

}

export const testSM =async () =>{
    try{
       sendMail("angusdev.aeworks@gmail.com", 'EasyTopUp', "welcome to Easytopup")
    }catch(err){
        console.log(err)
    }
}





// import { CONFIG } from '../config';
// const config = CONFIG();

// export const sendMail = async (receiver_email: any, subject: any, email_body: any) => {
//   try {
//     // Replace with your SMTP server settings (e.g., Gmail, Outlook)
//     const smtpHost = 'smtp.your_smtp_server.com';
//     const smtpPort = 587; // Or use the appropriate port for your server
//     const smtpUser = 'your_email@your_domain.com';
//     const smtpPassword = 'your_email_password';

//     // Create a new transport object using Nodemailer
//     const transporter = nodemailer.createTransport({
//       host: smtpHost,
//       port: smtpPort,
//       secure: false, // Or true if using SSL
//       auth: {
//         user: smtpUser,
//         pass: smtpPassword,
//       },
//     });

//     // Compose the email message
//     const mailOptions = {
//       from: `${process.env.SEND_GRID_NAME} <${process.env.SEND_GRID_EMAIL}>`,
//       to: receiver_email,
//       subject,
//       text: 'Email from Easytopup',
//       html: email_body,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Message sent: %s', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };
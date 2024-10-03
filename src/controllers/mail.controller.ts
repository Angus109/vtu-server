
import { CONFIG } from '../config';
const config = CONFIG();
import nodeMailer from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';



export const sendMail = async (receiver_email: any, subject: any, email_body: any) => {
  try {
  

    // Create a new transport object using Nodemailer
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
          user: process.env.SMPT_USER,
          pass: process.env.SMPT_PASSWORD,
        },
      } as SMTPTransport.Options);

    // Compose the email message
    const mailOptions = {
      from: `${process.env.SMPT_NAME}`,
      to: receiver_email,
      subject,
      text: 'Email from Easytopup',
      html: email_body,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};





// import sgMail from '@sendgrid/mail'
// import {CONFIG} from '../config'
// const config= CONFIG()

// export const sendMail =async  (receiver_email:any, subject:any, email_body:any)=>{
    
//     //console.log('in the mail functiion');
    
//     try{
//         sgMail.setApiKey(`${process.env.SEND_GRID_EMAIL_KEY}`)
//         const message = {
//            to: receiver_email, 
//            from:{
//                name:`${process.env.SEND_GRID_NAME}`,
//                email:`${process.env.SEND_GRID_EMAIL}`
//            },
//            subject,
//            text:'Email from Easytopup',
//            html:email_body
//         }

//         const response = await sgMail.send(message)
//         console.log('Email sent successfully');
        
//     }catch(ex){
//        console.log(ex);
       
//     }

// }

// export const testSM =async () =>{
//     try{
//        sendMail("angusdev.aeworks@gmail.com", 'EasyTopUp', "welcome to Easytopup")
//     }catch(err){
//         console.log(err)
//     }
// }

import joi from 'joi-browser'
import jwt from 'jsonwebtoken'
import { CONFIG } from '../config/index'
const config = CONFIG()
import { PaymentModel } from '../models/payment.model'
import { sendMail } from './mail.controller'
import { ValidateAffiliate, AffiliateModel } from '../models/affiliate.model'
import { AdminModel } from '../models/admin.model'
import { cloneDeep, result } from 'lodash'




export const createAffiliate = async (req: any, res: any, next: any) => {
    const { error } = ValidateAffiliate(req.body)
    if (error) return res.status(400).send({
        success: false,
        message: error.details[0].message
    })
    const checkAdmin = await AdminModel.findById(req.user._doc._id)
    if (!checkAdmin) {
        return res.status(403).send({
            success: false,
            message: "unauthorized"
        })
    }


    try {
        const findAffiliate = await AffiliateModel.findOne({ email: req.body.email })
        if (findAffiliate) return res.status(401).send({
            success: false,
            message: 'Email has been taken'
        })


        const newAffiliate = new AffiliateModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })



        await newAffiliate.save()
        res.json({
            succcess: true,
            message: 'Affiliate created successfully',
        })
        const email_body = `
            <!DOCTYPE html>
<html>
<head>
<style>
body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
}

h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

p {
    margin-bottom: 15px;
}

a {
    color: #007bff;
    text-decoration: none;
}
</style>
</head>
<body>
<h1>Welcome to the VTU Top-Up Admin Panel!</h1>

<p>Dear ${req.body.firstName} ${req.body.lastName}</p>

<p>We're excited to welcome you as a new affiliate to the VTU Top-Up Admin Panel. Your dedication to providing exceptional service to your customers is truly commendable.</p>

<p>To get started, please <a href="${process.env.DASHBOARD_URL}/affiliate_login">login to your dashbord</a> using your credentials. You'll find a wealth of resources and tools to help you manage your affiliate account and offer top-notch VTU services.</p>

<p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

<p>Best regards,</p>

<p>The VTU Top-Up Team</p>
</body>
</html>
        `
        sendMail(req.body.email, 'EasyTopUp Verification Code', email_body)


    } catch (ex) {
        res.status(500).send(ex)
    }


}

export const verifyAccount = async (req: any, res: any, next: any) => {
    const { error } = Validate(req.body)

    const codeInterger = parseInt(req.query.code)
    if (error) return res.status(400).send({
        success: false,
        message: error.details[0].message
    })
    if (!req.query.code) {
        return res.status(400).send({
            success: false,
            message: "verificationCode is required"
        })
    }


    try {
       
        const checkAffiliate = await AffiliateModel.findOne({ email: req.body.email })
        if(!checkAffiliate){
            return res.status(404).send({
                success: false,
                message: "affiliate not found"
            })
        }
        if (checkAffiliate.verificationCode !== codeInterger) return res.status(403).send({
            sucess: false,
            message: 'Invalid verification code'
        })

        if(new Date(Date.now() + 60000) >= new Date(checkAffiliate.verificationCodeExpiresAt)){
            return res.status(403).send({
            sucess: false,
            message: 'code expired'
    
            })
        }
        
        const token = jwt.sign({ ...checkAffiliate}, `${process.env.JWT_SECRET}`)
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
        });

        res.json({
            success: true,
            message: 'login successfully',
            result: checkAffiliate,
            token: token
        })
    } catch (ex) {
        res.status(500).send('Server Error. Cannot verify account')
    }


}

export const AuthAfiliate = async (req: any, res: any, next: any) => {

    const { error } = Validate(req.body)
    if (error) return res.status(400).send({
        success: false,
        message: error.details[0].message
    })


    try {
        const findAffiliate = await AffiliateModel.findOne({ email: req.body.email })
        if (!findAffiliate) return res.status(404).send({
            success: false,
            message: "email not found"
        })

        // Generate six-digit verification code
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;

        // Set verification code and expiration time in user document
        findAffiliate.verificationCode = verificationCode;
        findAffiliate.verificationCodeExpiresAt = new Date(Date.now() + 7260000); // 2 hour from now


        await findAffiliate.save()

        res.json({
            success: true,
            message: 'email sent succesfully'
        })
        const email_body = `
            <div>
                <div> Your EasyTopUp verification code is ${verificationCode}</div>
            </div>
        `
        sendMail(req.body.email, 'EasyTopUp Verification Code', email_body)


    } catch (ex) {
        res.status(500).send(ex)
    }


}

export const getAffiliate = async (req: any, res: any, next: any) => {
    try {
        const affiliate = await AffiliateModel.findById(req.user._doc._id)
        res.json({
            sucess: true,
            data: affiliate
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getAllAffiliates = async (req: any, res: any, next: any) => {
    try {
        const affiliates = await AffiliateModel.find()
        const walletBalanceArr = affiliates.map(item => item.walletBalance)
        const totalWalletBalance = walletBalanceArr.reduce((Psum, a) => Psum + a, 0)

        const Payments = await PaymentModel.find()
        const allPaymentArr = Payments.map(item => item.amount / 100)
        const totalPayment = allPaymentArr.reduce((Psum, a) => Psum + a, 0)
        // const paymentArr = users.map(item=>item)
        res.json({
            sucesss: true,
            data: affiliates,
            stats: { totalWalletBalance, totalPayment }
        })
    } catch (ex) {
        res.status(500).send('Cannot fetch affiliates')
    }
}

export const deleteAffililates = async (req: any, res: any, next: any) => {



    try {
        const deleteAffililate = await AffiliateModel.findByIdAndDelete(req.user._doc._id)
        if (deleteAffililate) {
            res.json({
                status: 'success',
                message: 'account deleted successfully'
            })
        }
    } catch (ex) {
        res.status(500).send('Failed to delete Affiliate. Server Error')
    }
}


export const suspendAffililates = async (req: any, res: any, next: any) => {

    const checkAdmin = await AdminModel.findById(req.user._doc._id)

    if (!checkAdmin) {
        return res.status(401).send({
            success: false,
            message: "unauthorized"
        })
    }



    if (!req.query.status) {
        return res.status(403).send({
            sucess: true,
            message: "status is required"
        })
    }

    if(!req.query.affiliateId){
        return res.status(403).send({
            success: false,
            message:"id is required"
        })
    }
    try {

        if (req.query.status === "suspend") {
            const checkAffiliate = await AffiliateModel.findById(req.query.affiliateId)
            checkAffiliate.status = "suspended"
            await checkAffiliate.save()
        }

        if (req.query.status === "activate") {
            const checkAffiliate = await AffiliateModel.findById(req.query.affiliateId)
            checkAffiliate.status = "active"
            await checkAffiliate.save()
        }

    } catch (ex) {
        res.status(500).send({
            success: false,
            error: ex
        })
    }
}

export const UpdateAffiliate = async (req: any, res: any, next: any) => {
    const { error } = Validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {

        const editAffiliate = await AffiliateModel.findOneAndUpdate({ email: req.body.email },
            {
                firstName: req.body.fname,
                lastName: req.bogy.lname,
                phone: req.body.phone
            },
            { new: true }
        )

        res.json({
            success: true,
            message: 'profile updated successfull',
            data: editAffiliate
        })

    } catch (ex) {
        res.status(500).send('Failed to edit Affiliate')
    }
}

function Validate(user: any) {
    const schema = {
        email: joi.string().required(),


    }
    return joi.validate(user, schema)
}
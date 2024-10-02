import mongoose from 'mongoose'
import joi from 'joi-browser'

interface affiliate {
    firstName:string,
    lastname:string,
    email:string,
}

const affiliateSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },  
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNo:{
        type:Number,
    },
    walletBalance:{
        type:Number,
        default:0
    },
    referralBonus:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:['active', 'suspended'],
        default:'active'
    },
    verificationCode:{
        type:Number
        
    },
    verificationCodeExpiresAt:{
        type: Date
    }
}, {timestamps:true})

 export function ValidateAffiliate (affiliate:affiliate){
    const schema = {
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        email:joi.string().email().required(),

    }

    return joi.validate(affiliate, schema)

}
export const AffiliateModel = mongoose.model('Affiliate', affiliateSchema)

// export {ValidateUser as ValidateUser};


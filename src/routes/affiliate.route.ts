import express from "express";
const router = express.Router()
import auth from '../middlewares/auth'


import { createAffiliate, AuthAfiliate, getAffiliate, getAllAffiliates, deleteAffililates, UpdateAffiliate, verifyAccount } from "../controllers/affiliate.controller";


router.post('/', auth, createAffiliate)
router.delete('/',auth, deleteAffililates)
router.get('/all',auth, getAllAffiliates)
router.get('/',auth, getAffiliate)
router.post('/auth', AuthAfiliate)
router.post('/verify_account/:code', verifyAccount )
router.put('/', auth, UpdateAffiliate)




export default router;
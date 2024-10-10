import express from 'express'
const router = express.Router()
import auth from '../middlewares/auth'
import { createAdmin, AuthAdmin, getAdmin } from '../controllers/admin.controller'
import { suspendAffililates } from '../controllers/affiliate.controller'

 router.post('/', createAdmin )
 router.post('/auth', AuthAdmin)
 router.get('/', auth, getAdmin)
 router.put('/', suspendAffililates)
 

 export default router
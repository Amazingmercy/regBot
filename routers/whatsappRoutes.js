const express = require('express')
const router = express.Router()
const {handleIncomingMessages, verifyWebhook} = require('../controllers/whatsappController')


router.route('/webhook').post(handleIncomingMessages)
router.route('/webhook').get(verifyWebhook)









module.exports = router;
const express = require('express')
const router = express.Router()
const {handleIncomingMessages, verifyWebhook} = require('../controllers/whatsappController')
const {getFacultyAndStepsById} = require('../test')


router.route('/webhook').post(handleIncomingMessages)
router.route('/webhook').get(verifyWebhook)



router.get('/test/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getFacultyAndStepsById(id);
    
    if (result.error) {
        return res.status(404).json({ message: result.error });
    }

    res.json(result);
});






module.exports = router;
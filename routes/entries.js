const express = require('express')
const router = express.Router()
const entryController = require('../controllers/entries')

router.get('/', entryController.getIndex)
router.post('/addEntry', entryController.addEntry)
router.delete('/deleteEntry', entryController.deleteEntry)
router.put('/likeEntry', entryController.likeEntry)

module.exports = router
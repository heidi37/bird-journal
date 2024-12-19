const express = require('express')
const router = express.Router()
const birdController = require('../controllers/birds')

router.get('/', birdController.getIndex)
router.post('/addBird', birdController.addBird)
router.delete('/deleteBird', birdController.deleteBird)
router.put('/likeBird', birdController.likeBird)

module.exports = router
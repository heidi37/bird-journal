const express = require('express')
const router = express.Router()
const entryController = require('../controllers/entries')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/entries', ensureAuth, (req, res) => {
  console.log("GET /entries route hit");  // Check if this logs
  entryController.getEntries(req, res);
});
router.post('/addEntry', entryController.addEntry)
router.delete('/deleteEntry', entryController.deleteEntry)
router.put('/likeEntry', entryController.likeEntry)

module.exports = router
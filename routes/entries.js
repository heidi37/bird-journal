const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const entryController = require('../controllers/entries')
const { ensureAuth } = require('../middleware/auth')

router.get('/user/:id', ensureAuth, entryController.getUser)
router.get('/', ensureAuth, entryController.getEntries)
router.get('/addEntry', ensureAuth, entryController.getEntryForm)
router.post('/addEntry', upload.single("file"), entryController.addEntry)
router.delete('/deleteEntry/:id', entryController.deleteEntry)
router.get('/editEntry/:id', ensureAuth, entryController.getEditEntryForm)
router.put('/editEntry/:id', ensureAuth, entryController.editEntry)
router.put('/likeEntry/:id', entryController.likeEntry)
router.get('/:id', ensureAuth, entryController.getEntry)

module.exports = router

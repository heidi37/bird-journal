const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const entryController = require('../controllers/entries')
const { ensureAuth } = require('../middleware/auth')

router.get('/user/:id', ensureAuth, entryController.getUser)
router.get('/', ensureAuth, entryController.getEntries)
router.get('/allUser/:id', ensureAuth, entryController.getAllUserEntries)
router.get('/addEntry', ensureAuth, entryController.getEntryForm)
router.post('/addEntry', upload.single("file"), entryController.addEntry)
router.delete('/deleteEntry/:id', entryController.deleteEntry)
router.get('/editEntry/:id', ensureAuth, entryController.getEditEntryForm)
router.put('/editEntry/:id', ensureAuth, entryController.editEntry)
router.get('/editUser/:id', ensureAuth, entryController.getEditUserForm)
router.put('/editUser/:id', ensureAuth, upload.single("file"), entryController.editUser)
router.put('/likeEntry/:id', entryController.likeEntry)
router.get('/:id', ensureAuth, entryController.getEntry)

module.exports = router

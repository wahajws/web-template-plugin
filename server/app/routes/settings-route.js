const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
require('../utils/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
    session: false
});

// Temporary: Disable JWT verification for testing
const requireAuthDisabled = (req, res, next) => {
    console.log('🔓 JWT verification disabled for testing');
    next();
};


/**************************************************************************************************** */
const SettingsController  = require('../controllers/admin/settings-controller');
/**************************************************************************************************** */
// Get all with pagination and filtering
router.get('/getall', requireAuthDisabled, SettingsController.getAll);

// Get by ID
router.get('/getbyid/:id', requireAuthDisabled, SettingsController.getById);

// Create new 
router.post('/create', requireAuth, trimRequest.all, SettingsController.create);

// Update 
router.put('/update/:id', requireAuth, trimRequest.all, SettingsController.update);

// Delete  (soft delete)
router.delete('/delete/:id', requireAuth, SettingsController.delete);

// Get by Key
router.get('/getbykey/:dataKey', requireAuthDisabled, trimRequest.all, SettingsController.getByKey);

module.exports = router;
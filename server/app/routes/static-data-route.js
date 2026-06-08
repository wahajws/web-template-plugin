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
const StaticDataController  = require('../controllers/admin/static-data-controller');
/**************************************************************************************************** */
// Get all with pagination and filtering
router.get('/getall', requireAuthDisabled, StaticDataController.getAll);

// Get by ID
router.get('/getbyid/:id', requireAuthDisabled, StaticDataController.getById);

// Create new 
router.post('/create', requireAuth, trimRequest.all, StaticDataController.create);

// Update 
router.put('/update/:id', requireAuth, trimRequest.all, StaticDataController.update);

// Delete  (soft delete)
router.delete('/delete/:id', requireAuth, StaticDataController.delete);

// Get by Key
router.get('/getbykey/:dataKey', requireAuthDisabled, trimRequest.all, StaticDataController.getByKey);

module.exports = router;
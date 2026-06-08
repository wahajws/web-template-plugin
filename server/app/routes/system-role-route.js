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
const SystemRoleController  = require('../controllers/admin/system-role-controller');
/**************************************************************************************************** */
// Get all with pagination and filtering
router.get('/getall', requireAuthDisabled, SystemRoleController.getAll);

// Get by ID
router.get('/getbyid/:id', requireAuthDisabled, SystemRoleController.getById);

// Create new 
router.post('/create', requireAuthDisabled, trimRequest.all, SystemRoleController.create);

// Update 
router.put('/update/:id', requireAuthDisabled, trimRequest.all, SystemRoleController.update);

// Delete  (soft delete)
router.delete('/delete/:id', requireAuthDisabled, SystemRoleController.delete);

module.exports = router;
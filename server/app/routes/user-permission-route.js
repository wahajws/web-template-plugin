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
const UserPermissionController  = require('../controllers/admin/user-permission-controller');
/**************************************************************************************************** */
// Get all with pagination and filtering
router.get('/getall', requireAuthDisabled, UserPermissionController.getAll);

// Get by Id
router.get('/getbyid/:id', requireAuthDisabled, UserPermissionController.getById);

// Get by User Id
router.get('/getbyuserid/:id', requireAuthDisabled, UserPermissionController.getByUserId);

// Create new 
router.post('/create', requireAuthDisabled, trimRequest.all, UserPermissionController.create);

// Update 
router.put('/update/:id', requireAuthDisabled, trimRequest.all, UserPermissionController.update);

// Delete  (soft delete)
router.delete('/delete/:id', requireAuthDisabled, UserPermissionController.delete);

// Get all navigation menus enhanced view
router.get('/getEnhanced', trimRequest.all, UserPermissionController.getEnhanced);

module.exports = router;
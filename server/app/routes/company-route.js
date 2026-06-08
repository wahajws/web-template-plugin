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
const CompanyController  = require('../controllers/admin/company-controller');
/**************************************************************************************************** */
// Get all with pagination and filtering
router.get('/getall', requireAuthDisabled, CompanyController.getAll);

// Get by ID
router.get('/getbyid/:id', requireAuthDisabled, CompanyController.getById);

// Create new 
router.post('/create', requireAuth, trimRequest.all, CompanyController.create);

// Update 
router.put('/update/:id', requireAuth, trimRequest.all, CompanyController.update);

// Delete  (soft delete)
router.delete('/delete/:id', requireAuth, CompanyController.delete);

module.exports = router;
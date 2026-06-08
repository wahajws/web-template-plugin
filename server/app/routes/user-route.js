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

// /**************************************************************************************************** */
const UserController = require('../controllers/users/user-controller');
// /**************************************************************************************************** */
// // Get all with pagination and filtering
router.get('/getall', requireAuthDisabled, UserController.getAll);

// Get by Id
router.get('/getbyid/:id', requireAuthDisabled, UserController.getById);

// Create new 
router.post('/create', requireAuth, trimRequest.all, UserController.create);

// Update 
router.put('/update/:id', requireAuth, trimRequest.all, UserController.update);

// Delete (soft delete)
router.delete('/delete/:id', requireAuth, UserController.delete);

// /**************************************************************************************************** */
// Custom route to get navigation menu for a user
// /**************************************************************************************************** */
router.get('/getnavmenu/:id', requireAuthDisabled, UserController.getNavMenu);

module.exports = router;

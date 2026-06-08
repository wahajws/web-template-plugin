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

const NavMenuController = require('../controllers/admin/nav-menu-controller');

// Get all navigation menus
router.get('/getAll', trimRequest.all, NavMenuController.getAll);

// Get navigation menu by ID
router.get('/getById/:id', trimRequest.all, NavMenuController.getById);

// Create new navigation menu
router.post('/create', requireAuthDisabled, trimRequest.all, NavMenuController.create);

// Update navigation menu
router.put('/update/:id', requireAuthDisabled, trimRequest.all, NavMenuController.update);

// Delete navigation menu (soft delete)
router.delete('/delete/:id', requireAuthDisabled, NavMenuController.delete);

// Get all navigation menus
router.post('/getAuthorised', trimRequest.all, NavMenuController.getAuthorised);

module.exports = router;

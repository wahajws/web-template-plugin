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

const NavMenuRoleController = require('../controllers/admin/nav-menu-role-controller');

// Get all navigation menus
router.get('/getAll', trimRequest.all, NavMenuRoleController.getAll);

// Get navigation menu by ID
router.get('/get', trimRequest.all, NavMenuRoleController.getById);

// Create new navigation menu
router.post('/create', requireAuth, trimRequest.all, NavMenuRoleController.create);

// Update navigation menu
router.put('/:id', requireAuth, trimRequest.all, NavMenuRoleController.update);

// Delete navigation menu (soft delete)
router.delete('/:id', requireAuth, NavMenuRoleController.delete);

// Get all navigation menus enhanced view
router.get('/getEnhanced', trimRequest.all, NavMenuRoleController.getEnhanced);

module.exports = router;

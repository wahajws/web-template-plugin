'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const routesPath = `${__dirname}/`;
const { removeExtensionFromFile } = require('../utils');
const { loadPlugins } = require('../plugins/plugin-loader');


function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    // verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // now you can access username
    console.log("User:", decoded.username);

    req.user = decoded;  // attach whole payload
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

/*
 * Load routes statically and/or dynamically
 */

// Load Auth route
router.use('/auth', require('./auth-route'));
router.use('/admin/nav-menu', require('./nav-menu-route'));
router.use('/admin/nav-menu-role', require('./nav-menu-role-route'));
router.use('/admin/company', require('./company-route'));
router.use('/admin/static-data', require('./static-data-route'));
router.use('/admin/system-role', require('./system-role-route'));
router.use('/admin/user', require('./user-route'));
router.use('/admin/user-permission', require('./user-permission-route'));
router.use('/admin/settings', require('./settings-route'));
router.use('/user', require('./user-route'));
router.use('/admin/plugins', require('./plugin-management-route'));

loadPlugins(router);

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((file) => {
	// Take filename and remove last part (extension)
	const routeFile = removeExtensionFromFile(file);
	// Prevents loading of this file and auth file
	return routeFile !== 'index' && routeFile !== 'auth' && file !== '.DS_Store'
		? router.use(`/${routeFile}`, require(`./${routeFile}`))
		: '';
});

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
	res.status(404).json({
		errors: {
			msg: 'URL_NOT_FOUND'
		}
	});
});

module.exports = router;

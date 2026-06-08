'use strict';

const express = require('express');
const trimRequest = require('trim-request');
const PluginManagementController = require('../controllers/admin/plugin-management-controller');

const router = express.Router();

router.get('/getAll', PluginManagementController.getAll);
router.post('/install/:name', trimRequest.all, PluginManagementController.install);
router.post('/uninstall/:name', trimRequest.all, PluginManagementController.uninstall);
router.delete('/delete/:name', trimRequest.all, PluginManagementController.delete);

module.exports = router;

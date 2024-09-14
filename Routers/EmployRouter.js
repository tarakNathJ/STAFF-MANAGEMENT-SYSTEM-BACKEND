const express = require('express');

const Router = express.Router();

const { OverTimeDetails } = require('../Controller/EmployDetails')
const { auth, } = require('../MiddleWare/AuthMiddleWare')

Router.post('/OverTimeStart', auth, OverTimeDetails);


module.exports = Router;
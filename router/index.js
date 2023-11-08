const router = require('express').Router();

const test = require('./test');
const users = require('./users')


router.use('/test', test);
router.use('/user', users );






module.exports = router
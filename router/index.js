const router = require('express').Router();

const test = require('./test');
const users = require('./users')
const prescription = require('./prescriptions')


router.use('/test', test);
router.use('/user', users );
router.use('/prescription', prescription)






module.exports = router
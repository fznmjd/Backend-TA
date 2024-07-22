const express = require('express');
const router = express.Router();

const userController = require('../cotrollers/userController');
const verifyToken = require('../middleware/verifyToken');

// router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/register',verifyToken, userController.register);
// router.get('/all', userController.getUsers);
router.get('/all', verifyToken, userController.getUsers);
router.put('/edit/:id',verifyToken,  userController.editUser);
router.delete('/delete/:id',verifyToken, userController.deleteUser);


module.exports = router;
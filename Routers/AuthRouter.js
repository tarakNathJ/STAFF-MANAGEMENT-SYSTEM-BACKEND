const express = require('express');
const Router = express.Router();

// import all function 
const {
    SignUp,
    SendMail,
    LogIn,
    AddUserAllDetails,
    DeleteUser,
    Logout,
    UpdateUserDetails,
    ProvideSallary,
    Allemploy,
    SearchEmploy,
    UserAllDetails,
    UpdateAdmin,
    AdminDetails
} = require('../Controller/Auth');
const { auth, IsAdmin } = require('../MiddleWare/AuthMiddleWare');
const upload = require('../MiddleWare/Milter');


// to create request
Router.post('/SendOTP', SendMail);
Router.post('/SignUp', SignUp);
Router.post('/logIn', LogIn);
Router.post('/UpdateUserDetails', auth, upload.single("image"), AddUserAllDetails);
Router.post('/DeleteUser', auth, DeleteUser);
Router.get('/logout', Logout);
Router.post('/UpdateUser', auth, IsAdmin, UpdateUserDetails);
Router.post('/Sallary', auth, IsAdmin, ProvideSallary);
Router.get('/AllEmploy', Allemploy);
Router.post('/Search', SearchEmploy);
Router.get('/EmployDetails', auth, UserAllDetails);
Router.post('/AdminProfile', auth, IsAdmin, UpdateAdmin);
Router.post('/AdminDetails', auth, IsAdmin, AdminDetails)




module.exports = Router;
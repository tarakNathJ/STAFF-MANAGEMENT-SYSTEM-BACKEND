const MailSender = require('../Utile/MailSender')
const OTP_Module = require('../Modules/OTP');
const OTP_Generator = require('otp-generator');
const User = require('../Modules/User');
const bcrypt = require('bcryptjs');
const PersonalDetails = require('../Modules/PersonalDetails')
const OverTime = require('../Modules/OverTime');
const JWT = require('jsonwebtoken');
const AccountDetails = require('../Modules/AccountDetails');

const cookieParser = require('cookie-parser');
const PaymentDetails = require('../Modules/PaymentDetails');
const AdminDetails = require('../Modules/Admin');
const { FileUploder } = require('../Config/Cloudinary');

require('dotenv').config();


// send otp 
exports.SendMail = async(req, res) => {
    try {
        // fetch email for request body
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Full Fill all request"
            })
        }
        // generate otp    
        const otp = OTP_Generator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const emailResponse = await MailSender(
            email,
            "OTP",
            `${otp}`,
        );

        // save data for otp modle
        const SaveOTP = new OTP_Module({
            email,
            otp
        });

        const saveData = await SaveOTP.save();
        // return success responce for complete process
        return res.status(200).json({
            success: true,
            saveData,

        })
    } catch (error) {
        // return success responce for incomplete process

        return res.status(500).json({

            success: false,
            message: "mail sending failed in controller/sendmailer",
        })
    }
}

// signup controller
exports.SignUp = async(req, res) => {
    try {
        // fetch data for request body
        const { Name, Email, Password, ReEnterPassword, AccountType, Sallary } = req.body;

        // chack chack all data
        if (!Name || !Email || !Password || !ReEnterPassword || !AccountType || !Sallary) {
            return res.status(401).json({
                success: false,
                message: "full fill all request",
            });
        }

        // check email id all ready present or not
        const ChackEmail = await User.findOne({ Email: Email });

        if (ChackEmail) {
            return res.status(401).json({
                success: false,
                message: "this  email allready used",

            });
        }


        // chack passward  both are same or not
        if (Password != ReEnterPassword) {
            return res.status(401).json({
                success: false,
                message: `both password are wrong   ${password}  - ${ReEnterPassword},`

            });
        }

        //hashing password
        const hashedPassword = bcrypt.hashSync(Password, 8);

        // create Personal details
        const PersonalDetai = await PersonalDetails.create({
            Name: Name,
            Email: Email,
            AccountType: AccountType,
            Sallary: Sallary,
            Status: Date.now()

        })

        // create over time Personal details
        const Over_Time = await OverTime.create({
            Name: Name
        })

        //  creat new entre in UserActivity
        const Save_UserActivity = await User.create({
            Name: Name,
            Email: Email,
            Password: hashedPassword,
            CreatedAt: Date.now(),
            AccountType: AccountType,
            PersonalDetailsID: PersonalDetai._id,
            OverDutyID: Over_Time._id
        })

        const emailResponse = await MailSender(
            Email,
            "Your account Password",
            `your account password is :- ${Password}`,
        );

        // return responce 
        return res.status(200).json({
            success: true,
            message: "success fully complete process",

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server site error",
        })
    }
}


// log in controller ..
exports.LogIn = async(req, res) => {
    try {
        const { Email, Password } = req.body;

        // chack email and password varification ...
        if (!Email || !Password) {
            return res.status(400).json({
                success: true,
                message: "full fill all request"
            })
        }
        const UserDetails = await User.findOne({ Email: Email });

        if (!UserDetails) {
            return res.status(400).json({
                success: false,
                message: "user are not register pleace sign up"
            })
        }

        if (bcrypt.compareSync(Password, UserDetails.Password)) {
            const Payload = {
                Email: Email,
                ID: UserDetails._id,
                PersonalDetailsID: UserDetails.PersonalDetailsID,
                OverDutyID: UserDetails.OverDutyID,
                AccountType: UserDetails.AccountType
            };
            const token = JWT.sign(Payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });
            UserDetails.token = token;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            return res.cookie("token", token).status(200).json({
                success: true,
                message: "log in success fully",
                token,
                UserDetails,

            })


        } else {
            return res.status(400).json({
                success: false,
                message: "wrong password ,enter write password"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server site error In login ",
        })
    }
}


// add user All Details
exports.AddUserAllDetails = async(req, res) => {
    try {
        const Id = req.ActiveUser.ID;
        const PersonalID = req.ActiveUser.PersonalDetailsID;
        const { PhoneNumber, Address, googlePayId } = req.body;

        // varify all field are full fill  or not
        if (!PhoneNumber || !Address || !googlePayId) {
            return res.status(400).json({
                success: false,
                message: "full fill all Request"
            })
        }


        if (!req.file.path) {
            return res.status(400).json({
                success: false,
                message: "file are not present"
            })
        }

        const Result = await FileUploder(req.file.path);



        // searching user .to date base
        const ShowAllPersonalDetails = await User.findOne({ _id: Id })

        // to store UserAccount Details
        const CreateAccountDetails = await AccountDetails.create({
            Name: ShowAllPersonalDetails.Name,
            GooglePayUpi: googlePayId,
        })

        // and update UserPersonal details
        const UpdatePersonalDetails = await PersonalDetails.findByIdAndUpdate({ _id: PersonalID }, {
            PhoneNumber: PhoneNumber,
            Address: Address,
            AccountDetailsID: CreateAccountDetails._id,
            ImageUrl: Result.url


        }, { new: true });

        // return success responce
        return res.status(200).json({
            success: true,
            message: "success fully add all details.",
            UpdatePersonalDetails
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server side error'
        })
    }
}

// delete user all details
exports.DeleteUser = async(req, res) => {
    try {

        const { ID } = req.body;

        const FindUserData = await User.findById({ _id: ID })

        const FindUser = await PersonalDetails.findOne({ _id: FindUserData.PersonalDetailsID })
            // delete AccountDetails
        if (FindUser.AccountDetailsID) {

            const DeleteAccount = await AccountDetails.findByIdAndDelete({ _id: FindUser.AccountDetailsID })
        }

        //delete User
        const DeleteUser = await User.findByIdAndDelete({ _id: ID })

        // delete Personal Details
        const DeletePersonalDetails = await PersonalDetails.findByIdAndDelete({ _id: FindUserData.PersonalDetailsID })

        // delete OverTime
        const DeleteOverTime = await OverTime.findByIdAndDelete({ _id: FindUserData.OverDutyID })


        return res.status(200).json({
            success: true,
            message: "success fully delete all user details"
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'server side error Delete User'
        })
    }
}

// logout 
exports.Logout = async(req, res) => {
    try {

        // logout success fully 
        return res.cookie('token', 'none', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        }).status(200).json({
            success: true,
            message: "logout success fully"
        })



    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "server side error"
        })
    }
}

// Update User Details
exports.UpdateUserDetails = async(req, res) => {
    try {

        const { ID, Name, PhoneNumber, Email, Address, AccountType, Sallary } = req.body;

        const UpdateUser = await User.findByIdAndUpdate({ _id: ID }, {
            Name: Name,
            Email: Email,
            AccountType: AccountType,
            UpdateDate: Date.now()
        }, { new: true });

        const UpdatePersonalDetails = await PersonalDetails.findByIdAndUpdate({ _id: UpdateUser.PersonalDetailsID }, {
            Name: Name,
            Email: Email,
            PhoneNumber: PhoneNumber,
            Address: Address,
            AccountType: AccountType,
            Sallary: Sallary,
            Status: Date.now()
        });

        const UpdateOverTimeDetails = await OverTime.findByIdAndUpdate({ _id: UpdateUser.OverDutyID }, { Name: Name }, { new: true });
        return res.status(200).json({
            success: true,
            message: "success fully Update User all details"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server side error"
        })
    }

}

// provide Sallary
exports.ProvideSallary = async(req, res) => {
        try {
            const { UserPersonalId, AdminPerSonalID, EmployName, ProviderName, Sallary } = req.body;

            // create Payment ..
            const Payment = await PaymentDetails.create({ Name: ProviderName, Salary: Sallary, EmployName: EmployName });
            // Update Admin Payment Details
            const UpdateAdminDetails = await AdminDetails.findByIdAndUpdate({ _id: AdminPerSonalID }, {
                    $push: {
                        PaymentDetailsId: Payment._id,
                    }
                })
                // Update Employ Payment Details
            const UpdateEmploy = await PersonalDetails.findByIdAndUpdate({ _id: UserPersonalId }, {
                $push: {
                    PaymentDetailsID: Payment._id
                }
            }, { new: true })

            return res.status(200).json({
                success: true,
                message: "Payment Success full"
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server Side error "
            })
        }
    }
    // all employ Details
exports.Allemploy = async(req, res) => {
    try {
        const AllEmploy = await User.find();
        return res.status(200).json({
            success: true,
            message: "success fully fetch all employ",
            AllEmploy
        })

    } catch (error) {

        return rse.status(500).json({
            success: false,
            message: "sorry .server side errror"
        })
    }
}

// search spasific user
exports.SearchEmploy = async(req, res) => {
    try {
        const { Name } = req.body;
        const UserDetails = await User.findOne({ Name: Name });
        return res.status(200).json({
            success: true,
            message: "User Are persent ",
            UserDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Employ are not present"
        })
    }
}

// User all details
exports.UserAllDetails = async(req, res) => {

    try {
        const Id = req.ActiveUser.ID;
        const PersonalID = req.ActiveUser.PersonalDetailsID;

        const UserAllDetails = await User.findById({ _id: Id }).populate('PersonalDetailsID').populate('OverDutyID').exec();
        const SallaryDetails = await PersonalDetails.findById({ _id: PersonalID }).populate('AccountDetailsID').populate('PaymentDetailsID').exec();
        return res.status(200).json({
            success: true,
            message: "seccess fully fetch all details",
            UserAllDetails,
            SallaryDetails
        })

    } catch (errro) {
        return res.status(500).json({
            success: false,
            message: "server side error",
        })
    }
}

// updateAdmin..
exports.UpdateAdmin = async(req, res) => {
    try {
        const Id = req.ActiveUser.ID;
        const PersonalID = req.ActiveUser.PersonalDetailsID;
        const otp = OTP_Generator.generate(8, { specialChars: false })
        const CreateAdmin = await AdminDetails.create({
            UserId: Id,
            PersonalId: PersonalID,
            LICENCE_Number: `${otp}${Date.now()}`,
            Status: Date.now()
        })

        return res.status(200).json({
            success: true,
            message: "success fully update",
            CreateAdmin
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

exports.AdminDetails = async(req, res) => {
    try {


        const { UserPersonalId } = req.body;
        const FindUser = await PersonalDetails.findById({ _id: UserPersonalId });
        const AccountData = await AccountDetails.findById({ _id: FindUser.AccountDetailsID });
        if (!FindUser) {
            return res.status(400).json({
                success: false,
                message: "User Are not Present "
            })
        }
        const AdminData = await AdminDetails.findOne();

        if (AdminData) {
            const Payload = {
                Name: FindUser.Name,
                Email: FindUser.Email,
                Salary: FindUser.Sallary,
                UPI_ID: AccountData.GooglePayUpi,
                Number: FindUser.PhoneNumber,
                AccountNumber: process.env.AccountNumber,
                RazorPayId: process.env.RazorPayID,
                RazorPayPassword: process.env.Password
            };

            return res.status(200).json({
                success: true,
                message: "success Complete",
                Payload,
                AdminData
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Admin Details Are not Present"
            })
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }

}
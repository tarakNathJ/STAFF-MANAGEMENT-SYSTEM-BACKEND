const OverTime = require('../Modules/OverTime');
const User = require('../Modules/User');


// over Time start ...
exports.OverTimeDetails = async(req, res) => {
    try {
        const Id = req.ActiveUser.ID;
        const PersonalID = req.ActiveUser.PersonalDetailsID;
        const OverTimeID = req.ActiveUser.OverDutyID;

        const { Duration } = req.body;

        const UpdateUser = await OverTime.findByIdAndUpdate({ _id: OverTimeID }, {
            $push: {
                Start: Date.now(),
                Duration: Duration
            }
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "OverTime start success fully",
            UpdateUser
        })

    } catch (error) {
        return res.status(500).json({

            success: false,
            message: "Server Side Error",
        })
    }
}


// exports.FindAllUser = async(req, res) => {

//     try {
//         const user = await User.find({})


//     } catch (error) {}
// }
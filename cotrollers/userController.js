const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// const register = async (req, res) => {
//     const {username, email, password, role} = req.body;

//     const user = await User.findOne({email: email})
//     if (!username || !password || !email)
//     return res.status(400).json({
//         success: false,
//         statusCode: res.statusCode,
//         message: 'Please complate input data',
//     });
//     const emailRegex = /@gmail\.(com|id)$/i;
//     if (!emailRegex.test(email))
//     return res.status(400).json({
//         success: false,
//         statusCode: res.statusCode,
//         message: 'Invalid format email',
//     })
//     if (user)
//     return res.status(400).json({
//         success: false,
//         statusCode: res.statusCode,
//         message: 'Your email has been registered!',
//     })

//     const salt = await bcrypt.genSalt();
//     const hashPassword = await bcrypt.hash(password, salt);
//     try {
//         await User.create({
//             username: username,
//             email:email,
//             password:hashPassword,
//             role: role,
//         });
//         res.json({
//             success: true,
//             statusCode: res.statusCode,
//             message: 'Register Successfully',
//         });
//     } catch (err) {
//         res.json({
//             success: false,
//             statusCode: res.statusCode,
//             error: {
//                 message: err.message,
//                 uri: req.originalUrl,
//             },
//         });
//         console.log(error);
//     }
// };
const register = async (req, res) => {
    const {username, password, role} = req.body;

    const user = await User.findOne({username: username})
    if (!username || !password || !role)
    return res.status(400).json({
        success: false,
        statusCode: res.statusCode,
        message: 'Please complate input data',
    });
    if (user)
    return res.status(400).json({
        success: false,
        statusCode: res.statusCode,
        message: 'Your email has been registered!',
    })

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            username: username,
            password:hashPassword,
            role: role,
        });
        res.json({
            success: true,
            statusCode: res.statusCode,
            message: 'Register Successfully',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            statusCode: res.statusCode,
            error: {
                message: err.message,
                uri: req.originalUrl,
            },
        });
        console.log(err);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({username})

        if (!user) {
            return res.status(404).json({
                success: false,
                statusCode: res.statusCode,
                message: "User Not Found",
            });
        }
    
        const match = await bcrypt.compare(password, user.password);
        if (!match)
        return res.status(400).json({
            success: false,
            statusCode: res.statusCode,
            message: "Password Wrong!!!",
        });
    
        const userId = user._id;
        const userName = user.username;
        // const emailId = user.email;
        const role = user.role;
    
        const accessToken = jwt.sign({
            userId, userName, role
        }, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = jwt.sign({
            userId, userName, role
        }, process.env.REFRESH_TOKEN_SECRET);
    
        await User.updateOne(
            { _id: userId }, // Query untuk menemukan dokumen dengan ID yang sesuai
            { $set: { refresh_token: refreshToken } }
        );
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
    
        res.json({
            success: true,
            statusCode: res.statusCode,
            message: "Login Success",
            data: {
              userId,
              userName,
              accessToken,
              role
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            statusCode: res.statusCode,
            error: {
                message: "Internal Server Error",
                uri: req.originalUrl,
            },
        });
    }
}
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const user = await User.findOne({email})

//         const emailRegex = /@gmail\.(com|id)$/i;
//         if (!emailRegex.test(email))
//         return res.status(400).json({
//             success: false,
//             statusCode: res.statusCode,
//             message: 'Invalid format email',
//         })

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 statusCode: res.statusCode,
//                 message: "User Not Found",
//             });
//         }
    
//         const match = await bcrypt.compare(password, user.password);
//         if (!match)
//         return res.status(400).json({
//             success: false,
//             statusCode: res.statusCode,
//             message: "Password Wrong!!!",
//         });
    
//         const userId = user._id;
//         const userName = user.username;
//         const emailId = user.email;
//         const role = user.role;
    
//         const accessToken = jwt.sign({
//             userId, userName, emailId
//         }, process.env.ACCESS_TOKEN_SECRET);
//         const refreshToken = jwt.sign({
//             userId, userName, emailId
//         }, process.env.REFRESH_TOKEN_SECRET);
    
//         await User.updateOne(
//             { _id: userId }, // Query untuk menemukan dokumen dengan ID yang sesuai
//             { $set: { refresh_token: refreshToken } }
//         );
    
//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             maxAge: 24 * 60 * 60 * 1000,
//         });
    
//         res.json({
//             success: true,
//             statusCode: res.statusCode,
//             message: "Login Success",
//             data: {
//               userId,
//               email,
//               userName,
//               accessToken,
//               role
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             statusCode: res.statusCode,
//             error: {
//                 message: "Internal Server Error",
//                 uri: req.originalUrl,
//             },
//         });
//     }
// }

const deleteUser = async (req,res) => {
    const {id} = req.params

    try {
        const user = await User.findOneAndDelete({_id: id});

        if(!user){
            res.status(404).json({
                status: 'error',
                message: 'User not found'
              });
        } else {
            res.json({
                status: 'success',
                statusCode: res.statusCode,
                message: "Delete Successfully"
              });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat menghapus user');
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        if(users.length > 0) {
            res.status(200).json({
                success: true,
                statusCode: res.statusCode,
                data: users.map((user)=> ({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }))
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Data user tidak ditemukan' 
              });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil data user');
    }
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body; // Data diambil dari body request
    try {
        const user = await User.findOneAndUpdate(
            { _id: id },
            { $set: { username, password, role } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        } else {
            res.json({
                status: 'success',
                statusCode: res.statusCode,
                message: "Edit Successfully",
                data: user // Mengembalikan data user yang telah diperbarui
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengedit user');
    }
}




module.exports = { register, login, deleteUser, getUsers, editUser };
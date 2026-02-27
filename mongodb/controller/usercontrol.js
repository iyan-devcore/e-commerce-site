import User from "../modules/Users.js";
import multer from "multer";

export const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,'./uploads')
        },

        filename: function(req,file,cb){
            cb(null,file.fieldname+ "_" + Date.now() + ".jpg")
        }
    })
})

export const addUser = async (req, res) => {

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        imageUpload: req.file ? req.file.filename : null
    })
    try {
        const saveduser = await user.save();
        res.status(201).json({ message: "User added successfully", data: saveduser });
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
}

export const getUsers = async (req, res) => {
    try{
        const users = await User.find();
        const userwithimage = users.map((user) => {
            return {
                name: user.name,
                email: user.email,
                password: user.password,
                imageUpload: user.imageUpload ? `http://localhost:5000/uploads/${user.imageUpload}` : null
            }
        })
        res.status(200).json({ message: "Users fetched successfully", data: userwithimage });
    }catch(error){
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully", data: user });
    }catch(error){
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}

export const updateUser = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            imageUpload: req.file ? req.file.filename : null
        }, { new: true });
        res.status(200).json({ message: "User updated successfully", data: user });
    }catch(error){
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
}
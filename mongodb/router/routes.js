import express from "express";
import { addUser, loginUser, googleLogin, imageUpload, getUsers, deleteUser, updateUser, searchUser } from "../controller/usercontrol.js";
import { authMiddleware } from "../utils/authmiddleware.js";

const router = express.Router();

router.post('/addUser',imageUpload.single('imageUpload'),addUser);
router.post('/loginUser',loginUser);
router.post('/googleLogin', googleLogin);
router.get('/getUsers',authMiddleware, getUsers);
router.delete('/deleteUser/:id',authMiddleware,deleteUser);
router.put('/updateUser/:id',authMiddleware,imageUpload.single('imageUpload'),updateUser);
router.get('/searchUser',authMiddleware,searchUser);

export default router;
import express from "express";
import { addUser, loginUser, googleLogin, imageUpload, getUsers, deleteUser, updateUser, searchUser } from "../controller/usercontrol.js";

const router = express.Router();

router.post('/addUser',imageUpload.single('imageUpload'),addUser);
router.post('/loginUser', loginUser);
router.post('/googleLogin', googleLogin);
router.get('/getUsers',getUsers);
router.delete('/deleteUser/:id',deleteUser);
router.put('/updateUser/:id',imageUpload.single('imageUpload'),updateUser);
router.get('/searchUser',searchUser);

export default router;
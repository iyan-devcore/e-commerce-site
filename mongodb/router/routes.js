import express from "express";
import { addUser, loginUser, imageUpload, getUsers, deleteUser, updateUser, searchUser } from "../controller/usercontrol.js";

const router = express.Router();

router.post('/addUser',imageUpload.single('imageUpload'),addUser);
router.post('/loginUser', loginUser);
router.get('/getUsers',getUsers);
router.delete('/deleteUser/:id',deleteUser);
router.put('/updateUser/:id',imageUpload.single('imageUpload'),updateUser);
router.get('/searchUser',searchUser);

export default router;
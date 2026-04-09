import express from "express";
import { imageUpload, getUsers, deleteUser, updateUser, searchUser } from "../controller/usercontrol.js";
import { authMiddleware } from "../utils/authmiddleware.js";

const router = express.Router();

router.get('/getUsers',authMiddleware, getUsers);
router.delete('/deleteUser/:id',authMiddleware,deleteUser);
router.put('/updateUser/:id',authMiddleware,imageUpload.single('imageUpload'),updateUser);
router.get('/searchUser',authMiddleware,searchUser);

export default router;
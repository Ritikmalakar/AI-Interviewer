import express from 'express'
import { analyze, finishInterview, generateQuestion, submitAnswer } from '../controller/interviewController.js';
import upload from '../middleware/upload.js';
import { authUser } from '../middleware/auth.js';

const router=express.Router();
router.post("/resume",upload.single('resume'),analyze);
router.post("/generateQues",authUser,generateQuestion);
router.post("/submitAnswer",authUser,submitAnswer)
router.post("/finishInterview", authUser, finishInterview);
export default router
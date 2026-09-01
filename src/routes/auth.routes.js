import { singup } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

// router.post('/sign-up',(req,res)=>{
//     res.send('POST /api/auth/sign-up');
//   });
router.post('/sign-up', singup);
router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in');
});
router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out');
});

export default router;

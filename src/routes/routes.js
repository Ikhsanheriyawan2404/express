import express from "express";
 
const router = express.Router();
router.use('/product', (req, res, next) => {
    // console.log('request: ', req);
    res.json({name: "Ikhsan Heriyawan", email: "ikhsan@gmial.com"})
})
 
export default router;
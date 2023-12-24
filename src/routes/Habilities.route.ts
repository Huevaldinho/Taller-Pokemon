import { Router } from "express";
//!TODO: Import model

const router = Router();

//Gets all 
router.get('/', async (req, res) => {
    res.status(200).json("message: 'Habilities route'");
});

export default router;

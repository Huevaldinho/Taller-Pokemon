import { Router } from "express";
import Habilities from "../collections/Habilities.collection";
const router = Router();

//Gets all 
router.get('/', async (req, res) => {
    const allHabilities = await Habilities.find({}).lean().exec();
    res.status(200).json(allHabilities); 
});

//Create hability
router.post('/', async (req, res) => {
    const newHability = await Habilities.create({
        name: req.body.name,
        description: req.body.description,
    });
    res.status(201).json(newHability);
});

export default router;

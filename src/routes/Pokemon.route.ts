
import { Router } from "express";
//!TODO: Import model

const router = Router();

//Get all pokemons
router.get('/', async (req, res) => {
    res.status(200).json({ message: 'pokemon route' });
});




export default router;

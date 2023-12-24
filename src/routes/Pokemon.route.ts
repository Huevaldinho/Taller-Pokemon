
import { Router } from "express";
import Pokemon from "../collections/Pokemon.collection";


const router = Router();

//Get all pokemons
router.get('/', async (req, res) => {
    const allPokemons = await Pokemon.find({}).lean().exec();
    res.status(200).json(allPokemons); 
});

//Create pokemon
router.post('/', async (req, res) => {//!TODO: Validar que el pokemon no exista
    //!TODO: Validar que existan las habilidades
    const newPokemon = await Pokemon.create({
        pokedexNumber: req.body.pokedexNumber,
        name: req.body.name,
        habilities: req.body.habilities,
        description: req.body.description,
        primaryType: req.body.primaryType,
        secondaryType: req.body.secondaryType,
    });
    res.status(201).json(newPokemon);
});




export default router;

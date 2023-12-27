
import { Router } from "express";
import Pokemon from "../collections/Pokemon.collection";
import Habilities from "../collections/Habilities.collection";


const router = Router();

//Get all pokemons
router.get('/', async (req, res) => {
    const allPokemons = await Pokemon.find({}).lean().exec();
    console.log("Get all pokemons");
    res.status(200).json(allPokemons); 
});

// Get pokemon by pokedexNumber
router.get('/pokedex', async (req, res) => {
    const pokedexNumber = req.query.pokedexNumber;
    console.log("Get pokemon by pokedexNumber:", pokedexNumber);

    const pokemon = await Pokemon.findOne({ pokedexNumber }).lean().exec();
    if (!pokemon) return res.status(404).json({ message: `Pokemon with pokedexNumber=${pokedexNumber} not found` });

    res.status(200).json(pokemon);
});

// Get pokemon by name
router.get('/name', async (req, res) => {
    const name = req.query.name;
    console.log("Get pokemon by name:", name);
    const pokemon = await Pokemon.findOne({ name }).lean().exec();
    if (!pokemon) return res.status(404).json({ message: `Pokemon with name=${name} not found` });
    res.status(200).json(pokemon);
});

//Create pokemon
router.post('/', async (req, res) => {
    //!TODO: Mover toda esta logica a otros endpoints, usar next() para pasar al siguiente middleware

    let pokedexNumber:number = req.body.pokedexNumber;
    if (pokedexNumber   < 1) return res.status(400).json({ message: `pokedexNumber must be >= 1` }); 
    let name:string = req.body.name;
    //*Validar por pokedexNumber
    if (!pokedexNumber) return res.status(400).json({ message: `pokedexNumber is required in the body.` });
    let pokemon = await Pokemon.findOne({ pokedexNumber }).lean().exec();
    if (pokemon) return res.status(400).json({ message: `Pokemon with pokedexNumber=${pokedexNumber} already exists` });    
    //*Validar por nombre
    if (!name) return res.status(400).json({ message: `name is required in the body.` });       
    pokemon = await Pokemon.findOne({ name }).lean().exec();
    if (pokemon) return res.status(400).json({ message: `Pokemon with name=${name} already exists` });
    //*Validar por tipo
    if (!req.body.primaryType) return res.status(400).json({ message: `All pokemons must have a primaryType` });
    //*Validar habilidades
    if (!req.body.habilities) return res.status(400).json({ message: `habilities is required in the body.` });
    const habilities : number[] = req.body.habilities;
    if (habilities.length == 0) return res.status(400).json({ message: `all pokemons must have at least one ability in the body` });
    for (let i = 0; i < habilities.length; i++) {
        const habilitie : number = habilities[i];
        const habilitieExists = await Habilities.findOne({ id: habilitie }).lean().exec();
        if (!habilitieExists) return res.status(400).json({ message: `Ability with id=${habilitie} not found` });
    }
    //description required in mongo
    !req.body.description ? req.body.description = "-" : req.body.description = req.body.description;

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

//Delete pokemon by pokedexNumber
router.delete('/:pokedexNumber', async (req, res) => {
    const deletedPokemon = await Pokemon.findOneAndDelete({pokedexNumber: req.params.pokedexNumber}).lean().exec();
    if (!deletedPokemon) return res.status(404).json({message: `Pokemon with pokedexNumber=${req.params.pokedexNumber} not found`});
    res.status(200).json(deletedPokemon);
});

//Update pokemon by pokedexNumber
router.put('/:pokedexNumber', async (req, res) => {
    if (parseInt(req.params.pokedexNumber)!==req.body.pokedexNumber) {
        return res.status(400).json({message: `pokedexNumber in URL and in body must be the same`});
    }
    const updatedPokemon = await Pokemon.findOneAndUpdate({pokedexNumber: req.params.pokedexNumber}, req.body, {new: true}).lean().exec();
    if (!updatedPokemon) return res.status(404).json({message: `Pokemon with pokedexNumber=${req.params.pokedexNumber} not found`});
    res.status(200).json(updatedPokemon);
});




export default router;

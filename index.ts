import mongoose from 'mongoose';
import express from 'express';

// Routes
import HabilitiesRouter  from './src/routes/Habilities.route';
import PokemonRouter from './src/routes/Pokemon.route';

const app = express();
const port = 3000;

app.use(express.json()); // <- Esta linea permite que se accese el body



app.use('/habilities', HabilitiesRouter);
app.use('/pokemon', PokemonRouter);

// const authenticationMiddleware = (req: Request, result: Response, next: () => any) => {
//     if (req.headers.authorization === 'Basic andres:obando') {
//         next();
//     }
//     else {
//         return result.status(401).json({ message: 'El usuario no esta autorizado' });
//     }
// }

const connectionString: string = 'mongodb+srv://huevaldinho:Ijx6zDA4byHXPJLc@cluster0.ztbjbhd.mongodb.net/EjemploIntroWEB';


const main = async () => {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
        console.log(`La aplicación está escuchando en el puerto ${port}`);
    });
};

main();


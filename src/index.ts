import mongoose from 'mongoose';
import express from 'express';
import { Response, NextFunction } from "express";
require('dotenv').config();

// Routes
import HabilitiesRouter  from './routes/Habilities.route';
import PokemonRouter from './routes/Pokemon.route';
import UserRouter from './routes/User.route';

const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');

app.use(express.json()); 

app.use('/habilities', authenticateToken,  HabilitiesRouter);
app.use('/pokemon', authenticateToken, PokemonRouter);
app.use('/users', UserRouter)

//-------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------
// middleware
function authenticateToken (req: any, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403)
        }

       req.user = user; //  (req as any).user = user; -> Linea cerda para evitar descargar la libreria express-jwt
        next();
    })
}
//---------------------------------------------------------------------------------------------------------------

function refreshTokenMiddleware(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
  
    if (!refreshToken) {
      return res.sendStatus(401);
    }
  
    // Verificar el refreshToken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      // Generar un nuevo accessToken
      const newAccessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '10s' });
  
      // Envía el nuevo accessToken en la respuesta
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      next();
    });
  }
  

//---------------------------------------------------------------------------------------------------------------

const connectionString: string = 'mongodb+srv://huevaldinho:Ijx6zDA4byHXPJLc@cluster0.ztbjbhd.mongodb.net/EjemploIntroWEB';

const main = async () => {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
        console.log(`La aplicación está escuchando en el puerto ${port}`);
    });
};

main();


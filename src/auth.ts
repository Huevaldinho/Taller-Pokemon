import UserModel from "./collections/User.collection";
import { Request, Response } from "express";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
require('dotenv').config();

const app = express();
const port = 4000;
const connectionString: string = 'mongodb+srv://huevaldinho:Ijx6zDA4byHXPJLc@cluster0.ztbjbhd.mongodb.net/EjemploIntroWEB';

app.use(express.json());

let refreshTokens: string[] = []; //-> Estos se deben guardar en una BD, pero por el momento se hara en una variable, lo cual no es funcional, ya que por ejemplo si se cae el server la lista estaria empty, perdiendo todos esos datos.

app.post('/token', (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete('/logout', (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

// Para iniciar sesión
app.post('/login', async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).json({ error: "Cannot find user" });
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      //res.status(200).json({ message: "User login successful" });

      // Parte de JWT
      const username = req.body.username;
      const userAuth = { name: username };

      const accessToken = generateAccessToken(userAuth);
      const refreshToken = jwt.sign(userAuth, process.env.REFRESH_TOKEN_SECRET as string);
      res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
    } else {
      res.status(401).json({ message: "User login failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
});

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '600s' });
}

const main = async () => {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
        console.log(`La aplicación está escuchando en el puerto ${port}`);
    });
};

main();

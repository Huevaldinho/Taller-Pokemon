import { Router } from "express";
import UserModel from "../collections/User.collection"

const router = Router();

// to encrypt passwords
const bcrypt = require('bcrypt');

// ---------------------------------------------------------------------------------------------------------------

// Get all users
router.get('/', async(req, res) => {
    const allPeople = await UserModel.find({}).lean().exec();
    console.log("Get all Users");
    res.status(200).json(allPeople);
})

//---------------------------------------------------------------------------------------------------------------

// Post to create a new user
router.post('/', async (req, res) => {
    // Mandatory fields validation
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Password length verification (At least 8 characters)
    if (req.body.password.length < 8) {
        return res.status(400).json({ error: "Password should be at least 8 characters long" });
    }

    try {
        // Check if the username already exists in the database
        const existingUser = await UserModel.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        //encryptation
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Create the user if all validations pass
        const user = await UserModel.create({
            username: req.body.username,
            password: hashedPassword,
        });

        // Respond with the created user
        res.status(201).json(user);
    } catch (error) {
        // Error handling
        console.error(error);
        res.status(500).json({ error: "An error occurred while creating the user" });
    }
});

//---------------------------------------------------------------------------------------------------------------

// Put to update/modify a user
router.put('/:username', async (req, res) => {

    // Check if the 'username' field is present in the request
    if (!req.params.username) {
        return res.status(400).json({ error: "The 'username' parameter is required" });
    }
    // Check if the 'newUsername' field is present in the request
    if (!req.body.newUsername) {
        return res.status(400).json({ error: "The 'newUsername' field is required" });
    }
    // Check if the 'newPassword' field is present in the request
    if (!req.body.newPassword) {
        return res.status(400).json({ error: "The 'newPassword' field is required" });
    }

    try {
        // Check if the user exists in the database
        let existingUser = await UserModel.findOne({ username: req.params.username });
        if (!existingUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        // Check if the newUsername exists in the database
        existingUser = await UserModel.findOne({ username: req.body.newUsername });
        if (existingUser) {
            return res.status(400).json({ error: "The 'newUsername' already exists" });
        }

        //encryptation
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
        // Perform the update if the user exists
        await UserModel.updateOne(
            { username: req.params.username },
            { $set: { username: req.body.newUsername, password: hashedPassword } }
        );

        res.status(202).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the user information" });
    }
});

//---------------------------------------------------------------------------------------------------------------

// Delete to delete a user
router.delete('/:username', async (req,res)=> {
      // Check if the user exists in the database
    try {
        let existingUser = await UserModel.findOne({ username: req.params.username });
        if (!existingUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        await UserModel.deleteOne({username: req.params.username});
        res.status(204).json({ message: "User deleted successfully" }); // El código de estado 204 indica que la solicitud se procesó con éxito, pero no se devuelve contenido en el cuerpo de la respuesta. 
    } catch (error) {
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
});
export default router;

//---------------------------------------------------------------------------------------------------------------
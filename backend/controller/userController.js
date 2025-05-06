import bcrypt from "bcrypt";
import User from "../models/userModels.js";
import { Sequelize } from "sequelize";

// GET
async function getUsers(req, res) {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        
        console.log(error.message);
    }
}

// GET By ID
async function getUserById(req, res) {
    try {
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// CREATE
async function createUser(req, res) {
    try {
        const { name, email, password, noHP, role } = req.body;
        // role = role || "user";

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashedPassword,
            noHP,
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "user"
            }            
        });

        res.status(201).json({ msg: "User Created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error creating user" });
    }
}


export { getUsers, createUser, getUserById };

// UPDATE
export const updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        await User.update(updateData, {
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error updating user" });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const result = await User.destroy({
            where: {
                id: req.params.id
            }
        });
        if (result === 0){
            res.status(404).json({ msg: "User Not Found" });
        } else {
            res.status(200).json({ msg: "User Deleted" });
        }
    } catch (error) {
        console.log(error.message);
    }                                   
}
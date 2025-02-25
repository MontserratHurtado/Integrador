//Crear usuarios
//Eliminar usuarios
//Actualizar Usuario
//Traer usuarios
//Traer UN usuario
//Logear usuario

import { UserModel } from "../models/UsersModel.js";
import jwt from "jsonwebtoken";

export default {
    //Asincrono significa que se puede tardar en ejecutar.
    createUser: async (req, res) => {
        try {
            const name = req.body.name;
            const password = req.body.password;
            const email = req.body.email;
            if (!name || !password || !email) {
                res.status(400).json({
                    "msg": "Parametros invalidos."
                })
            }
            const user = {
                name,
                password,
                email
            };
            await UserModel.create(user);
            res.status(200).json({
                "msg": "Usuario creado con exito"
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "msg": "Ocurrio un error al crear el usuario"
            });
            return;
        }
    },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserModel.findById(id);
            if (!user) {
                res.status(400).json({
                    "msg": "No se encontro usuario para eliminar"
                })
                return;
            }
            await UserModel.deleteOne({
                _id: id
            });
            res.status(200).json({
                "msg": "Usuario eliminado con exito"
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "msg": "Ocurrio un error al eliminar el usuario"
            });
            return;
        }
    },
    updateUser: async (req, res) => {
        try {
            const id = req.params.id;
            const prevUser = await UserModel.findById(id);
            if (!prevUser) {
                res.status(400).json({
                    "msg": "No se encontro usuario para actualizar"
                })
                return;
            }
            const name = req.body.name;
            const password = req.body.password;
            const email = req.body.email;
            if (!name || !password || !email) {
                res.status(400).json({
                    "msg": "Parametros invalidos."
                })
                return;
            }
            await UserModel.findByIdAndUpdate(id, {
                $set: {
                    name,
                    password,
                    email,
                    
                }
            });
            res.status(200).json({
                "msg": "Usuario actualizado con exito"
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "msg": "Ocurrio un error al actualizar el usuario"
            });
            return;
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.find();
            res.status(200).json({
                "msg": "Usuarios obtenido con exito",
                users
            });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "msg": "Ocurrio un error al obtener los usuarios"
            });
            return;
        }
    },
    getUser: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserModel.findById(id);
            if (!user) {
                res.status(400).json({
                    "msg": "No se encontro el usuario"
                })
                return;
            }
            res.status(200).json({
                "msg": "Usuario encontrado con exito",
                user
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "msg": "Ocurrio un error al obtener el usuario"
            });
            return;
        }
    },
    login: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await UserModel.findOne({ email, password });
            if (!user) {
                res.status(401).json({
                    "msg": "Credenciales invalidas"
                })
                return;
            }
            const token = jwt.sign(JSON.stringify(user), "shhhh");
            res.status(200).json({
                "msg": "Logueado con exito",
                token,
                user
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "msg": "Ocurrio un error al loguear el usuario"
            });
            return;
        }
    }
}

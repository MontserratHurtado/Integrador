import express from "express";
import mongoose from "mongoose";
import { DatesModel } from "./models/DatesModel.js";
import { AnswerModel } from "./models/AnswersModel.js";
import cors from "cors";
import UserController from "./controllers/UserController.js";

mongoose.connect("mongodb://localhost:27017/").then(() => {
    console.log("Conexion exitosa a la BD")
})
const app = express();

app.use(express.json());
app.use(cors())
app.get("/", (req, res) => {
    res.send("Hola desde mi servidor!")
});

app.post("/create", async (req, res) => {
    try {
        console.log("entro al inicio")
        const name = req.body.name;
        const age = req.body.age;
        const breed = req.body.breed;
        const owner = req.body.owner;
        const contact_number = req.body.contact_number;
        const description = req.body.description;
        const date = Date(req.body.date);
        if (!name || !age || !breed || !owner || !contact_number || !description || !date) {
            return res.status(400).json({
                msg: "Necesitamos todos los valores para almacenar un documento!"
            })
        }
        console.log("Paso las validaciones")
        const obj = {
            name_pet: name,
            age_pet: age,
            breed,
            name_user: owner,
            contact_number,
            description,
            date,
        };
        console.log(obj)
        await DatesModel.create(obj);
        return res.status(200).json({
            msg: "Cita almacenada con éxito!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Ocurrio un error al intentar guardar la cita" })
    }
})

app.get("/get-date", async (req, res) => {
    try {
        const data = await DatesModel.find();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Ocurrio un error al intentar obtener los datos" })
    }
})

app.post("/save-answers", async (req, res) => {
    //Arreglo del 1 al 20
    const numberOfQuestions = Array.from(Array(20).keys());
    let flag = true;
    for (const nQ of numberOfQuestions) {
        if (!req.body[`pregunta_${nQ}`]) {
            flag = false;
        }
    }
    if (!flag) {
        return res.status(400).json({ msg: "Datos incompletos" })
    }
    try {
        await AnswerModel.create(req.body);
        return res.status(200).json({ msg: "Datos almacenados con exito" })
    } catch (error) {
        return res.status(500).json({ msg: "Algo salio mal al guardar las respuestas" })
    }
})

app.get("/get-answers", async (req, res) => {
    return res.status(200).json(await AnswerModel.find())
})

app.get("/get-answers-to-chart", async (req, res) => {
    const allAnswers = await AnswerModel.find();
    let totalSiempre = 0;
    let totalAVeces = 0;
    let totalRaraVez = 0;
    let totalNunca = 0;

    for (const answer of allAnswers) {
        for (let i = 0; i < 20; i++) {
            const answerPerQuestion = answer[`pregunta_${i}`];
            /* 
            "Siempre",
            "A veces",
            "Rara vez",
            "Nunca"
            */
            if (answerPerQuestion === "Siempre") {
                totalSiempre++
            } else if (answerPerQuestion === "A veces") {
                totalAVeces++
            } else if (answerPerQuestion === "Rara vez") {
                totalRaraVez++
            } else {
                totalNunca++
            }
        }
    }
    return res.status(200).json([
        totalSiempre,
        totalAVeces,
        totalRaraVez,
        totalNunca
    ])
})

app.post("/user/create", UserController.createUser);
app.delete("/user/delete/:id", UserController.deleteUser);
app.put("/user/update/:id", UserController.updateUser);
app.get("/users", UserController.getAllUsers);
app.get("/user/:id", UserController.getUser);
app.post("/login", UserController.login);


app.listen(4000, () => {
    console.log("Servidor en linea!")
})
// import express from 'express'
// import morgan from 'morgan'
// const app=express()

// app.use(morgan())
// app.use(express.json())
// app.get('/',(req,res)=>{
//     res.status(201).json({"MSG":"HELLO"})
// })
// app.post('/body',(req,res)=>{
//     const {name,age}=req.body
//     console.log(name+" "+age)
//     res.json({"name":name})
// })
// app.put('/:id',(req,res)=>{
//     const id=req.params.id
//     res.json(id)
// })
// app.use((req,res)=>{
//     res.status(404).json("Route not found")
// })
// app.listen(8081,()=>{
//     console.log("server is running on port 8081")
// })

// import jwt from 'jsonwebtoken';

// const secretKey = 'your-secret-key';

// // Generate JWT
// const token = jwt.sign({ userId: 123 }, secretKey, { expiresIn: '1h' });

// // Verify JWT
// jwt.verify(token, secretKey, (err, decoded) => {
//   if (err) console.error('Invalid token');
//   else console.log('Decoded data:', decoded);
// });

// import bcrypt from 'bcrypt'
// const a='mahesh'
// const hashedPassword = bcrypt.hashSync(a, 10);
// console.log(hashedPassword)
// const match = await bcrypt.compare('mahesh',hashedPassword);
// console.log(match)


// import express from 'express'
// import mysql from 'mysql2'
// const connection = mysql.createConnection({
//     host: 'database-1.c5o4u64ksz1f.ap-south-1.rds.amazonaws.com',
//     user: 'admin', // Your MySQL username
//     password: 'password', // Your MySQL password
//     database: 'mahesh' // The database you want to connect to
//   });
//   connection.connect((err)=>{
//     if(err)
//         throw err 
//     console.log("Connected to database")
//   }
// )
// connection.query('select * from employees',(err,data)=>{
//     if(err)
//         throw err 
//     console.log(data)
// })
// const app=express()
// app.use(express.json())
// app.listen(3000,()=>{
//     console.log("server is running on port 3000")
// })


import dynamoDB from "./config/dynamodb_config.mjs";
import { GetItemCommand, PutItemCommand ,DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import express from "express";
const app = express();
app.use(express.json());
app.post('/user', async (req, res) => {
    const {id,name}=req.body 
    const params = {
        TableName: "Sample_Table",
        Item: {
            id: { S: String(id) },  
            name: { S: name }
        }
    };

    try {
        const command = new PutItemCommand(params);
        await dynamoDB.send(command);
        res.json({ message: "Item inserted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const params = {
        TableName: "Sample_Table",
        Key: { id: { S: String(id) } }
    };

    try {
        const command = new GetItemCommand(params);
        const data = await dynamoDB.send(command);
        res.json(data.Item || { message: "Item not found!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    const params = {
        TableName: "Sample_Table",
        Key: { id: { S: String(id) } }, 
          ReturnValues: "ALL_OLD" 
    };

    try {
        const command = new DeleteItemCommand(params);
        const data = await dynamoDB.send(command);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => console.log("Server running on port 3000"));
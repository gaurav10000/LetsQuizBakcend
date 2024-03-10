import dotenv from 'dotenv';
import app from "./app.js";
import connectToDb from './db/db.js';


dotenv.config({
    path: '.env'
})


connectToDb()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port: ${process.env.PORT}`)
        })   
    }).catch((err) => {
        console.error(err)
    });



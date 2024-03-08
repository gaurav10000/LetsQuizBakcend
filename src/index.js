import dotenv from 'dotenv';
import app from "./app.js";
import connectToDb from './db/db.js';


dotenv.config({
    path: '.env'
})


connectToDb()
    .then(() => {
        app.listen(process.env.PORT || 3300, () => {
            console.log(`Server is listening`)
        })   
    }).catch((err) => {
        console.error(err)
    });



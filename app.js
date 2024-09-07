require('dotenv').config();
const express = require('express')
const connectDB = require('./DB/config')
const DB_URI = process.env.MONGO_URI
const WhatsappMessages = require('./routers/whatsappRoutes')
const insertData = require('./services/insertTestData')


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/whatsapp', WhatsappMessages)




const port = process.env.PORT ||9000;
const start = async () => {
    try{
        await connectDB(DB_URI)
        await insertData()
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error){
        console.log(error);
    }
    
}

start()

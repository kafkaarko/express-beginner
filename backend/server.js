const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path')

dotenv.config();
const app = express();
const PORT = process.env.PORT

const bookRoutes = require('./Routes/Book.route')
const categoriesRoutes = require('./Routes/category.route')
const userRoutes = require('./Routes/User.route')
const pinjamRoutes = require('./Routes/Pinjam.route')

app.use(cookieParser());
app.use(express.json())//agar bisa mengirim inputan
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.API_FE_URL || "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials:true,
}))//agar bisa ke frontend
app.use("/uploads", express.static(path.join(process.cwd(), "Uploads")))


app.use('/api/books', bookRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pinjam', pinjamRoutes);

mongoose.connect(process.env.DATABASE_URL)
    .then(() =>{
        app.listen(PORT, () =>{
            console.log(`connect to db http://localhost:${PORT} !`)
        })
    })
    .catch((err) =>{
        console.log(err);
    })
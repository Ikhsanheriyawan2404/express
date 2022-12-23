const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const Routes = require("./src/routes/index.js");
const multer = require('multer');
const path = require('path');
 
const app = express();
mongoose.connect('mongodb://localhost:27017/blog',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer ({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

app.use(Routes);
 
app.listen(5000, ()=> console.log('Server up and running...'));
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app= express();
const port= 2000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req,res) => {
    res.render('home.ejs');
});

app.get('/home', (req,res) => {
    res.render('home.ejs');
});

app.get('/translate', (req,res) => {
    res.render('translang.ejs');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
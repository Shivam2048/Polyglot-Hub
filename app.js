import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app= express();
const port= 2000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/', (req,res) => {
    res.render('home.ejs');
});

app.use('/home', (req,res) => {
    res.render('home.ejs');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
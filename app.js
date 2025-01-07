import express from express;
import axios from 'axios';
import bodyParser from 'body-parser';

const app= express();
const port= 2000;
app.use(bodyParser.urlencoded({ extended: true })); 
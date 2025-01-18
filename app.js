import express, { response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app= express();
const port= 2000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

const DLAPIkey ='7440c27d1e677571954a08b236c6bb49';

app.get('/', (req,res) => {
    res.render('home.ejs');
});

app.get('/home', (req,res) => {
    res.render('home.ejs');
});

app.get('/translate', (req,res) => {
    res.render('translang.ejs');
});

app.post('/translate', async (req,res) => {
    let userText= req.body.userInput;
    console.log(userText);
    const LDresponse= await axios.post('https://ws.detectlanguage.com/0.2/detect',
    {
        q: userText,
    },
    {
        headers: {
          Authorization: `Bearer ${DLAPIkey}`, // Bearer token for authentication
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
    });
    const LDresult= LDresponse.data;
    // console.log(LDresult);
    if (LDresult && LDresult.data && LDresult.data.detections && LDresult.data.detections.length > 0) {
        let LD= LDresult.data.detections[0].language;
        console.log("Detected Language:", LD);

        //  tarnslation api
        const Tresponse= await axios.get(`https://api.mymemory.translated.net/get?q=${userText}&langpair=${LDresult.data.detections[0].language}|en`);
        const Tresult= Tresponse.data;
        // console.log(Tresult);
        if(Tresult && Tresult.matches && Tresult.matches.length > 0){
            let T=Tresult.matches[0].translation
            console.log(T);

            res.render('translang.ejs',{lang: LD, trans: T});
        }else{
            console.log('No translation available');
        }
      } else {
        console.log("No detections available.");
      }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
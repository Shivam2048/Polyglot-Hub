import express, { response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app= express();
const port= 2000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

const DLAPIkey ='7440c27d1e677571954a08b236c6bb49';

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log("Request body:", req.body);
    next();
});

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
    console.log("text for translation:",userText);
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
            console.log("Translation:",T);

            res.render('translang.ejs',{lang: LD, trans: T});
        }else{
            console.log('No translation available');
            res.render('translang.ejs',{lang: LD, trans: "No translation available"});
        }
    } else {
        console.log("No detections available.");
        res.send("No detections available.");
      }

});

app.get('/dictionary',(req,res) => {
    res.render('dictionary.ejs');
});

app.post('/dictionary', async (req,res) => {
    let userWord = req.body.userInput;

    if (!userWord || userWord.trim() === "") {
        return res.status(400).send("Invalid input: Please provide a valid word.");
    }

    // Render the dictionary view with the user input

    try {
        const Dresponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`);

        if (Dresponse.data && Dresponse.data.length > 0) {
            const Dresult = Dresponse.data[0];

            const word = Dresult.word;
            console.log("word from api:",word);

            const defination= Dresult.meanings[0].definitions[0].definition ? Dresult.meanings[0].definitions[0].definition : "no defination for this word found" ;
            console.log("Defenation of the word:",defination);

            const audio= Dresult.phonetics[0].audio ? Dresult.phonetics[0].audio: null;
            console.log("Audio link", audio);

            const synonym= Dresult.meanings[0].synonyms[0] ? Dresult.meanings[0].synonyms[0] : null;
            console.log("Synonym:", synonym);

            const antonym= Dresult.meanings[0].antonyms[0] ? Dresult.meanings[0].antonyms[0] : null;
            console.log("Antonym:",antonym);

            const wordInfo= {
                word: word,
                mean: defination,
                audio: audio,
                syno: synonym,
                anto: antonym,
            };

            res.render('dictionary.ejs', wordInfo);

        } else {
            console.log("No data found for this word");
            res.status(404).send("No data found for this word");
        }

    } catch (error) {
        console.error("Error in /dictionary route:", error.message);
        res.status(500).send("An error occurred while processing your request.");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
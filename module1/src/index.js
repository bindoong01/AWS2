const express = require("express");
const bodyparser = require('body-parser');
const path = require("path");
const hbs = require("hbs");
const areadata = require("../src/utils/areadata.js");
const weatherdata = require("../src/utils/weatherdata.js");
const  OpenAIApi  = require("openai");      
const { stringify } = require("querystring");
require("dotenv").config();
const { createLogger, format, transports } = require('winston');

// const sanitizeHtml = require('sanitize-html');


const app = express();
const PORT = process.env.PORT || 80;
const publicdir = path.join(__dirname,"../public");
const viewPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");
const openai = new OpenAIApi(process.env.OPENAI_API_KEY);

app.set("view engine","hbs");
app.set("views",viewPath);
hbs.registerPartials(partialsPath);

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(publicdir));


app.get('/',(req,res)=>{
    res.render("index",{
        TITLE: "API 과제",
        NAME: "HDB",
        EMAIL: "shinhan",
    })
})



app.post("/area",(req,res)=>{
    areadata(req.body.location,(error,{area}={})=>{
        if (error){
            return res.send({error});
        }
        return res.render('area',{
            location: area["response"]["body"]["items"]["item"][0]["addr1"],
            location_2: area["response"]["body"]["items"]["item"][0]["addr2"],
            object: area["response"]["body"]["items"]["item"][0]["title"],
        })
    })
})

app.post("/weather",(req,res)=>{
    weatherdata(req.body.location,(error,{weather}={})=>{
        if (error){
            return res.send({error});
        }
        return res.render('weather',{
            location: weather["response"]["body"]["items"]["item"][0]["t1"],
        })
    })
})

app.post("/image", async (req, res) => { //post 요청 경로 설정 
    // Get the prompt from the request
    const  prompt  = stringify(req.body); //프롬프트 변수 추출 
  
    async function createImage(){
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        image_url = response.data[0].url;
        return res.send(image_url);
    }
    createImage();
  });

const logger = createLogger({
level: 'info',
format: format.json(),
transports: [
new transports.File({ filename: 'combined.log' }),
new transports.File({ filename: 'error.log', level: 'error' }),
],
});

    

app.listen(PORT,()=>{
    console.log(`server running to ${PORT}`);
})

//aws 배포 
// if (process.env.NODE_ENV === 'production') {
//     app.use(morgan('combined'));
//     } else {
//     app.use(morgan('dev'));
//     }

//     app.use(cookieParser(process.env.COOKIE_SECRET));
//     const sessionOption = {
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//     httpOnly: true,
//     secure: false,
//     },
//     };
//     if (process.env.NODE_ENV === 'production') {
//     sessionOption.proxy = true;
//     // sessionOption.cookie.secure = true;
//     }
//     app.use(session(sessionOption));
//     app.use(passport.initialize());

    
// const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
// console.log(sanitizeHtml(html));
    
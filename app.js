const express = require('express');
const app = express();
const port = 3000
const crypto = require("crypto");
const fs = require('fs');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const timestamp = new Date().getTime();
let encryText;

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('/crypt/:texto', async function (req, res) {
    req.params; 
    let txt = req.params.texto;
    
    let mykey = crypto.createCipher('aes-128-cbc', 'mypassword', 'hex');
    let mystr = mykey.update(`${txt}`, 'utf8', 'hex')
    mystr += mykey.final('hex');
    encryText = mystr;
    fs.appendFile(`${timestamp}`, `${mystr} \n`, async function (err) {
        res.download(`${timestamp}`)
    });


});

app.post('/decrypt', async function (req, res) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
         
            let decrypt = req.files.decrypt;
            
            decrypt.mv('./files/' + decrypt.name);

        }
    } catch (err) {
        res.status(500).send(err);
    }

    let mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    let mystrDecry = mykey.update(`${encryText}`, 'hex', 'utf8')
    let nameDecry = `${timestamp}-decry.txt`
    mystrDecry += mykey.final('utf8');
    fs.appendFile(`files/${nameDecry}`, `${mystrDecry} \n`, function (err) {
        res.download(`files/${nameDecry}`)
    }); 

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

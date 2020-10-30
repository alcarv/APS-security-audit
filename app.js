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
    //console.log(textoCript)
    fs.appendFile(`${timestamp}`, `${mystr} \n`, async function (err) {
        //console.log(textoCript);
        //console.log('Encriptografado!');
        res.download(`${timestamp}`)
    });


});

app.post('/decrypt', async function (req, res) {
    let nomeArq
    let txtDes;
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let decrypt = req.files.decrypt;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            decrypt.mv('./files/' + decrypt.name);

           /* fs.readFile(`/files/${decrypt.name}`, 'utf8', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                nomeArq = decrypt.name;
                txtDes = data;
                console.log(nomeArq)
                console.log(txtDes)

              }); */

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

/*app.get('/download', function (req, res) {
    res.download('Crypt-Decrypt.txt')
})*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

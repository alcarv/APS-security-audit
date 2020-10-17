const crypto = require("crypto");
const fs = require('fs');
const readline = require("readline");
const { RIPEMD160 } = require("crypto-js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var texto;
var textoCript;

    rl.question("Qual texto deseja criptografar ? ", function (name) {
        texto = name;
         encrypt();
         console.log("Criptografado, pasta Textos arquivo Crypt-Decrypt")
        rl.question(" Quer descriptografar o texto do arquivo ? (SIM = 1 || NAO = 0)", function (flag) {
            if (flag == 1) {
                decrypt();
            } else if (flag == 0) {
                console.log("Ok, programa encerrado !")
            } else if (flag !== 0 || flag !== 1) {
                console.log("Não identificado, digite 1 ou 0 !!")

            }

        });
    });



    rl.on("close", function () {
        console.log("Programa encerrado.")
        process.exit(0);
    });

async function encrypt () {
    let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    let mystr = mykey.update(`${texto} \n`, 'utf8', 'hex')
    mystr += mykey.final('hex');
    textoCript = mystr
    //console.log(textoCript)
    fs.appendFile('textos/Crypt-Decrypt.txt', `${textoCript}`, function (err) {
        //console.log(textoCript);
        //console.log('Encriptografado!');

    });
}
async function decrypt() {
    let mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    let mystrDecry = mykey.update('ec417a8d3353edc3b8e518086e1fff33', 'hex', 'utf8')
    mystrDecry += mykey.final('utf8');
    fs.appendFile('textos/Crypt-Decrypt.txt', `\n ${texto} \n`, function (err) {
        if (err) throw err;
        console.log('Descriptografado!');
    });

}

//encrypt();
//decrypt();
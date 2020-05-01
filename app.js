const fs = require('fs');
const signer = require('node-signpdf');

const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/sign', (req, res) => {
  const pdfBuffer = fs.readFileSync(`${__dirname}/resources/unsigned/sample.pdf`);
  const p12Buffer = fs.readFileSync(`${__dirname}/resources/key/A1_DS_PF_senha11.pfx`);

  let pdfSigned = signer.sign(pdfBuffer, p12Buffer);

  fs.writeFile(`${__dirname}/resources/signed/`, pdfSigned, (err) => {console.log(err)});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

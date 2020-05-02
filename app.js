const fs = require('fs');
const {plainAddPlaceholder} = require('node-signpdf/dist/helpers');
const signer = require("node-signpdf").default;
const {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
} = require('pdf-lib');

const PDFArrayCustom = require('./helpers/PDFArrayCustom');

const express = require('express');
const app = express();

/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

app.get('/sign', (req, res) => {
  let pdfBuffer = fs.readFileSync(`${__dirname}/resources/unsigned/sample.pdf`);
  const p12Buffer = fs.readFileSync(`${__dirname}/resources/key/A1_DS_PF_senha11.pfx`);

  pdfBuffer = plainAddPlaceholder({
    pdfBuffer,
    reason: 'Assinado por Pedro.',
    signatureLength: 8000,
  });

  let pdfSigned = signer.sign(pdfBuffer, p12Buffer, {passphrase: 'oFnvgdP1234!'});

  fs.writeFileSync(`${__dirname}/resources/signed/pdf_assinado.pdf`, pdfSigned, (err) => {console.log(err)});

  res.send('PDF ASSINADO!');
  };
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

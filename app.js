const fs = require('fs');
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
  const pdfBuffer = fs.readFileSync(`${__dirname}/resources/unsigned/sample.pdf`);
  const p12Buffer = fs.readFileSync(`${__dirname}/resources/key/A1_DS_PF_senha11.pfx`);

  const SIGNATURE_LENGTH = 3322;

  const signFunction = async () => {
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const ByteRange = PDFArrayCustom.withContext(pdfDoc.context);
    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = pdfDoc.context.obj({
      Type: 'Sig',
      Filter: 'Adobe.PPKLite',
      SubFilter: 'adbe.pkcs7.detached',
      ByteRange,
      Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of('We need your signature for reasons...'),
      M: PDFString.fromDate(new Date()),
    });
    await pdfDoc.context.register(signatureDict);

    const modifiedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    let pdfSigned = signer.sign(modifiedPdfBuffer, p12Buffer, {
      passphrase: 'oFnvgdP1234!',
    });

    fs.writeFile(`${__dirname}/resources/signed/`, pdfSigned, (err) => {
      console.log(err)
    });
  };

  signFunction().then(console.log).catch((err) => {
    console.log(err);
  });
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

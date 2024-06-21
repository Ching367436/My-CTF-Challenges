const express = require('express');

const PORT = process.env.PORT || 36363;
const app = express();

app.use('/', express.static(__dirname + '/static'));

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})
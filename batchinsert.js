
const fs = require('fs');
const mongoose = require('mongoose');
const JSONStream = require('JSONStream');
const IonDoc = require('./models/IonModel');

mongoose.connect('mongodb://localhost:27017/ionenergy', { poolSize: 10000, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

let arrayOfDoc = [];
(function init(){
    db.on('open', () => {
        console.log('Connected to mongo server.\n');
        process.stdout.write('Processing.');
        const dataStreamFromFile = fs.createReadStream(`${__dirname}/THERM0001.json`);
        dataStreamFromFile.pipe(JSONStream.parse('*')).on('data', async (ionData) => {
            let doc = {
                ts: new Date(ionData.ts),
                month: new Date(ionData.ts).getUTCMonth(),
                year: new Date(ionData.ts).getUTCFullYear(),
                val: ionData.val
            };
            arrayOfDoc.push(doc);
            // console.log(arrayOfDoc)
            if (arrayOfDoc.length === 10000) {
                dataStreamFromFile.pause();
                await IonDoc.insertMany(arrayOfDoc);
                arrayOfDoc = [];
                process.stdout.write('.');
                dataStreamFromFile.resume();
            }
        });

        dataStreamFromFile.on('end', async () => {
            console.log(arrayOfDoc)
             await IonDoc.insertMany(arrayOfDoc); // left over data
            console.log('\nImport complete, closing connection...');
            db.close();
            process.exit(0);
        });
    });

    db.on('error', (err) => {
        console.error('MongoDB connection error: ', err);
        process.exit(-1);
    });

})()

const express = require('express');
const router = express.Router();
const IonDoc = require('../models/IonModel');

/* Ping route. */
router.get('/', (req, res, next) => {
  res.json({'server status ':'Ok'});
});

/* To fetch available Temperature */
router.get('/temp', (req, res, next) => {
  IonDoc.aggregate([{
    $group: {
      "_id": "$val"
    }
  }]).exec((err, temp) => {
    if (!err) {
      res.json(temp)
    } else {
      res.json(err)
    }
  });
});

/* To fetch availabel Year */
router.get('/year', (req, res, next) => {
  IonDoc.aggregate([{
    $group: {
      "_id": "$year"
    }
  }]).exec((err, year) => {
    if (!err) {
      res.json(year)
    } else {
      res.json(err)
    }
  });
});

/* To fetch data based on temperature for the given year*/
router.get('/filter/:year/:temp', (req, res, next) => {
  let year = parseInt(req.params.year);
  let temperature = parseInt(req.params.temp);

  IonDoc.aggregate([{
      $match: {
        "val": temperature,
        "year": year
      }
    },
    {
      $group: {
        "_id": {
          Month: "$month",
          Temperature: "$val"
        },
        count: {
          $sum: 1
        }
      }
    }
  ]).exec((err, filterData) => {
    if (!err) {
      res.json(filterData)
    } else {
      res.json(err)
    }
  });
})

/* To upload logs in mongodb */
router.post('/upload/logs', (req, res, next) => {
  console.log(req.body)
  res.send('uppload success')
});

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/admin/random', function (req, res, next) {

  // program to generate random strings

  // declare all characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  for (let index = 0; index < 500; index++) {
    const element = array[index];
  }

  console.log(generateString(5));
  res.send('respond with a resource');
});

module.exports = router;

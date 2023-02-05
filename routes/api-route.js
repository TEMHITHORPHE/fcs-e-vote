const router = require('express').Router();
const { collateVotes, resetDB } = require('../model/dbQueries');


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
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



router.get('/admin/votes', async function (req, res, next) {
  const collatedVotes = await collateVotes();
  return res.json(collatedVotes);
});


router.get('/admin/qwertyuiop/reset', async function () {
  await resetDB();
});















module.exports = router;

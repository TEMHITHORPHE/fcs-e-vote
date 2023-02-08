const router = require('express').Router();
const { client } = require('../model/db');
const { collateVotes } = require('../model/dbQueries');


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});




// localhost/api/v1/e-vote/admin/token/Bosso/300/append
// localhost/api/v1/e-vote/admin/token/GK/300/append
router.get('/admin/token/:campus/:count/:op', async function (req, res, next) {

  // program to generate random strings
  const count = parseInt(req.params.count, 10) ? parseInt(req.params.count) : 300;
  const op = req.params.op;


  const docs = [];

  if (req.params.campus === 'Bosso') {

    for (let i = 0; i < count; i++) {
      const code = generateString(8);
      docs.push({
        access_token: `BC${code}`,
        is_used: false,
        tag: 'election',
        campus: 'Bosso'
      });
    }

    await client.connect();
    const col = client.db('E-Vote').collection('access_codes');

    if (op === 'new') {
      console.log("INSERTING==============");
      await col.deleteMany({ campus: 'Bosso' });
      await col.insertMany(docs);
    }
    if (op === 'append') {
      await col.insertMany(docs);
    }
  }

  else if (req.params.campus === 'GK') {

    for (let i = 0; i < count; i++) {
      const code = generateString(8);
      docs.push({
        access_token: `GK${code}`,
        is_used: false,
        tag: 'election',
        campus: 'Gidan-Kwano'
      });

      await client.connect();
      const col = client.db('E-Vote').collection('access_codes');

      if (op === 'new') {
        await col.deleteMany({ campus: 'Gidan-Kwano' });
        await col.insertMany(docs);
      }
      if (op === 'append') {
        await col.insertMany(docs);
      }
    }

  }

  console.log("Random Generation: ", { status: 'success', campus: req.params.campus, operation: op });

  res.json({ status: 'success', campus: req.params.campus, operation: op })

});
const characters = '1234567890';
function generateString(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.trim();
}


router.get('/admin/votes', async function (req, res, next) {
  const collatedVotes = await collateVotes();
  return res.json(collatedVotes);
});


// localhost/api/v1/e-vote/admin/qwertyuiop/reset
router.get('/admin/qwertyuiop/reset', async function () {
  await resetDB();
});
async function resetDB() {

  await client.connect();

  const db = client.db('E-Vote');

  await db.collection('access_codes').updateMany({ is_used: true }, { $set: { is_used: false } });

  await db.collection('votes').deleteMany({});

}


module.exports = router;

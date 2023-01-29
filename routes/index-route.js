const router = require('express').Router();
module.exports = router;

const { supabase } = require('../model/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("REQ-[GET]-[/] : ", req.headers['user-agent']);
  res.render('index', { title: 'Home Page' });
});


// @route '/'
router.post('/', async function (req, res, next) {
  console.log("REQ-[POST]-[/] : ", req.body);
  if (req.session.isNew) {

    let { data: AccessCodes, error } = await supabase
      .from('AccessCodes')
      .select('is_used')
      console.log('AccessCodes: ', AccessCodes);
      if (AccessCodes)
    // req.session.access_code = 'qwertyuiop';
  }
  res.render('index', { title: 'Home Page' });
});
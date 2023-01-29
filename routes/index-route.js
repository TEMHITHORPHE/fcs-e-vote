const router = require('express').Router();
module.exports = router;

const { supabase } = require('../model/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("REQ-[GET]-[/] : ", req.headers['user-agent']);
  return res.render('index', { title: 'Home Page', page_alerts: "null" });
});


// @route '/'
router.post('/', async function (req, res, next) {
  console.log("REQ-[POST]-[/] : ", req.body);
  if (req.body && req.body.codebox) {

    let { data: AccessCodes, error } = await supabase
      .from('AccessCodes')
      .select('is_used')
      .eq('tag', process.env.E_VOTE_TAG)
      .eq('access_code', req.body.codebox).single();

    console.log('access_code: ', AccessCodes);

    if (AccessCodes || AccessCodes.is_used) {
      return res.render('index', {
        title: 'Home Page', page_alerts: [{ type: 'error', message: 'Error!... Access Code Invalid' }]
      });
    }

  }
  return res.render('index', { title: 'Home Page'});
});
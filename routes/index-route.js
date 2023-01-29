const router = require('express').Router();
module.exports = router;

const { supabase } = require('../model/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("REQ-[GET]-[/] : ", req.headers['user-agent']);
  console.log("REQ-[GET]-[/] : ", req.session);
  return res.render('index', { title: 'Home Page' });
});


// @route '/'
router.post('/', async function (req, res, next) {
  console.log("REQ-[POST]-[/] : ", req.body);
  if (req.body && req.body.codebox) {

    let { data: AccessCodes, error } = await supabase
      .from('AccessCodes')
      .select('access_code, is_used, tag')
      .eq('tag', process.env.E_VOTE_TAG)
      .eq('access_code', req.body.codebox).single();

    console.log('access_code: ', AccessCodes);

    if (AccessCodes && AccessCodes.is_used === false) {
      // Set up entity session
      const entity = {
        access_code: AccessCodes.access_code,
        tag: AccessCodes.tag,
        nominations: {}
      }
      req.session.entity = entity;

      const { error } = await supabase
        .from('AccessCodes')
        .update({ is_used: true })
        .eq('access_code', AccessCodes.access_code)
        .select();

      if (error) return res.render('index', Errors.unexpected);
      res.render('index', {
        title: 'Home Page', page_alerts: [{ type: 'success', message: 'Hooray! ... Access code valid!' }]
      });
    }
    else if (AccessCodes === null || AccessCodes.is_used) {
      return res.render('index', Errors.invalid);
    }
    else if (error) {
      return res.render('index', Errors.unexpected);
    }
  }
});


const Errors = {
  unexpected: {
    title: 'Home Page', page_alerts: [{ type: 'error', message: 'Error!... An unexpected error occurred' }]
  },
  invalid: {
    title: 'Home Page', page_alerts: [{ type: 'error', message: 'Error!... Access code not valid' }]
  },

}
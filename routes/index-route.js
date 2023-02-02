const router = require('express').Router();
module.exports = router;

const { supabase } = require('../model/db');
const { nominators } = require('../model/dbQueries');

const election_link = process.env.ELECTION_LINK;

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log("REQ-[GET]-[/] : ", req.headers['user-agent']);
  console.log("REQ-[GET]-[/] : ", req.session);

  if (req.session.isNew || !req.session.isPopulated) return res.render('index', { title: 'Home Page' });
  return res.render('index', {
    title: 'Home Page',
    next_page: "/election/nomination",
  })
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

    console.log('AccessCodes: ', AccessCodes);

    if (AccessCodes && AccessCodes.is_used === false) {

      const entity = {
        access_code: AccessCodes.access_code,
        tag: AccessCodes.tag,
        nominations: {}
      }

      let { data, error } = await supabase
        .rpc('initialize_access_code', {
          voting_access_code: AccessCodes.access_code
        });

      // if (error) console.error(error);
      console.log("[index-route.js] - [Initialized-Access-Code-Error] : ", error);

      if (error) return res.render('index', { ...Errors.unexpected, next_page: req.session.entity ? election_link : null });

      nominators.addNominator(AccessCodes.access_code);
      req.session.entity = entity;

      res.render('index', {
        title: 'Home Page',
        page_alerts: [{ type: 'success', message: 'Hooray! ... Access code valid!' }],
        next_page: election_link,
        voting_entity: JSON.stringify(entity)
      });

    }
    else if (AccessCodes === null || AccessCodes.is_used) {
      return res.render('index', { ...Errors.invalid, next_page: req.session.entity ? election_link : null });
    }
    else if (error) {
      return res.render('index', { ...Errors.unexpected, next_page: req.session.entity ? election_link : null });
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

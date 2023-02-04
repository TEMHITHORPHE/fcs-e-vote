const router = require('express').Router();
module.exports = router;

const { supabase } = require('../model/db');
const { nominators, isAccessCodeValid } = require('../model/dbQueries');

const election_link = process.env.ELECTION_LINK;
const voting_stage = process.env.E_VOTE_TAG;

/* GET home page. */
router.get('/', function (req, res, next) {
  if (voting_stage === 'election') {
    return Election(req, res, 'GET');
  }
  else if (voting_stage === 'nomination') {
    return Nomination(req, res, 'GET');
  }
  else {
    return Election(req, res, 'GET');
  }
});


// @route '/'
router.post('/', async function (req, res, next) {
  if (voting_stage === 'election') {
    return Election(req, res, 'POST');
  }
  else if (voting_stage === 'nomination') {
    return Nomination(req, res, 'POST');
  }
  else {
    return Election(req, res, 'POST');
  }
});



async function Election(req, res, method) {

  if (method === 'POST') {

    console.log("REQ-[POST]-[/] : ", req.body);
    if (req.body && req.body.codebox) {

      const AccessCodes = await isAccessCodeValid(req.body.codebox);

      console.log('AccessCodes: ', AccessCodes);

      if (AccessCodes) {

        delete AccessCodes.is_used;
        const entity = { ...AccessCodes, votes:{} };

        nominators.addNominator(AccessCodes.access_token);
        req.session.entity = entity;

        return res.render('index', {
          title: 'Home Page',
          page_alerts: [{ type: 'success', message: 'Hooray! ... Access code valid!' }],
          next_page: election_link,
          voting_entity: JSON.stringify(entity)
        });

      }
      else {
        return res.render('index', { ...Errors.invalid, next_page: req.session.entity ? election_link : null });
      }
    }
    return res.render('index', { ...Errors.invalid, next_page: req.session.entity ? election_link : null });
  }

  // GET
  else if (method === 'GET') {
    console.log("REQ-[GET]-[/] : ", req.session);

    if (req.session.isNew || !req.session.isPopulated) return res.render('index', { title: 'Home Page' });
    return res.render('index', {
      title: 'Home Page',
      next_page: election_link || '/election/election',
    })
  }
}





















async function Nomination(req, res, method) {

  // GET
  if (method === 'GET') {
    console.log("REQ-[GET]-[/] : ", req.session);

    if (req.session.isNew || !req.session.isPopulated) return res.render('index', { title: 'Home Page' });
    return res.render('index', {
      title: 'Home Page',
      next_page: "/election/nomination",
    })
  }

  // POST
  else if (method === 'POST') {

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
  }
}

const Errors = {
  unexpected: {
    title: 'Home Page', page_alerts: [{ type: 'error', message: 'Error!... An unexpected error occurred' }]
  },
  invalid: {
    title: 'Home Page', page_alerts: [{ type: 'error', message: 'Error!... Access code not valid' }]
  }
}
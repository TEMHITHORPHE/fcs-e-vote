const router = require('express').Router();
module.exports = router;


const { SessionHandler } = require('../utillities/session');

router.use(SessionHandler);

const page_js = ['<script src="/js/nomination.js" type="text/javascript" async=false defer=false></script>'];


let { member_data_by_units, member_data } = require('../mock');
const { supabase } = require('../model/db');
const { nominators, getNominators, members, members_data_by_units } = require('../model/dbQueries');


const units = ["prayer_unit", "ushering_unit", "designers_unit", "evangelism_unit", "maintenance_unit", "bible_study_unit_icu", "press_unit", "organizing_unit", "drama_unit_idm", "music_unit_tlv"];

/* GET home page. */
router.get('/nomination', async function (req, res, next) {

  if (!nominators.bootstrapped) {
    const _nominators = await getNominators();
    nominators.batchAddNominators(_nominators);
  }

  console.log("REQ-[GET]-[/election/nomination] : ", req.ip);

  const fcs_members = await members();

  // const units = Object.keys(members_data_by_units);
  // console.log("UNITS: ", units);

  res.render('nomination', {
    title: 'Nominees Page',
    js_scripts: page_js,
    units: units,
    nomination_form_data: fcs_members,
    unit_records: members_data_by_units
  });
});


router.post('/nomination/signout', async function (req, res) {
  const entity = req.session.entity;
  if (entity) {
    console.log("LogOut: ", entity);
    req.session = null;
    return res.redirect('/?signout=true');
    // return res.json({ status: 200, reset: true });
  }
});


router.post('/nomination/:unit_id', async function (req, res, next) {
  const req_body = req.body;
  const unit_id = req.params.unit_id;
  const access_code = req.session.entity.access_code;
  console.log("REQ-[POST]-[/election/nomination] : ", unit_id, req_body);
  // console.log("UNITS: ", units);


  // Make sure Unit exists and that number of nominees does not exceed the maximum.
  if (!units.includes(unit_id) || req_body.length.toString() !== process.env.NOMINEES_PER_UNIT) return res.send({ status: 400, message: 'Unit not recognized' });

  // Create a modified entity session
  const entity = {
    ...req.session.entity,
    nominations: {
      ...req.session.entity.nominations,
      [unit_id]: req_body
    }
  }
  const { data, error } = await supabase.from('nominees_').update({
    [unit_id]: req_body
  })
    .eq('nominator', access_code).select();

  // console.log("Updated: ", data);
  if (error) return res.send({ status: 400, message: error.message });

  // Update session
  req.session.entity = entity;

  console.log("REQ-[POST]-[/election/nomination] [New-Session]: ", req.session.entity);

  return res.json({ status: 200, message: 'Nomination Recorded!', voting_entity: entity });

});




  // app.use('/election', votingRouter);
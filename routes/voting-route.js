const router = require('express').Router();
module.exports = router;


const { SessionHandler } = require('../utillities/session');

router.use(SessionHandler);

const page_js = ['<script src="/js/nomination.js" type="text/javascript" async=false defer=false></script>'];

// const units = [
//   "Evangelism Unit",
//   "Press Unit",
//   "Ushering Unit",
//   "Designers Unit",
//   "Bible Study Unit (ICU)",
//   "Maintenance Unit",
//   "Drama Unit (IDM)",
//   "Prayer Unit",
//   "Music Unit (TLV)"
// ];

let { member_data_by_units, member_data } = require('../mock');
// Stringify can be done here or in the .liquid file using {{ member_data_by_units | json }}
// member_data_by_units = JSON.stringify(member_data_by_units);

const units = Object.keys(member_data_by_units);

/* GET home page. */
router.get('/nomination', function (req, res, next) {
  console.log("REQ-[GET]-[/election/nomination] : ", req.session);
  res.render('nomination', {
    title: 'Nominees Page',
    js_scripts: page_js,
    units: units,
    nomination_form_data: member_data,
    unit_records: member_data_by_units
  });
});


router.post('/nomination/:unit_id', function (req, res, next) {
  const req_body = req.body;
  const unit_id = req.params.unit_id;

  console.log("REQ-[POST]-[/election/nomination] : ", unit_id, req_body);
  // Make sure Unit exists and that number of nominees does not exceed the maximum.
  if (!units.includes(unit_id) || req.body.length.toString() !== process.env.NOMINEES_PER_UNIT) return res.send({ status: 400, message: 'Unit not recognized' });

      // Modify entity session
      const entity = {
        access_code: AccessCodes.access_code,
        tag: AccessCodes.tag,
        nominations: {}
      }
      req.session.entity = entity;

  return res.json({ status: 200, message: 'success' });


});

  // app.use('/election', votingRouter);
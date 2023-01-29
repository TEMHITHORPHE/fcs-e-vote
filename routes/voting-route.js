const router = require('express').Router();
module.exports = router;


const { SessionHandler } = require('../utillities/session');

router.use(SessionHandler);


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
    console.log("REQ-[GET]-[/election/nomination] : ", req.headers['user-agent']);
    res.render('nomination', {
      title: 'Nominees Page', units: units, nomination_form_data: member_data, unit_records: member_data_by_units
    });
  });
  
  router.post('/nomination', function(req, res, next) {
    console.log("REQ-[POST]-[/election/nomination] : ", req.body);
  })
  
  // app.use('/election', votingRouter);
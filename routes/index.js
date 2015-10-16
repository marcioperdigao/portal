var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { titlee: 'Take A Time But Never Relax',logged:false });
});

module.exports = router;
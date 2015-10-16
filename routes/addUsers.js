var express = require('express');
var router = express.Router();


/* GET users listing. */
exports.list=function(req,res){
  req.connect(function(err,connection))
}
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

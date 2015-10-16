var fs=require('fs');
var path=__dirname+"/country/country.json";
var countryList="";

var getCountryList=fs.readFileSync(path,"utf8",function(err,data){
    if(err) console.log("read error: "+error.message);
    else return data;
});
countryList=getCountryList;

module.exports=countryList;

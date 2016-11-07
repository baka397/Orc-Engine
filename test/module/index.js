//Orc Module Test Case
'use strict';
const base=require('./base'); //Module Base function
const register=require('./register'); //Module register
const profile=require('./profile'); //Module profile
const item=require('./item'); //Module item
module.exports=function(orcClient){
    describe('Module',()=>{
        base(orcClient);
        register(orcClient);
        profile(orcClient);
        item(orcClient);
    })
}
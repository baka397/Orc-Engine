//Orc Strategy Test Case
'use strict';
const base=require('./base'); //Strategy Base function
const register=require('./register'); //Strategy register
module.exports=function(orcClient){
    describe('Strategy',()=>{
        base(orcClient);
        register(orcClient);
    })
}
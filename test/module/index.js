//Orc Module Test
'use strict';
const base=require('./base'); //Module Base function
module.exports=function(orcClient){
    describe('Module',()=>{
        base(orcClient);
    })
}
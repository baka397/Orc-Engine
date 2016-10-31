//Orc Middleware Test
'use strict';
const base=require('./base'); //Middleware Base function
const use=require('./use'); //Middleware Use
module.exports=function(orcClient){
    describe('Middleware',()=>{
        base(orcClient);
        use(orcClient);
    })
}
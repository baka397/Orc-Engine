//Orc Middleware Test
'use strict';
const should = require('should');
function testConstructor(){
    this.option='test';
}
module.exports=function(orcClient){
    describe('Register module', ()=>{
        it('Register', done=>{
            orcClient.regModule('testModule',testConstructor);
            done(!orcClient.getTestModule);
        })
        it('Module props', done=>{
            let testModule=orcClient.getTestModule;
            done(!(testModule.option==='test'&&testModule.name==='testModule'&&testModule.orcClient===orcClient));
        })
        it('Register with Wrong Module Name', done=>{
            orcClient.once('error',(err)=>{
                done(!err);
            })
            orcClient.regModule('test module',testConstructor);
        })
    })
}
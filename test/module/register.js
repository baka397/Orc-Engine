//Orc Module register Test
'use strict';
const tool = require('../tool');
const should = require('should');
const Orc = require('../../index');
function testConstructor(){
    this.option='test';
}
module.exports=function(orcClient){
    let orcTestModule2=new Orc({
        name:'orcTestModule2'
    });
    describe('Register module', ()=>{
        it('Register', done=>{
            orcTestModule2.regModule([],'testModule',testConstructor);
            done(!orcTestModule2.getTestModule);
        })
        it('Module props', done=>{
            let testModule=orcTestModule2.getTestModule;
            done(!(testModule.option==='test'&&testModule.fullName==='orcTestModule2:testModule'&&testModule.orcClient===orcTestModule2));
        })
        //Error test
        it('Register with Wrong Module Name', done=>{
            orcTestModule2.once('error',(e)=>{
                done(!e);
                console.log('message:',e.message);
            })
            orcTestModule2.regModule([],'test module',testConstructor);
        })
    })
}
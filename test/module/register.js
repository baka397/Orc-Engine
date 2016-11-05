//Orc Middleware Test
'use strict';
const tool = require('../tool');
const should = require('should');
const clearModules=require('../../lib/module/base').clear; //Middleware Task
function testConstructor(){
    this.option='test';
}
module.exports=function(orcClient){
    describe('Register module', ()=>{
        it('Register', done=>{
            orcClient.regModule([],'testModule',testConstructor);
            done(!orcClient.getTestModule);
        })
        it('Module props', done=>{
            let testModule=orcClient.getTestModule;
            done(!(testModule.option==='test'&&testModule.name==='testModule'&&testModule.orcClient===orcClient));
        })
        it('Register with Wrong Module Name', done=>{
            orcClient.once('error',(e)=>{
                done(!e);
                console.log('message:',e.message);
            })
            orcClient.regModule([],'test module',testConstructor);
        })
    })
}
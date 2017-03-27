//Orc Strategy register Test
'use strict';
const tool = require('../tool');
const should = require('should');
const Orc = require('../../index');
function testConstructor(){
    this.option='test';
}
module.exports=function(orcClient){
    let orcTestStrategy2=new Orc({
        name:'orcTestStrategy2'
    });
    describe('Register module', ()=>{
        it('Register', done=>{
            orcTestStrategy2.regStrategy([],'testStrategy',testConstructor);
            done(!orcTestStrategy2.getTestStrategy);
        })
        it('Strategy props', done=>{
            let testStrategy=orcTestStrategy2.getTestStrategy;
            done(!(testStrategy.option==='test'&&testStrategy.fullName==='orcTestStrategy2:testStrategy'&&testStrategy.orcClient===orcTestStrategy2));
        })
        //Error test
        it('Register with Wrong Strategy Name', done=>{
            orcTestStrategy2.once('error',(e)=>{
                done(!e);
                console.log('message:',e.message);
            })
            orcTestStrategy2.regStrategy([],'test strategy',testConstructor);
        })
    })
}
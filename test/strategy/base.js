//Orc Strategy Base Test
'use strict';
const tool = require('../tool');
const Orc = require('../../index');
const createModule=require('../../lib/module/base').create; //Module Task
const createStrategy=require('../../lib/strategy/base').create; //Strategy Task
function testConstructor(){
    this.option='test';
}
function testConstructorInit(){
    this.init=function(){
        this.optionTest='test';
    }
}
module.exports=function(orcClient){
    let resultModule;
    let resultStrategy;
    let testStrategy2;
    let orcTestStrategy=new Orc({
        name:'orcTestStrategy'
    });
    describe('Base function', ()=>{
        describe('Create a strategy', ()=>{
            it('Prepare a module', done=>{
                resultModule=createModule(orcTestStrategy,[],'testModule',testConstructor);
                done(!(resultModule.option==='test'&&resultModule.orcClient===orcTestStrategy&&resultModule.name==='testModule'&&resultModule.depends.length===0));
            })
            it('Create', done=>{
                resultStrategy=createStrategy(orcTestStrategy,[],'testStrategy',testConstructor);
                done(!(resultStrategy.option==='test'&&resultStrategy.orcClient===orcTestStrategy&&resultStrategy.name==='testStrategy'&&resultStrategy.depends.length===0));
            });
            it('Get config', done=>{
                done(resultStrategy.getConfig().name!=='orcTestStrategy');
            })
            it('Get tool', done=>{
                done(resultStrategy.getTools()!==orcTestStrategy.orcTools);
            })
            it('Emit module message', done=>{
                orcTestStrategy.once('info',(info)=>{
                    done(info!=='test info');
                })
                resultStrategy.emit('info','test info');
            })
            it('Create with depend module', done=>{
                testStrategy2=createStrategy(orcTestStrategy,['testModule'],'testOtherStrategy',testConstructor);
                done(testStrategy2.depends[0]!=='testModule');
            })
            it('Create with init function', done=>{
                resultStrategy=createStrategy(orcTestStrategy,[],'testStrategyInit',testConstructorInit);
                done(!(resultStrategy.optionTest==='test'&&resultStrategy.orcClient===orcTestStrategy&&resultStrategy.name==='testStrategyInit'&&resultStrategy.depends.length===0));
            });
            it('Get Module', done=>{
                let testModule=testStrategy2.getDependModule('testModule');
                done(testModule!==resultModule);
            })
            it('Create same strategy', done=>{
                try{
                    let result=createStrategy(orcTestStrategy,[],'testStrategy',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            //Error test
            it('Wrong strategy name', done=>{
                try{
                    let result=createStrategy(orcTestStrategy,[],'test Strategy',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Wrong depend module name', done=>{
                try{
                    let result=createStrategy(orcTestStrategy,['test name'],'testStrategy3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Not exsit depend module name', done=>{
                try{
                    let result=createStrategy(orcTestStrategy,['testModuleInfo'],'testStrategy3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Get Module with empty name', done=>{
                orcTestStrategy.once('error',(e)=>{
                    done(!e);
                    console.log('message:',e.message);
                })
                let testModule=testStrategy2.getDependModule();
            })
            it('Get Module with wrong dependent module name', done=>{
                orcTestStrategy.once('error',(e)=>{
                    done(!e);
                    console.log('message:',e.message);
                })
                let testModule=testStrategy2.getDependModule('profile');
            })
        })
    })
}
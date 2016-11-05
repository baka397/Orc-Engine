//Orc Middleware Test
'use strict';
const tool = require('../tool');
const should = require('should');
const createModule=require('../../lib/module/base').create; //Middleware Task
const clearModules=require('../../lib/module/base').clear; //Middleware Task
function testConstructor(){
    this.option='test';
}
let resultModule;
module.exports=function(orcClient){
    describe('Base function', ()=>{
        describe('Create a module', ()=>{
            it('Create', done=>{
                resultModule=createModule(orcClient,[],'testModule',testConstructor);
                // done(!(resultModule.option==='test'&&resultModule.orcClient===orcClient&&resultModule.name==='testModule'));
                done();
            })
            it('Get redis key', done=>{
                done(resultModule.getRedisKey('test')!=='orc:testModule:test');
            })
            it('Get redis Client', done=>{
                done(resultModule.getRedisClient()!==orcClient.redis);
            })
            it('Get Middlewares', done=>{
                let middlewareArray=resultModule.getMiddlewares();
                done(!middlewareArray);
            })
            it('Emit module message', done=>{
                orcClient.on('info',(info)=>{
                    done(info!=='test info');
                })
                resultModule.emit('info','test info');
            })
            it('Add with depend module', done=>{
                let testModule2=createModule(orcClient,['testModule'],'testOtherModule',testConstructor);
                done();
            })
            it('Create same module', done=>{
                try{
                    let result=createModule(orcClient,[],'testModule',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Wrong module name', done=>{
                try{
                    let result=createModule(orcClient,[],'test Module',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Wrong depend name', done=>{
                try{
                    let result=createModule(orcClient,['test name'],'testModule3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Not exsit depend name', done=>{
                try{
                    let result=createModule(orcClient,['testModuleInfo'],'testModule3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Clear', done=>{
                done(clearModules().size!==0);
            })
        })
    })
}
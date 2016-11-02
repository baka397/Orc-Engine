//Orc Middleware Test
'use strict';
const should = require('should');
const createModule=require('../../lib/module/base').create; //Middleware Task
function testConstructor(){
    this.option='test';
}
let resultModule;
module.exports=function(orcClient){
    describe('Base function', ()=>{
        describe('Create a module', ()=>{
            it('Create', done=>{
                resultModule=createModule(orcClient,'testModule',testConstructor);
                // done(!(resultModule.option==='test'&&resultModule.orcClient===orcClient&&resultModule.name==='testModule'));
                done();
            })
            it('Create same module', done=>{
                let result=createModule(orcClient,'testModule',testConstructor);
                done(!(result===resultModule));
            })
            it('Get redis key', done=>{
                done(resultModule.getRedisKey('test')!=='orc:testModule:test');
            })
            it('Get redis Client', done=>{
                done(resultModule.getRedisClient()!==orcClient.redis);
            })
            it('Get Middlewares', done=>{
                let middlewareArray=resultModule.getMiddlewares();
                done(!(Array.isArray(middlewareArray)&&middlewareArray.length===0));
            })
            it('Emit module message', done=>{
                orcClient.on('info',(info)=>{
                    done(info!=='test info');
                })
                resultModule.emit('info','test info');
            });
            it('Wrong module name', done=>{
                try{
                    let result=createModule(orcClient,'test Module',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                }
            })
        })
    })
}
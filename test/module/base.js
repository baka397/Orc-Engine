//Orc Middleware Test
'use strict';
const should = require('should');
const createModule=require('../../lib/module/base').create; //Middleware Task
const clearModules=require('../../lib/module/base').clear; //Middleware Task
function testConstructor(){
    this.option='test';
}
let resultModule;
function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}
module.exports=function(orcClient){
    describe('Base function', ()=>{
        describe('Create a module', ()=>{
            it('Create', done=>{
                resultModule=createModule(orcClient,[],'testModule',testConstructor);
                // done(!(resultModule.option==='test'&&resultModule.orcClient===orcClient&&resultModule.name==='testModule'));
                done();
            })
            it('Create same module', done=>{
                let result=createModule(orcClient,[],'testModule',testConstructor);
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
            })
            it('Add with depend module', done=>{
                let testModule2=createModule(orcClient,['testModule'],'testOtherModule',testConstructor);
                done();
            })
            it('Wrong module name', done=>{
                try{
                    let result=createModule(orcClient,[],'test Module',testConstructor);
                    done('Should not over here');
                }catch(e){
                    console.log(e);
                    done()
                }
            })
            it('Wrong depend name', done=>{
                try{
                    let result=createModule(orcClient,['test name'],'testModule3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    console.log(e);
                    done()
                }
            })
            it('Not exsit depend name', done=>{
                try{
                    let result=createModule(orcClient,['testModuleInfo'],'testModule3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    console.log(e);
                    done()
                }
            })
            it('Clear', done=>{
                done(!isEmpty(clearModules()));
            })
        })
    })
}
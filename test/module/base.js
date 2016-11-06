//Orc Middleware Test
'use strict';
const tool = require('../tool');
const should = require('should');
const Orc = require('../../index');
const createModule=require('../../lib/module/base').create; //Middleware Task
const clearModules=require('../../lib/module/base').clear; //Middleware Task
function testConstructor(){
    this.option='test';
}
module.exports=function(orcClient){
    let resultModule;
    let orcTestModule=new Orc({
        name:'orcTestModule'
    });
    describe('Base function', ()=>{
        describe('Create a module', ()=>{
            it('Create', done=>{
                resultModule=createModule(orcTestModule,[],'testModule',testConstructor);
                done(!(resultModule.option==='test'&&resultModule.orcClient===orcTestModule&&resultModule.name==='testModule'&&resultModule.depends.length===0));
            })
            it('Get redis key', done=>{
                done(resultModule.getRedisKey('test')!=='orcTestModule:testModule:test');
            })
            it('Get redis Client', done=>{
                done(resultModule.getRedisClient()!==orcTestModule.redis);
            })
            it('Get Middlewares', done=>{
                let middlewarePromise=resultModule.getMiddlewares();
                done(!middlewarePromise);
            })
            it('Use Middleware', done=>{
                let middlewareFunc=function(data,next){
                    data.test=1;
                    next();
                }
                resultModule.use(middlewareFunc);
                let middlewarePromise=resultModule.getMiddlewares({'test':'test'});
                middlewarePromise.then(data=>{
                    done(data.test!==1)
                }).catch(e=>{
                    done(e);
                })
            })
            it('Use Middleware without default name', done=>{
                let middlewareFunc2=function(data,next){
                    data.test=2;
                    next();
                }
                resultModule.use('testMiddleware',middlewareFunc2);
                let middlewarePromise=resultModule.getMiddlewares('testMiddleware',{'test':'test'});
                middlewarePromise.then(data=>{
                    done(data.test!==2)
                }).catch(e=>{
                    done(e);
                })
            })
            it('Emit module message', done=>{
                orcTestModule.on('info',(info)=>{
                    done(info!=='test info');
                })
                resultModule.emit('info','test info');
            })
            it('Add with depend module', done=>{
                let testModule2=createModule(orcTestModule,['testModule'],'testOtherModule',testConstructor);
                done(testModule2.depends[0]!=='testModule');
            })
            it('Create same module', done=>{
                try{
                    let result=createModule(orcTestModule,[],'testModule',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Wrong module name', done=>{
                try{
                    let result=createModule(orcTestModule,[],'test Module',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Wrong depend name', done=>{
                try{
                    let result=createModule(orcTestModule,['test name'],'testModule3',testConstructor);
                    done('Should not over here');
                }catch(e){
                    done()
                    console.log('message:',e.message);
                }
            })
            it('Not exsit depend name', done=>{
                try{
                    let result=createModule(orcTestModule,['testModuleInfo'],'testModule3',testConstructor);
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
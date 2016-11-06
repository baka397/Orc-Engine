//Orc Middleware Test
'use strict';
const should = require('should');
const Orc = require('../../index');
module.exports=function(orcClient){
    let orcTestMiddleware=new Orc({
        name:'orcTestMiddleware'
    });
    describe('Use method', ()=>{
        describe('Middleware Task Promise Object', ()=>{
            it('Default middleware list', done=>{
                done(!(Array.isArray(orcTestMiddleware._middleware.profile)&&Array.isArray(orcTestMiddleware._middleware.ranking)))
            })
            it('Use middleware', done=>{
                let testFunc=function(datas,next){
                    next();
                }
                orcTestMiddleware.use('profile',testFunc);//profile
                orcTestMiddleware.use('ranking',testFunc);//ranking
                orcTestMiddleware.use('testRec',testFunc);//Test Rec
                done(!(orcTestMiddleware._middleware.profile[1]===testFunc&&orcTestMiddleware._middleware.ranking[0]===testFunc&&orcTestMiddleware._middleware.testRec[0]===testFunc))
            })
            it('Use wrong middleware name',done=>{
                let testFunc2=function(datas,next){
                    datas.test='2';
                    next();
                }
                try{
                    orcTestMiddleware.use('pro test',testFunc2);
                    done('Should not over here');
                }catch(e){
                    done();
                    console.log('message:',e.message);
                }
            })
            it('Use wrong middleware function',done=>{
                try{
                    orcTestMiddleware.use('pro test',null);
                    done('Should not over here');
                }catch(e){
                    done();
                    console.log('message:',e.message);
                }
            })
        })
    })
}
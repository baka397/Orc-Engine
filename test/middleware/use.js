//Orc Middleware Test
'use strict';
const should = require('should');
module.exports=function(orcClient){
    describe('Use method', ()=>{
        describe('Middleware Task Promise Object', ()=>{
            it('Default middleware list', done=>{
                done(!(Array.isArray(orcClient._middleware.profile)&&Array.isArray(orcClient._middleware.ranking)))
            })
            it('Use middleware', done=>{
                let testFunc=function(datas,next){
                    console.log(datas);
                    next();
                }
                orcClient.use('profile',testFunc);//profile
                orcClient.use('ranking',testFunc);//ranking
                orcClient.use('testRec',testFunc);//Test Rec
                done(!(orcClient._middleware.profile[0]===testFunc&&orcClient._middleware.ranking[0]===testFunc&&orcClient._middleware.testRec[0]===testFunc))
            })
            it('Use wrong middleware name',done=>{
                let testFunc2=function(datas,next){
                    datas.test='2';
                    next();
                }
                try{
                    orcClient.use('pro test',testFunc2);
                    done('Should not over here');
                }catch(e){
                    done();
                }
            })
            it('Use wrong middleware function',done=>{
                try{
                    orcClient.use('pro test',null);
                    done('Should not over here');
                }catch(e){
                    done();
                }
            })
            it('Clear middlewares', done=>{
                orcClient._middleware={};
                done();
            })
        })
    })
}
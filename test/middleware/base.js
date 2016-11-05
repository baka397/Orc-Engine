//Orc Middleware Test
'use strict';
const should = require('should');
const middlewareTask=require('../../lib/middleware/base').task; //Middleware Task

module.exports=function(orcClient){
    describe('Base function', ()=>{
        describe('Middleware Task Promise Object', ()=>{
            it('Create without middleware', done=>{
                middlewareTask({'middleware':'test string'},[]).then(output=>{
                    done(output.middleware!=='test string');
                }).catch(err=>{
                    done(err);
                })
            })
            it('Create with middlewares', done=>{
                let middlewares=[];
                //Sync function
                middlewares.push(function(input,next){
                    input.name='test name';
                    next();
                });
                //Async function
                middlewares.push(function(input,next){
                    setTimeout(function(){
                        input.age='test age';
                        next();
                    },100);
                });
                middlewareTask({'middleware':'test string'},middlewares).then(output=>{
                    done(output.name!=='test name'||output.age!=='test age');
                }).catch(err=>{
                    done(err);
                })
            })
            it('Create with error function',done=>{
                let middlewares=[];
                //Error function
                middlewares.push(function(input,next){
                    let error = new Error('This is a error message');
                    next(error);
                });
                middlewareTask({'middleware':'test string'},middlewares).then(output=>{
                    done('Error function is unavailable');
                }).catch(err=>{
                    done(err.message!=='This is a error message');
                })
            })
        })
    })
}
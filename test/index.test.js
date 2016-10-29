'use strict';
const should = require('should');
const Orc=require('../index');

let orcClient=new Orc();
orcClient.redis.on('error',function(err){
    console.log(err);
})

describe('Orc create', ()=>{
    describe('Redis client Test', ()=>{
        it('Create', done=>{
            if(orcClient.redis) done()
            else done('Orc failed to create Redis client');
        });
        it('Set key', done=>{
            orcClient.redis.set('Orc:test', 'test key').then(result=>{
                done();
            }).catch(err=>done);
        });
        it('Get key',done=>{
            orcClient.redis.get('Orc:test').then(result=>{
                if(result==='test key'){
                    done();
                }else{
                    done('Wrong key');
                }
            }).catch(err=>done);
        })
        it('Flush',done=>{
            orcClient.redis.flushdb().then(result=>{
                done();
            }).catch(err=>done);
        })
    })
    describe('Config Test', ()=>{
        it('Name', ()=>{
            orcClient.config.should.have.property('name', 'orc');
        })
        it('Ranking Cache Time', ()=>{
            orcClient.config.should.have.property('rankingCache', 1);
        })
        it('Result Cache Time', ()=>{
            orcClient.config.should.have.property('resultCache', 1);
        })
    });
});
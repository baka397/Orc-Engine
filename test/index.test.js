//Orc Base Test
'use strict';
const should = require('should');
const Orc = require('../index');
//Load test case
const middlewareTest = require('./middleware/');
const moduleTest = require('./module/');

let orcClient=new Orc();
describe('Orc create', ()=>{
    describe('Redis client Test', ()=>{
        it('Create', done=>{
            if(orcClient.redis) done()
            else done('Orc failed to create Redis client');
        })
        it('Set key', ()=>{
            return orcClient.redis.set('Orc:test', 'test key')
        })
        it('Get key',()=>{
            return orcClient.redis.get('Orc:test');
        })
        it('Wrong redis client', done=>{
            let orcClient2=new Orc({
                redis:{
                    port: 6379,
                    host: '127.0.0.1'
                }
            })
            orcClient2.redis.on('ready',()=>{
                done();
            })
        })
        it('Another default redis client', done=>{
            let orcClient3=new Orc();
            done(orcClient3.redis!==orcClient.redis);
        });
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
    })
    describe('Config Error', ()=>{
        it('Name', done=>{
            try{
                new Orc({
                    name:'test name'
                })
                done('Should not over here');
            }catch(e){
                done()
            }
        })
        it('Ranking Cache Time', done=>{
            try{
                new Orc({
                    rankingCache:'test'
                })
                done('Should not over here');
            }catch(e){
                done()
            }
        })
        it('Result Cache Time', done=>{
            try{
                new Orc({
                    resultCache:'test'
                })
                done('Should not over here');
            }catch(e){
                done()
            }
        })
    })
})

middlewareTest(orcClient);
moduleTest(orcClient);

describe('Orc test data clear', ()=>{
    it('Flush',()=>{
        return orcClient.redis.flushdb();
    })
})
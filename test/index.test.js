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
        it('New config redis client', done=>{
            let orcClient2=new Orc({
                name:'orc2',
                redis:{
                    port: 6379,
                    host: '127.0.0.1'
                }
            })
            done(orcClient2.redis===orcClient.redis);
        })
        it('Another default redis client', done=>{
            let orcClient3=new Orc({
                name:'orc3',
            });
            done(orcClient3.redis!==orcClient.redis);
        });
    })
    describe('Config Test', ()=>{
        it('Name', ()=>{
            orcClient.config.should.have.property('name', 'orc');
        })
    })
    describe('Config Ranking', ()=>{
        it('Name', done=>{
            try{
                new Orc({
                    name:'testRanking',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }]
                })
                done();
            }catch(e){
                done(e);
            }
        })
    })
    //Error Test
    describe('Config Error', ()=>{
        it('Name', done=>{
            try{
                new Orc({
                    name:'test name'
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
    })
    describe('Config Ranking Error', ()=>{
        it('dimensionWeight wrong type', done=>{
            try{
                new Orc({
                    name:'testRanking1',
                    dimensionWeight:'test'
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('dimensionWeight wrong value', done=>{
            try{
                new Orc({
                    name:'testRanking2',
                    dimensionWeight:[{
                        'name':'test test',
                        'point':'test'
                    }]
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingDimensionCache', done=>{
            try{
                new Orc({
                    name:'testRanking3',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingDimensionCache:-1
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingItemCache', done=>{
            try{
                new Orc({
                    name:'testRanking4',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingItemCache:-1
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingPointCache', done=>{
            try{
                new Orc({
                    name:'testRanking5',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingPointCache:-1
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingAvgPointCardinal < 0', done=>{
            try{
                new Orc({
                    name:'testRanking6',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingAvgPointCardinal:-1
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingAvgPointCardinal > 1', done=>{
            try{
                new Orc({
                    name:'testRanking7',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingAvgPointCardinal:1
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingAvgPointMinNumber', done=>{
            try{
                new Orc({
                    name:'testRanking8',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingAvgPointMinNumber:-1
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingAvgPointMaxNumber', done=>{
            try{
                new Orc({
                    name:'testRanking9',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingAvgPointMaxNumber:10
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
            }
        })
        it('rankingAvgPointMaxNumber < rankingAvgPointMinNumber', done=>{
            try{
                new Orc({
                    name:'testRanking10',
                    dimensionWeight:[{
                        'name':'test',
                        'weight':1
                    }],
                    rankingAvgPointMinNumber:12,
                    rankingAvgPointMaxNumber:11
                })
                done('Should not over here');
            }catch(e){
                done();
                console.log(e.message);
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
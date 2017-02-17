//Orc Ranking Module Test
'use strict';
const should = require('should');
const Orc = require('../../index');
let dayTime=60*60*24; //One Day seconds
let expireDay=2;
module.exports=function(orcClient){
    let orcClientTestProfile=new Orc({
        name:'orctestProfile',
        dimensionWeight:[
        {
            'name':'tag',
            'weight':0.5
        },
        {
            'name':'director',
            'weight':1
        }
        ],
        rankingDimensionCache:expireDay
    })
    let profile=orcClientTestProfile.getProfile;
    let item=orcClientTestProfile.getItem;
    let ranking=orcClientTestProfile.getRanking;
    //Set default datas
    profile.update([
    {
        userId:1,
        itemId:1,
        point:0.5
    },
    {
        userId:1,
        itemId:2,
        point:-1
    },
    {
        userId:1,
        itemId:3,
        point:4
    }
    ])
    item.update([
    {
        type:'tag',
        itemId:1,
        dId:1,
        point:9,
    },
    {
        type:'tag',
        itemId:1,
        dId:2,
        point:1,
    },
    {
        type:'tag',
        itemId:1,
        dId:3,
        point:5,
    },
    {
        type:'director',
        itemId:1,
        dId:1,
        point:1,
    },
    {
        type:'director',
        itemId:1,
        dId:2,
        point:1,
    },
    {
        type:'director',
        itemId:1,
        dId:3,
        point:1,
    },
    {
        type:'tag',
        itemId:2,
        dId:1,
        point:5,
    },
    {
        type:'tag',
        itemId:2,
        dId:3,
        point:4,
    },
    {
        type:'director',
        itemId:2,
        dId:1,
        point:1,
    },
    {
        type:'director',
        itemId:2,
        dId:2,
        point:1,
    },
    {
        type:'tag',
        itemId:3,
        dId:1,
        point:8,
    },
    {
        type:'tag',
        itemId:3,
        dId:2,
        point:5,
    },
    {
        type:'tag',
        itemId:3,
        dId:3,
        point:3,
    },
    {
        type:'director',
        itemId:3,
        dId:1,
        point:1,
    },
    {
        type:'director',
        itemId:3,
        dId:2,
        point:1,
    },
    {
        type:'director',
        itemId:3,
        dId:3,
        point:1,
    },
    {
        type:'tag',
        itemId:4,
        dId:1,
        point:3,
    },
    {
        type:'tag',
        itemId:4,
        dId:2,
        point:4,
    },
    {
        type:'tag',
        itemId:4,
        dId:3,
        point:6,
    },
    {
        type:'tag',
        itemId:4,
        dId:4,
        point:1,
    },
    {
        type:'director',
        itemId:4,
        dId:1,
        point:1,
    },
    {
        type:'director',
        itemId:4,
        dId:2,
        point:1,
    },
    {
        type:'director',
        itemId:4,
        dId:3,
        point:1,
    }
    ])
    describe('Ranking module', ()=>{
        it('Get Dimension Cache', done=>{
            ranking.getDimensionCache(1).then(result=>{
                let tagResult=result.tag;
                done(!(parseInt(tagResult[0].id)===1&&parseFloat(tagResult[0].point)===10.4989&&parseInt(tagResult[1].id)===2&&parseFloat(tagResult[1].point)===6.8327&&parseInt(tagResult[2].id)===3&&parseFloat(tagResult[2].point)===3.4997));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Dimension Cache again', done=>{
            ranking.getDimensionCache(1).then(result=>{
                let tagResult=result.tag;
                done(!(parseInt(tagResult[0].id)===1&&parseFloat(tagResult[0].point)===10.4989&&parseInt(tagResult[1].id)===2&&parseFloat(tagResult[1].point)===6.8327&&parseInt(tagResult[2].id)===3&&parseFloat(tagResult[2].point)===3.4997));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Dimension Cache with top', done=>{
            ranking.getDimensionCache(1,1).then(result=>{
                let tagResult=result.tag;
                done(!(tagResult.length===1&&parseInt(tagResult[0].id)===1&&parseFloat(tagResult[0].point)===10.4989));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Dimension Cache with bottom', done=>{
            ranking.getDimensionCache(1,-1).then(result=>{
                let tagResult=result.tag;
                done(!(tagResult.length===1&&parseInt(tagResult[0].id)===3&&parseFloat(tagResult[0].point)===3.4997));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Dimension Cache Expire seconds', done=>{
            let redisClient = ranking.getRedisClient();
            let redisKey = ranking.getRedisKey('1:dimension:tag');
            redisClient.ttl(redisKey).then(result=>{
                done(parseInt(result)<(expireDay*dayTime-2));
            }).catch(e=>{
                done(e);
            })
        })
        //Error test
        it('Get Dimension Cache with wrong userId', done=>{
            ranking.getDimensionCache(2).then(result=>{
                done(result.tag.length!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Dimension Cache without userId', done=>{
            ranking.getDimensionCache().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done();
                console.log('message:',e.message);
            })
        })
    })
}
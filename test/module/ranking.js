//Orc Ranking Module Test
'use strict';
const should = require('should');
const Orc = require('../../index');
let dayTime=60*60*24; //One Day seconds
let expireDay=2;
module.exports=function(orcClient){
    let orcClientTestProfile=new Orc({
        name:'testProfile',
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
        rankingDimensionCache:expireDay,
        rankingItemCache:expireDay,
        rankingPointCache:expireDay
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
        it('Get Dimension Cache Expire seconds', done=>{
            let redisClient = ranking.getRedisClient();
            let redisKey = ranking.getRedisKey('1:dimension:tag');
            redisClient.ttl(redisKey).then(result=>{
                done(parseInt(result)<(expireDay*dayTime-2));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Recommend Cache', done=>{
            ranking.getItemRecommendCache(1).then(result=>{
                done(!(parseInt(result[0].id)===3&&parseFloat(result[0].point)===68.1599&&parseInt(result[1].id)===1&&parseFloat(result[1].point)===63.2437&&parseInt(result[2].id)===4&&parseFloat(result[2].point)===43.7459&&parseInt(result[3].id)===2&&parseFloat(result[3].point)===35.5799));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Recommend Cache again', done=>{
            ranking.getItemRecommendCache(1).then(result=>{
                done(!(parseInt(result[0].id)===3&&parseFloat(result[0].point)===68.1599&&parseInt(result[1].id)===1&&parseFloat(result[1].point)===63.2437&&parseInt(result[2].id)===4&&parseFloat(result[2].point)===43.7459&&parseInt(result[3].id)===2&&parseFloat(result[3].point)===35.5799));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Recommend Cache top 1', done=>{
            ranking.getItemRecommendCache(1,1).then(result=>{
                done(!(result.length===1&&parseInt(result[0].id)===3&&parseFloat(result[0].point)===68.1599));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Recommend Cache bottom 1', done=>{
            ranking.getItemRecommendCache(1,-1).then(result=>{
                done(!(result.length===1&&parseInt(result[0].id)===2&&parseFloat(result[0].point)===35.5799));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Recommend Cache Expire seconds', done=>{
            let redisClient = ranking.getRedisClient();
            let redisKey = ranking.getRedisKey('1:itemList');
            redisClient.ttl(redisKey).then(result=>{
                done(parseInt(result)<(expireDay*dayTime-2));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Point', done=>{
            ranking.getItemPoint(1,4).then(result=>{
                done(result!==0.2916);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Point again', done=>{
            ranking.getItemPoint(1,4).then(result=>{
                done(result!==0.2916);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Point Expire seconds', done=>{
            let redisClient = ranking.getRedisClient();
            let redisKey = ranking.getRedisKey('1:itemPoint:4');
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
        it('Get Item Recommend Cache top 0', done=>{
            ranking.getItemRecommendCache(1,0).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done();
                console.log('message:',e.message);
            })
        })
        it('Get Item Recommend Cache with wrong userId', done=>{
            ranking.getItemRecommendCache(2).then(result=>{
                done(result.length!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Recommend Cache without userId', done=>{
            ranking.getItemRecommendCache().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done();
                console.log('message:',e.message);
            })
        })
        it('Get Item Point with wrong userId', done=>{
            ranking.getItemPoint(2,4).then(result=>{
                done(result!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Point with wrong itemId', done=>{
            ranking.getItemPoint(1,5).then(result=>{
                done(result!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get Item Point without userId', done=>{
            ranking.getItemPoint().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done();
                console.log('message:',e.message);
            })
        })
        it('Get Item Point without itemId', done=>{
            ranking.getItemPoint(1).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done();
                console.log('message:',e.message);
            })
        })
    })
}
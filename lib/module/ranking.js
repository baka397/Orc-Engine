//Default Module-Ranking
'use strict';
let dayTime=60*60*24; //One Day seconds
let nextPromise=new Promise((resolve,reject)=>{
    resolve([]);
});
/**
 * Redis cache middleware
 * @param  {Array}    datas Redis result array
 * @param  {Function} next  
 */
function redisCacheMiddleware(datas,next){
    let datasCache=datas.slice(0); //copy to cache
    datas=[];//reset datas
    datasCache.forEach((data,index)=>{
        if(index%2===1){
            datas.push({
                'id':datasCache[index-1],
                'point':(Math.round(data*10000)/10000)
            })
        }
    });
    next(null,datas);
}
function rankingModule(){}
rankingModule.prototype={
    init:function(){
        let error;
        let orcConfig=this.getConfig();
        let tools=this.getTools();
        if(!(orcConfig.dimensionWeight&&Array.isArray(orcConfig.dimensionWeight))) error=new Error('You must set config "dimensionWeight" when you use ranking module');
        if(!error&&orcConfig.rankingDimensionCache&&!(parseFloat(orcConfig.rankingDimensionCache)>0)) error=new Error('"rankingDimensionCache" must >0');
        if(!error&&orcConfig.rankingItemCache&&!(parseFloat(orcConfig.rankingItemCache)>0)) error=new Error('"rankingItemCache" must >0');
        if(!error&&orcConfig.rankingPointCache&&!(parseFloat(orcConfig.rankingPointCache)>0)) error=new Error('"rankingPointCache" must >0');
        if(!error){
            let valid=orcConfig.dimensionWeight.every(item=>{
                return tools.testStringArgument(item.name,3,20)&&!isNaN(item.weight)
            })
            if(!valid) error=new Error('"dimensionWeight" item must have name(word,3-20)&&weight(Number)');
        }
        if(error) throw error;
        this.config={
            dimensionWeight:orcConfig.dimensionWeight, //Dimension Weight const
            dimensionCache:parseFloat(orcConfig.rankingDimensionCache)||1, //Profile Dimension Type Cache(ranking/dimension:avg_point)
            itemCache:parseFloat(orcConfig.rankingItemCache)||1, //Item Recommend Cache(ranking/dimension:avg_point)
            pointCache:parseFloat(orcConfig.rankingPointCache)||1 //Item Recommend Point Cache(ranking/item:point)
        }
        //Handle Ranking Dimension Cache result
        this.use('rankingDimension',redisCacheMiddleware);
    },
    /**
     * Set Profile Dimension Type Cache
     * @param  {String} userId User ID
     * @return {Object}        Promise object
     */
    setDimensionCache:function(userId){
        let profileModule = this.getDependModule('profile');
        let itemModule = this.getDependModule('item');
        let redisClient = this.getRedisClient();
        let DIMENSION_WEIGHT = this.dimensionWeight;
        let EXPIRE_TIME = this.config.dimensionCache*dayTime;
        return profileModule.get(userId).then(result=>{
            if(result.length>0){
                let redisPipeline=redisClient.pipeline();
                result.forEach((userPoint,index)=>{
                    //Get profile item point
                    if(index%2===1){
                        let itemId=result[index-1];
                        let weight=userPoint; //union weight
                        //Union with item point in pipeline
                        this.config.dimensionWeight.forEach((dimensionType,dimensionIndex)=>{
                            let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType.name);
                            let itemRedisKey = itemModule.getRedisKey('item:'+dimensionType.name+':'+itemId);
                            //Add first one
                            if(index===1) redisPipeline.zunionstore(redisKey,1,itemRedisKey,'WEIGHTS',weight);
                            //Add other
                            else redisPipeline.zunionstore(redisKey,2,redisKey,itemRedisKey,'WEIGHTS',1,weight);
                        })
                    }
                })
                let avgWeight=Math.round(20000/result.length)/10000; //weight 4 decimal places
                this.config.dimensionWeight.forEach((dimensionType,dimensionIndex)=>{
                    let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType.name);
                    redisPipeline.zunionstore(redisKey,1,redisKey,'WEIGHTS',avgWeight);
                    redisPipeline.expire(redisKey,EXPIRE_TIME)
                });
                return redisPipeline.exec();
            }else{
                return nextPromise;
            }
        })
    },
    getDimensionCache:function(userId,dimensionType){
        let error;
        if(!userId){
            error=new Error('You must set "userId" when use ranking:getDimensionCache');
        }
        if(!error){
            if(!dimensionType) error=new Error('You must set "dimensionType" when use ranking:getDimensionCache');
            else{
                let valid=this.config.dimensionWeight.some(dimension=>{
                    return dimension.name===dimensionType;
                })
                if(!valid) error=new Error('dimensionType is not declared in "dimensionWeight"');
            }
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType);
        return redisClient.exists(redisKey).then(result=>{ //Confirm redis key
            //if not exists this key
            if(parseInt(result)===0){ //Set cache
                return this.setDimensionCache(userId);
            }else{ //Continue
                return nextPromise;
            }
        }).then(result=>{
            return redisClient.zrevrange(redisKey,0,-1,'WITHSCORES');
        }).then(cacheResult=>{
            return this.getMiddlewares('rankingDimension',cacheResult);
        })
    }
}
module.exports=rankingModule;
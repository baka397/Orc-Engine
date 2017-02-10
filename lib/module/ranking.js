//Default Module-Ranking
'use strict';
let dayTime=60*60*24; //One Day seconds
/**
 * Redis Dimension cache middleware
 * @param  {Object}   datas Redis result
 * @param  {Function} next  
 */
function redisDimensionCacheMiddleware(datas,next){
    let result=Object.create(null);
    datas.resultArray.forEach((dimension,index)=>{
        let dimensionCache=[];
        dimension[1].forEach((point,index)=>{
            if(index%2===1){
                dimensionCache.push({
                    'id':dimension[1][index-1],
                    'point':(Math.round(point*10000)/10000)
                });
            }
        });
        result[datas.nameArray[index]]=dimensionCache;
    });
    next(null,result);
}
function rankingModule(){}
rankingModule.prototype={
    init:function(){
        let error;
        let orcConfig=this.getConfig();
        let tools=this.getTools();
        if(!(orcConfig.dimensionWeight&&Array.isArray(orcConfig.dimensionWeight))) error=new Error('You must set config "dimensionWeight" when you use ranking module');
        if(!error&&orcConfig.rankingDimensionCache&&!(parseFloat(orcConfig.rankingDimensionCache)>0)) error=new Error('"rankingDimensionCache" must >0');
        if(!error){
            let valid=orcConfig.dimensionWeight.every(item=>{
                return tools.testStringArgument(item.name,3,20)&&!isNaN(item.weight);
            });
            if(!valid) error=new Error('"dimensionWeight" item must have name(word,3-20)&&weight(Number)');
        }
        if(error) throw error;
        this.config={
            dimensionWeight:orcConfig.dimensionWeight, //Dimension Weight const
            dimensionCache:parseFloat(orcConfig.rankingDimensionCache)||1, //Profile Dimension Type Cache(ranking/dimension:avg_point)
        };
        //Handle Ranking Dimension Cache result
        this.use('rankingDimension',redisDimensionCacheMiddleware);
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
                        this.config.dimensionWeight.forEach((dimensionType)=>{
                            let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType.name);
                            let itemRedisKey = itemModule.getRedisKey('item:'+dimensionType.name+':'+itemId);
                            redisPipeline.zunionstore(redisKey,2,redisKey,itemRedisKey,'WEIGHTS',1,weight);
                        });
                    }
                });
                let avgWeight=Math.round(20000/result.length)/10000; //weight 4 decimal places
                this.config.dimensionWeight.forEach(dimensionType=>{
                    let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType.name);
                    redisPipeline.zunionstore(redisKey,1,redisKey,'WEIGHTS',avgWeight);
                    redisPipeline.expire(redisKey,EXPIRE_TIME);
                });
                return redisPipeline.exec();
            }else{
                let nextPromise = this.getTools().nextPromise;
                return nextPromise(null,[]);
            }
        });
    },
    /**
     * Get Profile Dimension Type Cache. if not exist, use setDimensionCache.
     * @param  {String} userId User ID
     * @return {Object}        Promise object
     */
    getDimensionCache:function(userId){
        let error;
        if(!userId){
            error=new Error('You must set "userId" when use ranking:getDimensionCache');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            });
        }
        let redisClient = this.getRedisClient();
        let redisTestKey = this.getRedisKey(userId+':dimension:'+this.config.dimensionWeight[0].name);
        let dimensionNameCache = [];
        return redisClient.exists(redisTestKey).then(result=>{ //Confirm redis key
            //if not exists this key
            if(parseInt(result)===0){ //Set cache
                return this.setDimensionCache(userId);
            }else{ //Continue
                let nextPromise = this.getTools().nextPromise;
                return nextPromise(null,[]);
            }
        }).then(()=>{ //Get all dimension
            let redisPipeline=redisClient.pipeline();
            this.config.dimensionWeight.forEach(dimensionType=>{
                let redisKey=this.getRedisKey(userId+':dimension:'+dimensionType.name);
                dimensionNameCache.push(dimensionType.name);
                redisPipeline.zrevrange(redisKey,0,-1,'WITHSCORES');
            });
            return redisPipeline.exec();
        }).then(cacheResult=>{
            return this.getMiddlewares('rankingDimension',{
                nameArray:dimensionNameCache,
                resultArray:cacheResult
            });
        });
    }
};
module.exports=rankingModule;
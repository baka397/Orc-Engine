//Default Module-Profile
'use strict';
function profileModule(){}
profileModule.prototype={
    /**
     * Module init after module instance created
     */
    init:function(){
        //valid data middleware
        this.use(function(datas,next){
            let error;
            if(!Array.isArray(datas)) error=new Error('Profile datas must be an array');
            if(!error&&datas.length===0) error=new Error('Profile datas must be not empty');
            if(!error){
                let valid=datas.every(data=>{
                    try{
                        return data.userId&&data.itemId&&data.point&&!isNaN(data.point)
                    }
                    catch(e){
                        return false;
                    }
                });
                if(!valid) error=new Error('Profile data must have right props:userId,itemId,point');
            }
            next(error);
        })
    },
    /**
     * Update profile to redis
     * @param  {Array}    pointArray An array for profile info(Object:userId,itemId,point)
     * @return {Function}            Promise object
     */
    update:function(pointArray){
        let profileMiddlewares = this.getMiddlewares(pointArray);
        let redisClient = this.getRedisClient();
        return profileMiddlewares.then(datas=>{
            let redisPipeline=redisClient.pipeline();
            pointArray.forEach(pointInfo=>{
                redisPipeline.zincrby(this.getRedisKey(pointInfo.userId),pointInfo.point,pointInfo.itemId);
            })
            return redisPipeline.exec();
        })
    },
    /**
     * Get profile from redis
     * @param  {String}   userId User ID
     * @return {Function}        Promise object
     */
    get:function(userId){
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey(userId);
        return redisClient.zrange(redisKey,0,-1,'withscores');
    },
    /**
     * Remove mulit item point from user
     * @param  {String}   userId    User ID
     * @param  {String}   ...itemId Item IDs
     * @return {Function}           Promise object
     */
    remove:function(userId){
        let error;
        if(!userId){
            error=new Error('You must specifie user id when you use "remove"');
        }
        let args=Array.prototype.slice.call(arguments, 1);
        if(!error&&args.length===0){
            error=new Error('You must specifie item id when you use "remove"')
        }
        if(error){
            return new Promise((resole,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey(userId);
        args.unshift(redisKey);
        return redisClient.zrem.apply(redisClient,args);
    },
    /**
     * Clear user point info
     * @param  {String}   userId User ID
     * @return {Function}        Promise object
     */
    clear:function(userId){
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey(userId);
        return redisClient.del(redisKey);
    }
}
module.exports=profileModule;
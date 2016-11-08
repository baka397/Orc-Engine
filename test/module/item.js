//Orc Item Module Test
'use strict';
const should = require('should');
module.exports=function(orcClient){
    let item=orcClient.getItem;
    describe('Item module', ()=>{
        it('Set/Update', done=>{
            item.update([
            {
                type:'test',
                itemId:1,
                dId:1,
                point:0.5
            }
            ]).then(result=>{
                done();
            }).catch(e=>{
                done(e);
            })
        })
        it('Mulit set/update', done=>{
            item.update([
            {
                type:'test',
                itemId:1,
                dId:1,
                point:-1.5
            },
            {
                type:'test',
                itemId:1,
                dId:2,
                point:3
            },
            {
                type:'test',
                itemId:1,
                dId:3,
                point:4
            },
            {
                type:'test',
                itemId:2,
                dId:3,
                point:1
            },
            {
                type:'test2',
                itemId:2,
                dId:3,
                point:1
            }
            ]).then(result=>{
                done();
            }).catch(e=>{
                done(e);
            })
        })
        it('Get item', done=>{
            item.getItem('test',1).then(result=>{
                done(!(parseInt(result[0])===1&&parseFloat(result[1])===-1&&parseInt(result[2])===2&&parseFloat(result[3])===3&&parseInt(result[4])===3&&parseFloat(result[5])===4));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get dimension', done=>{
            item.getDimension('test',1).then(result=>{
                done(!(parseInt(result[0])===1&&parseFloat(result[1])===-1));
            }).catch(e=>{
                done(e);
            })
        })
        it('Remove item dimension', done=>{
            item.removeItemDimension('test',1,1).then(result=>{
                done(!(parseInt(result[0][1])===1&&parseInt(result[1][1])===1));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get new item', done=>{
            item.getItem('test',1).then(result=>{
                done(!(parseInt(result[0])===2&&parseFloat(result[1])===3&&parseInt(result[2])===3&&parseFloat(result[3])===4));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get new dimension', done=>{
            item.getDimension('test',1).then(result=>{
                done(result.length!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Clear item', done=>{
            item.clearItem('test',1).then(result=>{
                //del item key, del 2 dimension key member
                done(result.length!==3);
            }).catch(e=>{
                done(!e);
            })
        })
        it('Clear item confirm', done=>{
            //Push promise task
            let promiseList = [];
            promiseList.push(item.getItem('test',1)); //get item 1, will empty
            promiseList.push(item.getItem('test',2)); //get item 2, will 3,1
            promiseList.push(item.getDimension('test',2)); //get dimension 2, will empty
            promiseList.push(item.getDimension('test',3)); //get dimension 3, will 2,1
            Promise.all(promiseList).then(results=>{
                done(!(results[0].length===0&&parseInt(results[1][0])===3&&parseInt(results[1][1])===1&&results[2].length===0&&parseInt(results[3][0])===2&&parseInt(results[3][1])===1));
            }).catch(e=>{
                done(!e);
            })
        })
        it('Set/Update wrong type', done=>{
            item.update(
            {
                type:'test',
                itemId:1,
                dId:1,
                point:0.5
            }
            ).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update empty value', done=>{
            item.update([]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update wrong value', done=>{
            item.update([{
                type:'test',
                itemId:1,
                dId:1,
                point:'test'
            }]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update value null', done=>{
            item.update([null]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Get item without type', done=>{
            item.getItem().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Get item without itemId', done=>{
            item.getItem('test').then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Get dimension without type', done=>{
            item.getDimension().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Get dimension without dId', done=>{
            item.getDimension('test').then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without type', done=>{
            item.removeItemDimension().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without itemId', done=>{
            item.removeItemDimension('test').then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without dId', done=>{
            item.removeItemDimension('test',1).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Clear item without type', done=>{
            item.clearItem().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Clear item without itemId', done=>{
            item.clearItem('test').then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Clear item not exist', done=>{
            item.clearItem('test',1).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
    })
}
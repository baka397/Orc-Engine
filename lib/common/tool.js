'use strict';
/**
 * Test string argument
 * @param  {String} argument  Argument value
 * @param  {Number} minLength Min string length
 * @param  {Number} maxLength Max string length
 * @return {Boolen}
 */
exports.testStringArgument=function(argument,minLength,maxLength){
    return new RegExp('^[a-zA-Z0-9\-\_]{'+minLength+','+maxLength+'}$').test(argument);
}
/**
 * Applay methods
 * @param  {Function} constructor
 */
exports.applyMethods=function(constructor){
    let methods=Array.prototype.slice.call(arguments, 1);
    methods.forEach((method)=>{
        Object.assign(constructor.prototype,method);
    })
}
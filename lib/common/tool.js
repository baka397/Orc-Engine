//Commom tools
'use strict';
/**
 * Test string argument
 * @param  {String} argument  Argument value
 * @param  {Number} minLength Min string length
 * @param  {Number} maxLength Max string length
 * @return {Boolen}
 */
exports.testStringArgument = function(argument,minLength,maxLength){
    return new RegExp('^[a-zA-Z][a-zA-Z0-9\-\_]{'+(minLength-1)+','+(maxLength-1)+'}$').test(argument);
}
/**
 * Applay methods
 * @param  {Function} constructor
 */
exports.applyMethods = function(constructor){
    let methods=Array.prototype.slice.call(arguments, 1);
    methods.forEach((method)=>{
        Object.assign(constructor.prototype,method);
    })
}

/**
 * Trans First word to uppercase
 * @param  {String} word
 * @return {String}
 */
exports.firstWordUpper = function(word) {
    return word.replace(/^[a-zA-Z](\S+)$/,word[0].toUpperCase()+'$1');
}
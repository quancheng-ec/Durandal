/**
 * 
 */

const Durandal = require('./src/main')
const version = require('./package.json').version
const { RouteMap, RouteMethods, RouteParam, SkipAuth } = require('./src/lib/router')

module.exports = exports = Durandal

exports.RouteMap = RouteMap
exports.RouteMethods = RouteMethods
exports.RouteParam = RouteParam
exports.SkipAuth = SkipAuth

exports.version = version

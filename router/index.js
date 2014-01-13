/**
 * 路由,负责分发请求
 */

var handler = require('../handler');
var router = require('urlrouter');

module.exports = router(function (app) {
        app.get('/requireData',handler.data.sendBackData);
        app.post('/requireData',handler.data.sendBackDataforPost);
        //app.all('*', handler.test.notFound);
        
   })
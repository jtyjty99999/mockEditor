/**
 * 错误处理模块,负责输出me那种错误代码
 */


module.exports= {
        pageNotFound : function (req, res) {
                res.statusCode = 404;
                res.end('er... some page miss...');
        },
        errorHandler : function (req, res) {
                res.statusCode = 500;
                res.end('oops..error occurred');
        },
        dataInvalid:function(req,res){
                res.statusCode = 200;
                res.end('{ERRORCODE:"ME33001",RESULT:[]}');
        },
        sendErrorMsg:function(req,res,msg){
                res.statusCode = 200;
                res.end(msg);
        }
};
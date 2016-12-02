 //引入gulp
var gulp = require("gulp");
//引入gulp-concat合并插件
var concat = require("gulp-concat");
//引入uglify压缩插件
var uglify = require("gulp-uglify");
//启动服务
var webserver = require("gulp-webserver");
//引入sass编译
var sass = require("gulp-sass");
//引入minify压缩css插件
var minify = require("gulp-minify-css");
//引入gulp-webpack
var webpack = require("gulp-webpack");
//引入named
var named = require("vinyl-named")
//引入版本控制插件
var rev =require("gulp-rev")
//引入自动替换文件名
var revcollertor = require("gulp-rev-collector");
// 引入url
var url = require("url");
// 引入fs 
var fs = require("fs");



//构建一个拷贝文件的任务
gulp.task("copy-index",function(){
	console.log("111")
	gulp.src("./index.html")
		.pipe(gulp.dest("./app"));
})

//构建合并代码
gulp.task("together",function(){
	gulp.src(["./app/src/script/lib/script1.js","./app/src/script/lib/script2.js"])
		.pipe(concat("script.js"))
		.pipe(gulp.dest("./app/src/script/lib"))
})

//构建检测任务
gulp.task("watch",function(){
	//gulp.watch("./index.html",["copy-index"])
	//gulp.watch("./app/src/script/*.js",["together"])
	gulp.watch(sassFiles,["sass"])
	gulp.watch(cssFiles,["css"])
	gulp.watch("./app/src/script/**/*.js",["packjs"]);
})

//引入插件压缩
gulp.task("down",function(){
	gulp.src("./app/script/lib/jquery-2.1.1.js")
		.pipe(uglify())
		.pipe(gulp.dest("./app/dist"))
})

//启动服务
gulp.task("server",function(){
	gulp.src("./")
		.pipe(webserver({
			port:4000,
			livereload:true,//自行保存浏览器自动刷新
			directoryListing:{ //目录结构的配置
				enable:true, //显示目录
				path:"./app" //显示具体路径下的目录
			},
			// mock数据
            middleware:function(req,res,next){
                var urlObj = url.parse(req.url,true);
                switch(urlObj.pathname){
                	case '/api/getLivelist.php':
                	res.setHeader("Content-type","application/json");
                	fs.readFile('./mock/livelist.json','utf-8',function(err,data){
                        res.end(data);
                	});
                	return;
                	case '/api/getLivelistmore.php':
                	res.setHeader("Content-type","application/json");
                	fs.readFile('./mock/livelist-more.json','utf-8',function(err,data){
                        res.end(data);
                	});
                    return;
                }
                next();
            }
		}))
})

//编译sass
var sassFiles = ["./app/src/styles/**/*.scss"];
gulp.task("sass",function () {
	gulp.src(sassFiles)
		.pipe(sass())
		.pipe(minify())
		.pipe(gulp.dest("./app/prd/styles"))
})
//编译css
var cssFiles =["./app/src/styles/*.css"]
gulp.task("css",function(){
	gulp.src(cssFiles)
		.pipe(minify())
		.pipe(gulp.dest("./app/prd/styles"))
})


//实现JS模块化
var jsFiles=["./app/src/script/app.js"]
gulp.task("packjs",function(){
	gulp.src(jsFiles)
		.pipe(named())
		.pipe(webpack({
			output:{
				filename:'[name].js'
			},
			modules:{
				loaders:[
                  {
                  	test:/\.js$/,
                  	loader:'imports?define=>false'
                  }
        		]
			}
		}))
		.pipe(uglify().on("error",function(e){
			console.log("\x07",e.lineNumer,e.message);
			return this.end();
		}))
		.pipe(gulp.dest("./app/prd/scripts"))
})

//版本控制
var discssFiles = ["./app/prd/styles/app.css"];
var disjsFiles = ["./app/prd/scripts/app.js"];
gulp.task("ver",function(){
	gulp.src(discssFiles)
		.pipe(rev()) //生成name-md5文件
		.pipe(gulp.dest("./app/prd/styles"))
		.pipe(rev.manifest())
		.pipe(gulp.dest("./app/ver/styles"))
	gulp.src(disjsFiles)
		.pipe(rev()) //生成name-md5文件
		.pipe(gulp.dest("./app/prd/scripts"))
		.pipe(rev.manifest())
		.pipe(gulp.dest("./app/ver/scripts"))
})
//让html文件自动将入口文件的文件名替换为md5加密之后的名称
gulp.task("html",function(){
	gulp.src(["./app/ver/**/*json","./app/*.html"])
		.pipe(revcollertor())
		.pipe(gulp.dest("./app"))
})

gulp.task("min",["ver","html"])


//默认操作
gulp.task("default",["watch","server"]);
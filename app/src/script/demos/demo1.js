//定义一个myapp的模块,没有[]表示获取模块
var myApp = angular.module("myApp",[]);
myApp.controller("democon",["$scope",function($scope){
	var user = [
		{
			user:"marry",
			email:"marry@sohu.com"
		},
		{
			user:"lili",
			email:"lili@sohu.com"
		}
	]
	$scope.user = user;
	$scope.isShow = true;
	$scope.count=0;
	$scope.add = function(){
		this.count++;
	}
	$scope.arr=[];
	$scope.adds = function(event){
		if(event.keyCode == "13"){
			$scope.arr.unshift($scope.item)
			$scope.item="";
		}
	}
	$scope.limit = 4;
	$scope.books = [
		{
			name:"javascript高级程序设计",publite:false,updated:1480591785416
		},
		{
			name:"angular权威指南",publite:true,updated:1480361785416
		},
		{
			name:"vue实战",publite:false,updated:1480291785425
		},
		{
			name:"node全站开发",publite:true,updated:1481391785476
		}
	]
	$scope.price=188;
}])
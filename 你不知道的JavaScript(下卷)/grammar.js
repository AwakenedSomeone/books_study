// 默认值表达式
var w = 1, z = 2; 
function foo( x = w + 1, y = x + 1, z = z + 1 ) { 
 console.log( x, y, z ); 
} 
foo();
// 注意，z + 1 中的 z 发现 z 是一个此刻还没初始化的参数变量，所以它永远不会试图从外层作用域寻找 z
// 所以会报错误：Uncaught ReferenceError: Cannot access 'z' before initialization

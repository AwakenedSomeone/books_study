function add(xPromise,yPromise) { 
  // Promise.all([ .. ])接受一个promise数组并返回一个新的promise，
  // 这个新promise等待数组中的所有promise完成
  return Promise.all( [xPromise, yPromise] ) 
  // 这个promise决议之后，我们取得收到的X和Y值并加在一起
  .then( function(values){ 
  // values是来自于之前决议的promisei的消息数组
  return values[0] + values[1]; 
  } ); 
 } 
 // fetchX()和fetchY()返回相应值的promise，可能已经就绪，
 // 也可能以后就绪 
 add( fetchX(), fetchY() ) 
 // 我们得到一个这两个数组的和的promise
 // 现在链式调用 then(..)来等待返回promise的决议
 .then( function(sum){ 
  console.log( sum ); // 这更简单！
 } );

//  注：这里add里，通过then方法return了一个promise，所以可以使用add().then



// 注意： 一个promise决议以后，这个promise上所有通过then()注册的回调都会在下一个异步时机点上一次被立即调用。
// 这些回调中的任意一个都无法影响或延误对其他回调的调用。参看下面例子：C无法打断或者抢占“B”。
function foo () {
  return new Promise((resolve) => {resolve(2)})
}
p.then(() => {
  p.then(() => {
    console.log('C')
  })
  console.log('A')
})
p.then(() => {
  console.log('B')
})
// A
// B
// C

var p3 = new Promise( function(resolve,reject){ 
  resolve( "B" ); 
 } ); 
 var p1 = new Promise( function(resolve,reject){ 
  resolve( p3 ); 
 } ); 
 p2 = new Promise( function(resolve,reject){ 
  resolve( "A" ); 
 } ); 
 p1.then( function(v){ 
  console.log( v ); 
 } )
 p2.then( function(v){ 
  console.log( v ); 
 } );

//  promise.resolve 和 new promise参数里的resolve的区别
var p3 = new Promise( function(resolve,reject){ 
  resolve( "B" ); 
 } ); 
 var p1 = new Promise( function(resolve,reject){ 
  resolve( p3 ); 
 } ); 
 var p2 = Promise.resolve(p3)

 p2 === p3 // true
 p1 === p3 // false
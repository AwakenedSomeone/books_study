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
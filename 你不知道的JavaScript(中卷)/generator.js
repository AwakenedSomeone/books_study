// 如果在生成器内有 try..finally 语句，它将总是运行，即使生成器已经外部结束。如果需
// 要清理资源的话（数据库连接等），这一点非常有用：
function *something() { 
  try { 
    var nextVal; 
    while (true) { 
      if (nextVal === undefined) { 
      nextVal = 1; 
      } else { 
      nextVal = (3 * nextVal) + 6; 
      } 
      yield nextVal; 
    } 
  } 
  // 清理子句
  finally { 
    console.log( "cleaning up!" ); 
  } 
}

// 之前的例子中，for..of 循环内的 break 会触发 finally 语句。但是，也可以在外部通过
// return(..) 手工终止生成器的迭代器实例：
var it = something(); 
for (var v of it) { 
 console.log( v ); 
 // 不要死循环！
 if (v > 500) { 
 console.log( 
 // 完成生成器的迭代器
 it.return( "Hello World" ).value 
 ); 
 // 这里不需要break 
 } 
} 
// 1 9 33 105 321 969 
// 清理！
// Hello World 
// 调用 it.return(..) 之后，它会立即终止生成器，这当然会运行 finally 语句。另外，它
// 还会把返回的 value 设置为传入 return(..) 的内容，这也就是 "Hello World" 被传出
// 去的过程。现在我们也不需要包含 break 语句了，因为生成器的迭代器已经被设置为
// done:true，所以 for..of 循环会在下一个迭代终止。


// 生成器委托
function *foo() { 
  console.log( "*foo() starting" )
  yield 3; 
  yield 4; 
  console.log( "*foo() finished" ); 
} 
function *bar() { 
 yield 1; 
 yield 2; 
 yield *foo(); // yield委托！
 yield 5; 
} 
var it = bar(); 
it.next().value; // 1 
it.next().value; // 2 
it.next().value; // *foo()启动
 // 3 
it.next().value; // 4 
it.next().value; // *foo()完成
 //
//  首先，和我们以前看到的完全一样，调用 foo() 创建一个迭代器。然后 yield * 把迭代器
// 实例控制（当前 *bar() 生成器的）委托给 / 转移到了这另一个 *foo() 迭代器。
// 所以，前面两个 it.next() 调用控制的是 *bar()。但当我们发出第三个 it.next() 调用时，
// *foo() 现在启动了，我们现在控制的是 *foo() 而不是 *bar()。这也是为什么这被称为委
// 托：*bar() 把自己的迭代控制委托给了 *foo()。
// 一旦 it 迭代器控制消耗了整个 *foo() 迭代器，it 就会自动转回控制 *bar()。
// yield * 暂停了迭代控制，而不是生成器控制
// 但实际上，你可以 yield 委托到任意iterable，yield *[1,2,3] 会消耗数组值 [1,2,3] 的默认迭代器。

// yield 委托一个非生成器的一般 iterable。比如
function *bar() { 
  console.log( "inside *bar():", yield "A" );
  // yield委托给非生成器！
  console.log( "inside *bar():", yield *[ "B", "C", "D" ] ); 
  console.log( "inside *bar():", yield "E" ); 
  return "F"; 
 } 
 var it = bar();
 console.log( "outside:", it.next().value ); 
// outside: A 
console.log( "outside:", it.next( 1 ).value ); 
// inside *bar(): 1 
// outside: B 
console.log( "outside:", it.next( 2 ).value ); 
// outside: C 
console.log( "outside:", it.next( 3 ).value ); 
// outside: D 
console.log( "outside:", it.next( 4 ).value ); 
// inside *bar(): undefined 
// outside: E 
console.log( "outside:", it.next( 5 ).value ); 
// inside *bar(): 5 
// outside: F
// 注意这个例子和之前那个例子在消息接收位置和报告位置上的区别。
// 最显著的是，默认的数组迭代器并不关心通过 next(..) 调用发送的任何消息，所以值 2、 3 和 4 根本就被忽略了。
// 还有，因为迭代器没有显式的返回值（和前面使用的 *foo() 不同），所以 yield * 表达式完成后得到的是一个 undefined。
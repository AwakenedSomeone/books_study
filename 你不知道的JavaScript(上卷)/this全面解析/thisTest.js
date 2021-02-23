if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this
    console.log(this)
    console.log(obj)
    var curried = [].slice.call(arguments, 1)
    var bound = function () {
      console.log(this)
      return fn.apply(
        (!this || this === (window || global)) ? obj : this,
        curried.concat.apply(curried, arguments)
      )
    }
    bound.prototype = Object.create(fn.prototype)
    return bound
  }
}
function foo () {
  console.log('name:' + this.name)
}
var obj = { name:'obj' },
    obj2 = { name: 'obj2' },
    obj3 = { name: 'obj3' }
var fooOBJ = foo.softBind(obj)
fooOBJ()
obj2.foo = foo.softBind(obj)  // 这里类似于隐式绑定 所以绑定到了obj2上
obj2.foo()
fooOBJ.call(obj3)
setTimeout(obj2.foo, 10) // 应用了软绑定

// 箭头函数的词法作用域
function foo () {
  // 返回一个箭头函数
  return (a) => {
    // this继承自foo()
    console.log(this.a)
  }
}
var obj1 = {
  a: 2
}
var obj2 = {
  a: 3
}
var bar = foo.call(obj1)
bar.call(obj2) // 打印出来是2 不是3！！ 说明箭头函数绑定了this就无法修改了
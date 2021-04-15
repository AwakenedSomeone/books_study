// js里的一些不常用，却有些技巧的方法

// 一. JSON.stringify有两个参数，第二个参数replacer可以是数组也可以是函数，用来指定对象序列化的时候哪些属性应该被处理，哪些被排除

//  1. 当replacer是一个数组时
const obj = {
  a: 42,
  b: 30,
  c: 100,
};
JSON.stringify(obj, ['a', 'c']); // {"a":42,"c":100}

// 2.当replacer是一个函数时， 会对对象本身调用一次，然后在对对象中的每个属性各调用一次
const obj = {
  a: 42,
  b: 30,
  c: 100,
};
JSON.stringify(obj, (k, v) => {
  // 注意：第一次 k 是 undefined，v 是原对象
  if (k !== 'c') return v;
}); // "{"a":42,"b":30}"

// 二、 一元运算符 “-”
// - 运算符有反转符号位的功能，-运算符出现单数次数会转符号位，出现双次会抵消反转。比如：
1 - - 1  // 2
1 - - - 1 // 0

// 三 字位反转操作符
// ~ 返回 2 的补码，~x 大致等同于 -(x+1)
// 在 -(x+1) 中唯一能够得到 0（或者严格来说时候 -0）的 x 值是 -1，
// 也就是说 ~ 和一些数字在一起会返回一个假值 0，其他情况下则返回真值
// 比如在 JavaScript 中字符串的 indexOf 方法也遵循这一惯例，该方法在字符串中搜索指定的字符串，
// 如果找到就返回该子字符串所在的位置，否则返回 -1
// 我们知道在 JavaScript 中假值有：undefined、null、false、+0、-0、NaN、''，其他都为真值，所以负数也是真值，
// 那么我们就可以拿着 ~ 和 indexOf 一起检结果强制类型转换为 真/假 值
const str = 'hello world';
~str.indexOf('lo'); // -4，真值
if (~str.indexOf('lo')) {
  // true
  // 找到匹配
}
~str.indexOf('ol'); // 0，假值
!~str.indexOf('ol'); // true
if (!~str.indexOf('ol')) {
  // true
  // 没有找到匹配
}
// ~ 要比 >=0 和 == -1 更简洁

// 四、对象使用数组的一些方法
// 1. 使用Array.from将对象转为数组
// 2. 给对象增加迭代器。
// 具体方法：
const obj = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4,
  [Symbol.iterator]() {
    let idx = 0
    return {
      next() {
        return {
          value: obj[idx],
          done: idx++ >= obj.length,
        }
      }
    }
  }
}
// 此时对象就被添加了迭代器 可以用扩展运算符和for ... of了
let  arr = [...obj] // 1 2 3 4
for (const val of obj) {
  console.log(val)  // 1 2 3 4
}
// 还可以使用生成器返回一个迭代器，迭代器有next方法，调用next方法可以返回value和done
const obj = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4,
  [Symbol.iterator]: function* () {
    let idx = 0
    while (idx !== this.length) {
      yield this[idx++]
    }
  }
}
let arr1 = [...obj] // [1, 2, 3, 4, 5]

// 五、尾递归优化
// 针对斐波拉契数列来展示一般的递归和尾递归的区别
// 一般递归
function fibonacci(n) {
  // 第一项和第二项都返回1
  if (n === 1 || n === 2) return 1;
  // 我们只要返回 n - 1（n的前一项）与 n - 2（n的前两项）的和便是我们要的值
  return fibonacci(n - 1) + fibonacci(n - 2);
  // 这里因为层层调用，上一层需要下一层的计算结果，所以存在很多调用栈，在输入n为40次以上就爆栈了，无法拿到结果
}

// 尾递归
function feibo(n, sum1 = 1, sum2 = 1) {
  if (n === 1 || n === 2) return sum2;
  return feibo(n - 1, sum2, sum1 + sum2);
}
// 这种写法缓存了，每次计算后的值，执行效率会很高，100 次以上也会秒返回结果，这个也叫作尾递归优化
// 普通递归创建stack累积而后计算收缩，尾递归只会占用恒量的内存（和迭代一样）
// 尾递归是把变化的参数传递给递归函数的变量了。怎么写尾递归？形式上只要最后一个return语句是单纯函数就可以。如：
return tailrec(x+1);

// 下面这种则不可以。因为无法更新tailrec()函数内的实际变量，只是新建一个栈。
return tailrec(x+1) + x;

// 六、格式化金钱
// 1. 正则
function formatPrice(price) {
  return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// 2. reduce等普通方法
function formatPrice(price) {
  return String(price)
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev;
    });
}
// 3. toLocaleString
(999999999).toLocaleString(); // 999,999,999
// 当然还可以更秀一点
const options = {
  style: 'currency',
  currency: 'CNY',
};
(123456).toLocaleString('zh-CN', options); // ¥123,456.00

// 七、手机号脱敏处理

const encryptReg = (before = 3, after = 4) => {
  return new RegExp('(\\d{' + before + '})\\d*(\\d{' + after + '})');
};
// 使用：'13456789876'.replace(encryptReg(), '$1****$2') -> "134****9876"
// 发布订阅和观察者两种监听模式
// 1. 观察者模式
// 观察者模式会有 观察者 与 被观察者(观察目标) 两个对象存在，观察者可以有多个，
// 观察目标可以添加多个观察者，可以通知观察者。观察者模式是面向与目标和观察者编程的，
// 耦合目标和观察者
// 被观察者
class Subject {
  constructor() {
    this.subs = [];
  }
  add(observer) {
    this.subs.push(observer);
  }
  notify(...args) {
    this.subs.forEach(ob => ob.update(...args));
  }
}
// 观察者
class Observer {
  update(...args) {
    console.log('Observer -> update -> args', args);
  }
}

// 使用
const o1 = new Observer();
const o2 = new Observer();
const o3 = new Observer();
const o5 = new Observer();
const sub = new Subject();
// 添加观察者
sub.add(o1);
sub.add(o2);
sub.add(o3);
// 通知观察者
sub.notify('嘿嘿嘿');

// 2. 发布订阅模式
// 发布订阅模式会有一个调度中心的概念。是面向调度中心编程的，对发布者与订阅者解耦
class PubSub {
  constructor() {
    this.handlers = {};
  }
  subscribe(type, fn) {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(fn);
  }
  publish(type, ...args) {
    if (!this.handlers[type]) return;
    this.handlers[type].forEach(fn => fn(...args));
  }
}

const ps = new PubSub();

ps.subscribe('a', console.log);
ps.subscribe('a', console.log);
ps.subscribe('a', console.log);
ps.subscribe('a', console.log);
ps.publish('a', 'hello world');
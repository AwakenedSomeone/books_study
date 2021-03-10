// 类 与委托对象在代码上的具体区别

// 类 控件
// 父类
function Widget (w, h) {
  this.width = w || 50
  this.height = h || 50
  this.$elem = null
}
Widget.prototype.render = function ($where) {
  if (this.$elem) {
    this.$elem.css({
      width: this.width + 'px',
      height: this.height + 'px'
    }).appendTo($where)
  }
}

// 子类
function Button (w, h, label) {
  // 类似调用“supper”构造函数
  Widget.call(this, w, h)
  this.label = label || 'Default'
  this.$elem = $("<button>").text(this.label)
}
// 让Button继承Widget
Button.prototype = Object.create(Widget.prototype)

// 重写render
Button.prototype.render = function ($where) {
  // supper 调用
  Widget.prototype.render.call(this, $where)
  this.$elem.click(this.onClick.bind(this))
}
Button.prototype.onClick = function (evt) {
  console.log("Botton" + this.label + "clicked")
}

// 实际生成的地方
$(document).read(function () {
  var $body = $(document.body)
  var btn1 = new Button(125, 30, "Hello")
  var btn2 = new Button(150, 40, "World")

  btn1.render($body)
  btn2.render($body)
})

// class语法糖
class Widget {
  constructor(width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  }
  render($where) {
    if (this.$elem) {
      this.$elem.css({ width: this.width + "px", height: this.height + "px" }).appendTo($where);
    }
  }
}
class Button extends Widget {
  constructor(width, height, label) {
    super(width, height);
    this.label = label || "Default";
    this.$elem = $("<button>").text(this.label);
  }
  render($where) {
    super($where);
    this.$elem.click(this.onClick.bind(this));
  }
  onClick(evt) {
    console.log("Button '" + this.label + "' clicked!"); 
  }
}

$(document).ready(function () {
  var $body = $(document.body);
  var btn1 = new Button(125, 30, "Hello");
  var btn2 = new Button(150, 40, "World");
  btn1.render($body);
  btn2.render($body);
});
// 看起来用了语法糖之后，会更简洁一些。
// 委托控件对象
var Widget = {
  init: function (width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  },
  insert: function ($where) {
    if (this.$elem) {
      this.$elem.css({ width: this.width + "px", height: this.height + "px" }).appendTo($where);
    }
  }
};
var Button = Object.create(Widget);
Button.setup = function (width, height, label) { // 委托调用
  this.init(width, height);
  this.label = label || "Default";
  this.$elem = $("<button>").text(this.label);
};
Button.build = function ($where) {
  // 委托调用
  this.insert($where);
  this.$elem.click(this.onClick.bind(this));
};
Button.onClick = function (evt) {
  console.log("Button '" + this.label + "' clicked!");
};
$(document).ready(function () {
  var $body = $(document.body);
  var btn1 = Object.create(Button);
  btn1.setup(125, 30, "Hello");
  var btn2 = Object.create(Button);
  btn2.setup(150, 40, "World");
  btn1.build($body);
  btn2.build($body);
});
# v8-javascript-memory

V8 JavaScript 内存占用分析。

> 回答知乎的问题：[v8 中 Symbol() 、Object.create(null) 和 {} 的内存占用分别是多少？](https://www.zhihu.com/question/425300093/answer/1523228095)

## 步骤

1. 使用 Chrome 浏览器访问 <https://justjavac.com/v8-javascript-memory/>

1. 打开 Dev Tools，如图：

  ![](./screen.png)

  1. 选择 Memory 标签页
  1. 点击 take heap snapsshot
  1. 在过滤框中输入 `ho` 快速过滤出 holder

## 名次解释

**Shallow Size**：对象自身占用内存的大小，不包括它引用的对象。JavaScript 对象会将一些内存用于自身的说明和保存中间值。通常，只有数组和字符串会有明显的浅层大小。

**Retained Size**：这是将对象本身连同其无法从 **GC root** 到达的相关对象一起删除后释放的内存大小。

单位是字节(Byte)。

## 分析

从截图中可以看到，`Symbol()` 的内存占用是 16。

`Object.create(null)` 自身占用 12，总占用 88。

`{}` 自身占用 28，总占用 28。

继续展开你会看到其他信息：

![](./screen2.png)

1. `__proto__` 是原型链。
2. `map` 就是很多文章都在介绍的 V8 对象的黑魔法 Hidden Class。

## 使用 V8 进行调试

V8 的 `%DebugPrint()` 函数可以打印出对象的调试信息。这需要手动使用 `--is_debug=true` 参数来编译 V8。

代码：

```js
let o = {};
%DebugPrint(o);
```

运行：`d8 --allow_natives_syntax heap.js`

输出：

```plain
DebugPrint: 0x2604080c60e9: [JS_OBJECT_TYPE]
 - map: 0x2604082802d9 <Map(HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x2604082413c9 <Object map = 0x2604082801c1>
 - elements: 0x2604080406e9 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x2604080406e9 <FixedArray[0]> {}
0x2604082802d9: [Map]
 - type: JS_OBJECT_TYPE
 - instance size: 28
 - inobject properties: 4
 - elements kind: HOLEY_ELEMENTS
 - unused property fields: 4
 - enum length: invalid
 - back pointer: 0x26040804030d <undefined>
 - prototype_validity cell: 0x2604081c0451 <Cell value= 1>
 - instance descriptors (own) #0: 0x2604080401b5 <DescriptorArray[0]>
 - prototype: 0x2604082413c9 <Object map = 0x2604082801c1>
 - constructor: 0x2604082413e5 <JSFunction Object (sfi = 0x2604081c5869)>
 - dependent code: 0x2604080401ed <Other heap object (WEAK_FIXED_ARRAY_TYPE)>
 - construction counter: 0
```

**注：**虽然 node 和 deno 都支持 V8 的 `--allow_natives_syntax` 参数，但是如果你使用 node 或者 deno 运行，只能得到一行类似 `0x053bedbc1399 <Object map = 0x53b630d1d51>` 的输出。 如果想得到详细的输出，必须手动编译，并且在编译过程中增加 `--is_debug=true` 参数。

## License

本<span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Text" rel="dct:type">作品</span>由 <a xmlns:cc="https://creativecommons.org/ns#" href="https://justjavac.com" property="cc:attributionName" rel="cc:attributionURL">justjavac</a> 创作，采用<a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/">知识共享署名-非商业性使用-相同方式共享 3.0 中国大陆许可协议</a>进行许可。凡是转载的文章，翻译的文章，或者由其他作者投稿的文章，版权归原作者所有。

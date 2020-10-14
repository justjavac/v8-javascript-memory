// d8 --allow_natives_syntax heap.js

let s = Symbol();
%DebugPrint(s);

let n = Object.create(null);
%DebugPrint(n);

let o = {};
%DebugPrint(o);

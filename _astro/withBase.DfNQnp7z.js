var R={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function d(){if(x)return i;x=1;var r=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function n(u,t,e){var o=null;if(e!==void 0&&(o=""+e),t.key!==void 0&&(o=""+t.key),"key"in t){e={};for(var a in t)a!=="key"&&(e[a]=t[a])}else e=t;return t=e.ref,{$$typeof:r,type:u,key:o,ref:t!==void 0?t:null,props:e}}return i.Fragment=s,i.jsx=n,i.jsxs=n,i}var l;function v(){return l||(l=1,R.exports=d()),R.exports}var c=v();const E=/^(?:[a-z]+:)?\/\//i;function T(r){if(!r||r.startsWith("#")||r.startsWith("mailto:")||r.startsWith("tel:")||r.startsWith("data:")||r.startsWith("javascript:")||E.test(r))return r;const s="/anm-website",n=s.endsWith("/")?s:`${s}/`,u=r==="/"?"":r.replace(/^\/+/,"");return`${n}${u}`}export{c as j,T as w};

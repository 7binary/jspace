(this["webpackJsonpjspace-client"]=this["webpackJsonpjspace-client"]||[]).push([[120],{314:function(e,a){!function(e){e.languages.etlua={delimiter:{pattern:/^<%[-=]?|-?%>$/,alias:"punctuation"},"language-lua":{pattern:/[\s\S]+/,inside:e.languages.lua}},e.hooks.add("before-tokenize",(function(a){e.languages["markup-templating"].buildPlaceholders(a,"etlua",/<%[\s\S]+?%>/g)})),e.hooks.add("after-tokenize",(function(a){e.languages["markup-templating"].tokenizePlaceholders(a,"etlua")}))}(Prism)}}]);
//# sourceMappingURL=120.b80f8207.chunk.js.map
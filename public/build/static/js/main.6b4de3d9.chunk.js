(this.webpackJsonppublic=this.webpackJsonppublic||[]).push([[0],{24:function(e,t,n){e.exports=n(25)},25:function(e,t,n){"use strict";n.r(t);var a=n(14),c=n(15),r=n(22),o=n(16),i=n(23),l=n(0),s=n(17),u=n(19),p=n(5),h=n(18),b=n.n(h),m=n(2),f=(n(31),Object(m.a)(),function(e){function t(){return Object(a.a)(this,t),Object(r.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return l.createElement("div",null,l.createElement("button",{onClick:this.test()},"Test webapp"),l.createElement("p",null,"Go to git: ",l.createElement("a",{className:"git",href:"https://gitlab.stud.idi.ntnu.no/jakoblm/harmoni"},l.createElement("i",{style:{fontSize:"40px"},className:"fab fa-github"}))," "))}},{key:"test",value:function(){fetch("http://localhost:5001/harmoni-6/us-central1/webApi",{method:"POST",body:JSON.stringify({}),headers:{"Content-Type":"application/json; charset=utf-8","x-access-token":"undefined","Access-Control-Allow-Origin":"*"}}).then((function(e){return alert(e.body)})).catch((function(e){return alert("an error occured")}))}}]),t}(s.Component)),d=document.getElementById("root");d&&b.a.render(l.createElement(u.a,null,l.createElement("div",null,l.createElement(p.a,{exact:!0,path:"/",component:f}))),d)}},[[24,1,2]]]);
//# sourceMappingURL=main.6b4de3d9.chunk.js.map
var g=Object.defineProperty;var m=(l,e,t)=>e in l?g(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var u=(l,e,t)=>m(l,typeof e!="symbol"?e+"":e,t);var h=class{constructor(e=0,t){u(this,"str");u(this,"x");this.str=t,this.x=e}insert(e){return e.slice(0,this.getX())+this.getString()+e.slice(this.getX())}getString(){return this.str}getX(){return this.x}},o=class{constructor(e,t){u(this,"width");u(this,"height");u(this,"buffer");u(this,"viewport");this.width=e,this.height=t,this.buffer=new b(this),this.viewport=new _(this,"main")}render(){let e=this.viewport.getInstance();return e==null?!1:(e.innerHTML=this.buffer.flush(),!0)}},b=class{constructor(e){u(this,"view");u(this,"buf");u(this,"tags");this.view=e,this.buf=[],this.tags=[],this.resize(e.width,e.height)}setSize(e,t){return e<0||t<0?!1:(this.view.width=e,this.view.height=t,!0)}resize(e,t,i=" "){let r=this.view.width,n=this.view.height;if(i.length!=1||this.setSize(e,t)==!1)return!1;if(t>n){for(let s=n;s<t;s++)if(this.tags.push([]),this.buf.push(""),e>r)for(let a=0;a<r;a++)this.buf[s]+=i;else if(r>e)for(let a=0;a<e;a++)this.buf[s]+=i}else n>t&&(this.tags.splice(this.tags.length-(n-t),n-t),this.buf.splice(this.buf.length-(n-t),n-t));if(e>r)for(let s=0;s<t;s++)for(let a=r;a<e;a++)this.buf[s]+=i;else if(r>e)for(let s=0;s<t;s++)this.buf[s]=this.buf[s].substr(0,e);return!0}addAsciiButton(e,t,i,r=""){return this.addTwoTags(e,t,i,String.raw`<span class="asciiButton ${r}">`,String.raw`</span`)}addBold(e,t,i){return this.addTwoTags(e,t,i,"<b>","</b>")}addTwoTags(e,t,i,r,n){return!(this.addTag(new h(e,r),i)===!1||this.addTag(new h(t,n),i)===!1)}addTag(e,t){if(t<0||t>=this.view.height||e.x<0||e.x>this.view.width)return!1;if(!this.tags[t]||this.tags[t].length===0)return this.tags[t]=this.tags[t]||[],this.tags[t].push(e),!0;for(let i=0;i<this.tags[t].length;i++)if(e.x>this.tags[t][i].x)return this.tags[t].splice(i,0,e),!0;return this.tags[t].push(e),!0}write(e,t,i){let r=0,n=e.length;return i<0||i>=this.view.height||(t+n>=this.view.width&&(n-=t+n-this.view.width),t<0&&(r=-t),n<0||r>=e.length)?!1:(this.buf[i]=this.buf[i].slice(0,t)+e+this.buf[i].slice(t+1),!0)}writeArray(e,t,i){for(let r=0;r<e.length;r++)this.write(e[r],t,i+r)}flush(){let e=[];if(this.tags.length===0)return this.buf.join(`
`);e=this.buf.slice(0);for(let t=0;t<this.view.height;t++)for(let i=0;i<this.tags[t].length;i++)e[t]=this.tags[t][i].insert(e[t]);return e.join(`
`)}},_=class{constructor(e,t){u(this,"view");u(this,"location");this.view=e,this.location=t,this.hasBeenInitialized()}hasBeenInitialized(){return document.getElementById(this.location)!=null}createInstance(){return this.hasBeenInitialized()?!1:(document.body.appendChild(document.createElement("pre")).setAttribute("id",this.location),!0)}getInstance(){return this.createInstance()?document.getElementById(this.location):null}},f=new o(5,10),d=String.raw`
    _____________________________
    |:''''''''''''''''''''''''':|
    |:          _____          :|
    |:         /     \         :|
    |_________(_[   ]_)_________|
    |:¨¨¨¨¨¨¨¨¨\_____/¨¨¨¨¨¨¨¨¨:|
    |:                         :|
    |:                         :|
    |:  ___    .-"""-.    ___  :|
    |:  \  \  /\ \ \ \\  /  /  :|
    |:   }  \/\ \ \ \ \\/  {   :|
    |:   }  /\ \ \ \ \ /\  {   :|
    |:  /__/  \ \ \ \ /  \__\  :|
    |:         '-...-'         :|
    |:.........................:|
    |___________________________|
`.split(`
`).filter(l=>l.trim()!=="");f.buffer.resize(5,5);f.buffer.writeArray(d,0,0);var c=f.render();console.log("Render successful:",c);

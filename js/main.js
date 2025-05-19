function buffer(view) {
    this.view = view;
    this.buf = [];
    this.tags = [];
    this.links = [];
}

function view(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = new buffer(this);
    this.location = new location(this, "main");
}
function location(view, location) {
    this.view = view;
    this.loc = location;
    this.hasBeenInitialized = function() {
        const element = document.getElementById(location);
        if(element != null){
            return true;
        }
        return false;
    }
}

function tag(tag = "span", attr, str, x) {
    this.tag = tag;
    this.class = attr;
    this.str = str;
    this.x = x;
}

location.prototype.createInstance = function() {
    if (!this.hasBeenInitialized()){
        const element = document.body.appendChild(document.createElement("pre"));
        element.setAttribute("id", this.location);
        return true;
    }
    return false;
}
buffer.prototype.addTag = function(tag, y) {
    if(y < 0 || y >= this.height)
        return false;
    if(tag.x < 0 || tag.x > this.view.width)
        return false;
    if(this.tags[y].length == 0) {
        this.tags[y].push(tag);
        return true;
    }
    else{
        for(let i = 0; i < this.tags[y].length; i++){
            if(tag.x > this.tags[y][i].x){
                this.tags[y].splice(i,0,tag);
                return true;
            }
        }
    }
    this.tags[y].push(tag);
    return true;
}
buffer.prototype.write = function(str, x, y) {
    let indexFirst = 0;
    let indexLast = str.length;
    // outofbounds check
    // check for width and height
    if (y < 0 || y >= view.height)
        return false;

    if (x + indexLast >= view.width)
        indexLast -= (x + indexLast - view.width);

    if (x < 0)
        indexFirst = -x;

    if (indexLast < 0 || indexFirst >= str.length)
        return false;

    for (let i = indexFirst; i < indexLast; i++) {
        this.buf[y] = this.buf[y].slice(0, x) + str[i] + this.buf[y].slice(x + 1);
    }
}

buffer.prototype.writeArray = function(arr, x, y) {
    for(let i = 0; i < arr.length; i++) {
        this.write(arr[i], x, y + i)
    }
}

buffer.prototype.flush = function() {
    let cloned_buf = [];

    if (this.tags.length == 0) {
        return this.buf.join("\n");
    }
    else {
        cloned_buf = this.buf.slice(0);

        for(let y = 0; y < this.view.height; y++) {
            for(let x = 0; x < this.tags[y].length; x++){
                cloned_buf[y] = cloned_buf[y].splice(this.tags[y][x].x, 0, this.tags[y][x]);
            }
        }
        return cloned_buf;
    }
}
view.prototype.render = function() {
    this.location.createElement();
    // fetching the cloned_buf tags and creating them.
    // rather than clearing the hole screen or overwriting constans elements like texts that havent been modified, only the modified regions should be overwritten.

}

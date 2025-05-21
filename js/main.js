import { View} from "./view.js";

// Main execution code
const myView = new View(5, 10);
const arr = String.raw`
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
`.split("\n").filter(line => line.trim() !== "");
myView.buffer.writeArray(arr, 0, 0);
myView.buffer.resize(5, 10);
const success = myView.render();
console.log("Render successful:", success);

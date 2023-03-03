let stop = false;
let frameCount = 0;
let fps, fpsInterval, startTime, now, then, elapsed, callback;


// initialize the timer variables and start the animation

export function startAnimating(fps, fn) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    stop = false;
    callback = fn;
    animate();
}

 function animate() {
    
    // request another frame
    requestAnimationFrame(animate);
    
    // calc elapsed time since last loop
    
    now = Date.now();
    elapsed = now - then;
    
    // if enough time has elapsed, draw the next frame
    
    if (elapsed > fpsInterval) {
        
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        
        // Put your drawing code here
        if(typeof callback === 'function') {
            callback();
        }
    }
}

export function stopAnimation() {
    stop = true;
}

export default function getFPS() {
    return new Promise((resolve, reject) => {
        requestAnimationFrame((t0) => {
            requestAnimationFrame((t1) => {
                const fps = 1000 / (t1 - t0);
                resolve(fps);
            });
        });
    });
}

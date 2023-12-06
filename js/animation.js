document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;  // Use innerWidth for full width
        canvas.height = window.innerHeight;  // Use innerHeight for full height
    
        // Define the gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#61AFEF');
        gradient.addColorStop(0.5, '#ABB2BF');
        gradient.addColorStop(1, '#528BFF');
        ctx.strokeStyle = '#CCCCCC';
    
        // Apply the gradient as fill style
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the gradient
    
        // Redraw content
        redraw();
    }
    
    function redraw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw the gradient background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Redraw all particles or other elements
        // Note: You need to ensure the particles are redrawn with the correct colors and positions.
        // Your existing animate or draw function should handle this.
    }
    
    // Attach the resize event listener
    window.addEventListener('resize', resizeCanvas);
    
    // Initial call to resizeCanvas to set everything up correctly
    resizeCanvas();

// setup
// ctx.strokeStyle = 'gray';
// const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
// gradient.addColorStop(0, 'white');
// gradient.addColorStop(0.5, 'magenta');
// gradient.addColorStop(1, 'blue');
// ctx.fillStyle = gradient;

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 5 + 2;
        this.x = this.radius + Math.random() * this.effect.width - this.radius * 2;
        this.y = this.radius + Math.random() * this.effect.height - this.radius * 2;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        // context.stroke();
    }
    update(){
        this.x += this.vx;
        if (this.x > this.effect.width - this.radius || this.x < this.radius) {
            this.vx *= -1;
        }
        this.y += this.vy;
        if (this.y > this.effect.height - this.radius || this.y < this.radius) {
            this.vy *= -1;
        }

    }

}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 100
        this.createParticles();

    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this))
        }
    }
    handleParticles(context){
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        })
    }
    connectParticles(context){
        const maxDistance = 100; // pixels before connect
        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();

                }
            }
        }
    }

}
const effect = new Effect(canvas);
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();
});
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const joinButton = document.getElementById('join-button');
    const ctx = canvas.getContext('2d');
    let resizeTimeout;
    let color1 = '#61AFEF';
    let color2 = '#ABB2BF';
    let color3 = '#4da4be';
    let stroke = '#CCCCCC';

    joinButton.addEventListener('mouseenter', () => {
        console.log('Mouse entered the join button area');
        // You can do something here when the mouse enters the button area.
        effect.setColorScheme('#ee6217', '#dacc8a', '#be1414', '#ceb6a3');
    });
    joinButton.addEventListener('mouseleave', () => {
        console.log('Mouse left the join button area');
        // You can do something here when the mouse leaves the button area.
        effect.setColorScheme(color1, color2, color3, stroke);
    });

    class Particle {
        constructor(effect) {
            this.effect = effect;
            this.radius = Math.random() * effect.baseRadius + 2;
            this.x = this.radius + Math.random() * this.effect.width - this.radius * 2;
            this.y = this.radius + Math.random() * this.effect.height - this.radius * 2;
            this.vx = Math.random() * 4 - 2;
            this.vy = Math.random() * 4 - 2;
        }
        draw(context){
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
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

        constructor(canvas, color1, color2, color3, stroke) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.particles = [];
            this.numberOfParticles = 0;
            this.baseRadius = 1;
            this.applyDeviceSpecificLogic();
            this.setColorScheme(color1, color2, color3);
            // this.setParticleCount(50);
        }
        setColorScheme(color1, color2, color3, stroke){
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(0.5, color2);
            gradient.addColorStop(1, color3);
            ctx.strokeStyle = stroke;
            ctx.fillStyle = gradient;
        }
        applyDeviceSpecificLogic() {
            let particleCount;
            let radius;

            if (window.matchMedia('(max-width: 480px)').matches) {
                // Small Phones
                particleCount = 40;
                radius = 2;
            } else if (window.matchMedia('(min-width: 481px) and (max-width: 767px)').matches) {
                // Large Phones
                particleCount = 40;
                radius = 2;
            } else if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
                // Tablets
                particleCount = 50;
                radius = 2;
            } else if (window.matchMedia('(min-width: 1025px) and (max-width: 1440px)').matches) {
                // Laptop Screens
                particleCount = 75;
                radius = 3;
            } else if (window.matchMedia('(min-width: 1441px) and (max-width: 2560px)').matches) {
                // Large Gaming PC Screens
                particleCount = 150;
                radius = 3;
            } else if (window.matchMedia('(min-width: 2561px)').matches) {
                // Very Large Monitors/TVs
                particleCount = 200;
                radius = 5;
            } else {
                // Default for unspecified sizes
                particleCount = 1;
                radius = 5;
            }
            this.setBaseRadius(radius);
            this.setParticleCount(particleCount);
            this.createParticles();
            this.setColorScheme(color1, color2, color3, stroke);
        }
        updateDimensions(canvas) {
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            // Debugging: Log new dimensions
            console.log('Updated dimensions:', this.width, this.height);

            this.applyDeviceSpecificLogic();
        }
        setBaseRadius(radius){
            this.baseRadius = radius
        }
        setParticleCount(updatedParticles) {
            this.numberOfParticles = updatedParticles;
        }
        createParticles(){
            this.particles.length = 0;
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

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        effect.handleParticles(ctx); // Redraw particles
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;  // Use innerWidth for full width
        canvas.height = window.innerHeight;  // Use innerHeight for full height

        effect.updateDimensions(canvas);
        effect.applyDeviceSpecificLogic();
        // effect.setColorScheme();
        // const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // gradient.addColorStop(0, '#61AFEF');
        // gradient.addColorStop(0.5, '#ABB2BF');
        // gradient.addColorStop(1, '#4da4be');
        // ctx.strokeStyle = '#CCCCCC';
        // ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the gradient

        redraw();
    }


    const effect = new Effect(canvas, color1, color2, color3, stroke);

// Listen for resize events with throttle
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout); // Clear any previous timeout to reset the timer
        resizeTimeout = setTimeout(() => { // Set a new timeout
            resizeCanvas(); // Call your resize handling function
        }, 150); // Wait for 150 milliseconds of no resize event before firing
    });

// Initial call to set everything up
    resizeCanvas();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.handleParticles(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});
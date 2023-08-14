const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d'); // ctx = contexte. Permet de donner le contexte 2D 3D ou autre dans lequel se déroule le jeu.

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        
    }
};


//constantes
//Player position
const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, 'blue');

//tableau contenant les projectiles.
const projectiles = [];


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
    });
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };

    projectiles.push(new Projectile(canvas.width / 2,
    canvas.height / 2,
    5,
    'red',
    velocity
    ))
});

animate();

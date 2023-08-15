console.log(gsap)
const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d'); // ctx = contexte. Permet de donner le contexte 2D 3D ou autre dans lequel se déroule le jeu.

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.getElementById('scoreEl')
const startGameBtn = document.getElementById('startGameBtn')
const modalEl = document.getElementById('modalEl')
const finalScoreEl = document.getElementById('finalScoreEl')


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

class Enemy {
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

const friction = 0.985;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
};

//constantes/variables

//Player position
const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 10, 'white');

//tableau contenant les projectiles.
let projectiles = [];
let enemies = [];
let particles = [];

//speeds
const ballSpeed = 5;

//functions

function init() {
    player = new Player(x, y, 10, 'white');
    score = 0;
    scoreEl.innerHTML = score;

    //tableau contenant les projectiles.
    projectiles = [];
    enemies = [];
    particles = [];
}
//spawn ennemies
function spawnEnemies(params) {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;
        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 60%, 60%)`;

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
        };
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000);
}

let animationID;
let score = 0;

//game
function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();

    //create explosions
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
        else {
            particle.update();
        }
    })

    projectiles.forEach((projectile, index) => {
        projectile.update();

        //remove projectiles from the edge of the screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y - projectile.radius > canvas.height || projectile.y + projectile.radius < 0) {
            setTimeout(() => {
            projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        //death
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (dist - enemy.radius - player.radius < 1) {            
            cancelAnimationFrame(animationID);
            modalEl.style.display = 'flex';
            finalScoreEl.innerHTML = score;
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            //touching enemy ?
            if (dist - enemy.radius - projectile.radius < 1) {
                if (enemy.radius - 9 > 10) {
                    score += 50;
                    gsap.to(enemy, {radius: enemy.radius - 10})
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                else {

                    for (let i = 0; i < enemy.radius * 2; i++) {
                        particles.push(new Particle(projectile.x, projectile.y, Math.random() * 3, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 7), y: (Math.random() - 0.5) * (Math.random() * 7)}))
                    }
                    score += 100;
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                scoreEl.innerHTML = score;
            }

        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle) * ballSpeed,
        y: Math.sin(angle) * ballSpeed
    };
    
        
        projectiles.push(new Projectile(canvas.width / 2,
        canvas.height / 2,
        5,
        'white',
        velocity
        ))
})

startGameBtn.addEventListener('click', (event) => {
    init();
    animate();
    spawnEnemies();
    modalEl.style.display = 'none';
})


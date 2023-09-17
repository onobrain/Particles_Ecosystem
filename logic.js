// button to turn on and off the simulation.
const btn = document.getElementById('activate')
isOn  = true;




// Function to start or stop the simulation.
function toggleSimulation() {
    if (isOn) {
        update();
        btn.innerText = "Turn Off";
    } else {
        btn.innerText = "Turn On";
    }
}

// initial canvas.
const ctx = document.getElementById('ecosystem').getContext('2d')

//draw rectangles.
draw = (x , y , c , s) => { //x : x position | y : y position | c : color | s : size
    ctx.fillStyle = c
    ctx.fillRect(x , y , s , s)
}

// array that holds particles
particles = []

// function that returns a new particle.
particle = (x , y , c) =>{
    return {"x" : x , "y" :  y, "vx" : 0 , "vy" : 0 , "color" : c}
}

random = () => {
    return Math.random() * 400 + 50;
} //randomise positions. 

create = (number , color) =>{
    group = []
    for(let i = 0 ; i < number ; i++){
        group.push(particle(random() , random() , color))
    }
    return group;
} //create particles and store them in array.


// This is a function called 'rule' that tells us how particles from two groups should behave when they get close.
rule = (particles1 , particles2 , g) => {
    for(let i = 0 ; i < particles1.length ; i++) {
        // We start by setting up some counters for how much we want to move the particles.
        fx = 0;
        fy = 0;
        for(let j = 0 ; j < particles2.length ; j++) {
            // Let's pick two particles, one from each group.
            a = particles1[i]
            b = particles2[j]

            // Now, we want to find out how far apart these two particles are.
            dx = a.x - b.x; // This measures the horizontal (left-right) distance.
            dy = a.y - b.y; // This measures the vertical (up-down) distance.

            // We use a special math trick to calculate the total distance between the two particles.
            d = Math.sqrt(dx*dx + dy*dy);

            // If the particles are not right on top of each other (distance is greater than 0),
            // we calculate a force to push them apart.
            if (d > 0 && d < 80) {
                F = g * 1 / d; // We calculate the force based on their distance.

                // We calculate how much we want to move particle A left and right (fx) and up and down (fy).
                fx += (F * dx); // Horizontal force.
                fy += (F * dy); // Vertical force.
            }
        }
        // Finally, we move particle A based on the forces we calculated.
        a.vx = (a.vx + fx) * .5
        a.vy = (a.vy + fy) * .5
        a.x += a.vx; // Move left or right.
        a.y += a.vy; // Move up or down.
        if(a.x <= 0 || a.x >= 500) {a.vx *= -1}
        if(a.y <= 0 || a.y >= 500) {a.vy *= -1}
    }
}


// Limit the number of particles to a reasonable amount.
const numParticles = 70;
yellow = create(numParticles * 2, "yellow")
red = create(numParticles, "red")
green = create(numParticles, "green")
white = create(numParticles , "white")


 
// Reduce the number of simulation iterations.
const simulationStep = 5; // Adjust this value as needed.
let simulationFrame = 0;

function update() {
    if (!isOn) return;
    
    ctx.clearRect(0, 0, 500, 500);

    // Only run the simulation every few frames to reduce computation.
    if (simulationFrame % simulationStep === 0) {
        // rule(red, green, -1.5);
        // rule(white, yellow, -1.5);
        // rule(yellow, yellow, 1);
        // rule(red, white, 2);
        // rule(green, green, -1);
        // rule(yellow, green, 1);
        // rule(white, white, -1);
        // rule(white, yellow, -2);


        rule(red, green, -1.5);
        rule(white, yellow, -1.5);
        rule(yellow, yellow, 1);
        rule(green, white, -2);
        rule(green, green, -1);
        rule(yellow, green, 1);
        rule(white, white, -1);
        rule(white, yellow, -2);

                                                                    
    }

    draw(0, 0, "black", 500);
    for (let i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, 5);
    }

    simulationFrame++;

    requestAnimationFrame(update);
}

// add particles to the game
particles = particles.concat(yellow , red , green , white)

// Initially, set the button text and start the simulation if isOn is true.
toggleSimulation();

btn.addEventListener('click', () => {
    isOn = !isOn; // Toggle the value of isOn (true to false or false to true).
    toggleSimulation(); // Call the function to start or stop the simulation.
});




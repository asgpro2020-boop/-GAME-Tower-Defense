// ============================================================================
// TOWER DEFENSE GAME - Complete Implementation
// HTML5 Canvas Game with Full Tower Defense Mechanics
// ============================================================================

// ============================================================================
// SECTION 1: GAME STATE & CONFIGURATION
// ============================================================================

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 40;
const ROWS = CANVAS_HEIGHT / GRID_SIZE;
const COLS = CANVAS_WIDTH / GRID_SIZE;

// Difficulty Settings
const DIFFICULTIES = {
    easy: {
        healthMultiplier: 0.8,
        speedMultiplier: 0.85,
        startingGold: 600,
        goldMultiplier: 1.2,
        label: "Easy"
    },
    normal: {
        healthMultiplier: 1.0,
        speedMultiplier: 1.0,
        startingGold: 500,
        goldMultiplier: 1.0,
        label: "Normal"
    },
    hard: {
        healthMultiplier: 1.3,
        speedMultiplier: 1.2,
        startingGold: 400,
        goldMultiplier: 0.9,
        label: "Hard"
    }
};

// Tower Definitions
const TOWER_TYPES = {
    archer: {
        name: "Archer Tower",
        cost: 100,
        damage: 15,
        range: 120,
        attackSpeed: 1.5,
        color: "#00ff00",
        icon: "🏹",
        description: "Balanced attacker"
    },
    laser: {
        name: "Laser Tower",
        cost: 150,
        damage: 25,
        range: 100,
        attackSpeed: 1.2,
        color: "#ff0000",
        icon: "⚡",
        description: "High damage"
    },
    ice: {
        name: "Ice Tower",
        cost: 120,
        damage: 8,
        range: 130,
        attackSpeed: 0.8,
        color: "#00ccff",
        icon: "❄️",
        description: "Slows enemies"
    }
};

// Enemy Definitions
const ENEMY_TYPES = {
    light: {
        name: "Light Enemy",
        baseHealth: 30,
        baseSpeed: 1.5,
        goldReward: 25,
        size: 12,
        color: "#00dd00",
        spawnChance: 0.6
    },
    heavy: {
        name: "Heavy Enemy",
        baseHealth: 80,
        baseSpeed: 0.7,
        goldReward: 50,
        size: 20,
        color: "#ff3333",
        spawnChance: 0.3
    },
    fast: {
        name: "Fast Enemy",
        baseHealth: 40,
        baseSpeed: 2.5,
        goldReward: 35,
        size: 8,
        color: "#ffaa00",
        spawnChance: 0.1
    }
};

// Enemy Path (waypoints)
const ENEMY_PATH = [
    { x: -40, y: 150 },
    { x: 100, y: 150 },
    { x: 100, y: 450 },
    { x: 700, y: 450 },
    { x: 700, y: 200 },
    { x: 840, y: 200 }
];

// Game State
let gameState = {
    gold: 500,
    lives: 20,
    wave: 0,
    gameRunning: false,
    gamePaused: false,
    difficulty: "normal",
    totalEnemiesDefeated: 0,
    totalGoldEarned: 0,
    waveActive: false,
    spawnCounter: 0,
    spawnRate: 60
};

let towers = [];
let enemies = [];
let projectiles = [];
let particles = [];
let selectedTower = null;
let selectedTowerType = null;

// ============================================================================
// SECTION 2: ENEMY CLASS
// ============================================================================

class Enemy {
    constructor(type = "light") {
        const typeData = ENEMY_TYPES[type];
        this.type = type;
        this.pathIndex = 0;
        this.distanceAlongPath = 0;
        
        // Get difficulty multipliers
        const diff = DIFFICULTIES[gameState.difficulty];
        
        // Scale enemy stats with wave
        const waveScaling = 1 + (gameState.wave * 0.1); // 10% per wave
        const speedScaling = 1 + (gameState.wave * 0.05); // 5% per wave
        
        this.health = typeData.baseHealth * diff.healthMultiplier * waveScaling;
        this.maxHealth = this.health;
        this.speed = typeData.baseSpeed * diff.speedMultiplier * speedScaling;
        this.baseSpeed = this.speed;
        this.goldReward = typeData.goldReward;
        this.size = typeData.size;
        this.color = typeData.color;
        
        // Slow effect
        this.slowFactor = 1;
        this.slowTimer = 0;
        
        this.x = ENEMY_PATH[0].x;
        this.y = ENEMY_PATH[0].y;
    }

    update() {
        // Handle slow effect
        if (this.slowTimer > 0) {
            this.slowTimer--;
            this.slowFactor = 0.5;
        } else {
            this.slowFactor = 1;
        }

        // Move along path
        const currentSpeed = this.speed * this.slowFactor;
        this.distanceAlongPath += currentSpeed;

        // Calculate position along path
        let totalDistance = 0;
        for (let i = 0; i < ENEMY_PATH.length - 1; i++) {
            const p1 = ENEMY_PATH[i];
            const p2 = ENEMY_PATH[i + 1];
            const segmentDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            
            if (totalDistance + segmentDistance >= this.distanceAlongPath) {
                const segmentProgress = (this.distanceAlongPath - totalDistance) / segmentDistance;
                this.x = p1.x + (p2.x - p1.x) * segmentProgress;
                this.y = p1.y + (p2.y - p1.y) * segmentProgress;
                this.pathIndex = i;
                return true;
            }
            
            totalDistance += segmentDistance;
        }

        // Reached end of path
        return false;
    }

    draw(ctx) {
        // Draw enemy
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw health bar
        const barWidth = this.size * 2.5;
        const barHeight = 4;
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 12, barWidth, barHeight);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.25 ? "#ffaa00" : "#ff0000";
        ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 12, barWidth * healthPercent, barHeight);

        // Draw slow indicator
        if (this.slowTimer > 0) {
            ctx.strokeStyle = "#00ccff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    takeDamage(damage, isCritical = false) {
        this.health -= damage;
        
        // Create floating damage text
        const color = isCritical ? "#ffff00" : "#ff6666";
        particles.push(new Particle(this.x, this.y, damage.toFixed(0), color));
    }

    applySlowEffect(duration = 3) {
        this.slowTimer = Math.max(this.slowTimer, duration * 60); // Convert to frames (60 FPS)
    }

    isDead() {
        return this.health <= 0;
    }
}

// ============================================================================
// SECTION 3: TOWER CLASS
// ============================================================================

class Tower {
    constructor(x, y, type = "archer") {
        const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
        
        this.x = gridX + GRID_SIZE / 2;
        this.y = gridY + GRID_SIZE / 2;
        this.type = type;
        
        const typeData = TOWER_TYPES[type];
        this.name = typeData.name;
        this.baseCost = typeData.cost;
        this.baseDamage = typeData.damage;
        this.baseRange = typeData.range;
        this.baseAttackSpeed = typeData.attackSpeed;
        this.color = typeData.color;
        
        this.level = 1;
        this.damage = this.baseDamage;
        this.range = this.baseRange;
        this.attackSpeed = this.baseAttackSpeed;
        this.attackCooldown = 0;
        
        this.totalCost = this.baseCost;
    }

    update(enemies) {
        // Cool down attack timer
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        } else {
            // Find enemy in range
            let targetEnemy = null;
            let minDistance = this.range;

            for (let enemy of enemies) {
                const distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    targetEnemy = enemy;
                }
            }

            if (targetEnemy) {
                this.attack(targetEnemy);
                this.attackCooldown = (1 / this.attackSpeed) * 60; // Convert to frames
            }
        }
    }

    attack(target) {
        // Create projectile
        projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.type));
    }

    upgrade() {
        if (this.level >= 5) return false;

        // Upgrade cost formula: base cost * 1.3^(level)
        const upgradeCost = Math.ceil(this.baseCost * Math.pow(1.3, this.level));

        if (gameState.gold < upgradeCost) {
            return false;
        }

        gameState.gold -= upgradeCost;
        this.level++;
        this.totalCost += upgradeCost;

        // Apply stat increases
        this.damage = this.baseDamage * (1 + (this.level - 1) * 0.2); // +20% per level
        this.range = this.baseRange * (1 + (this.level - 1) * 0.1); // +10% per level
        this.attackSpeed = this.baseAttackSpeed * (1 + (this.level - 1) * 0.15); // +15% per level

        return true;
    }

    getUpgradeCost() {
        if (this.level >= 5) return 0;
        return Math.ceil(this.baseCost * Math.pow(1.3, this.level));
    }

    sell() {
        // Recover 75% of investment
        const refund = Math.ceil(this.totalCost * 0.75);
        gameState.gold += refund;
        return refund;
    }

    draw(ctx) {
        // Draw tower base
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Draw tower level indicator
        ctx.fillStyle = "#ffff00";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.level, this.x, this.y);

        // Draw range circle if selected
        if (selectedTower === this) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();

            // Highlight selected tower
            ctx.strokeStyle = "#ffff00";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// ============================================================================
// SECTION 4: PROJECTILE CLASS
// ============================================================================

class Projectile {
    constructor(x, y, target, damage, towerType = "archer") {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.towerType = towerType;
        this.speed = 5;
        this.size = 5;
        this.traveled = 0;
        this.maxRange = 500; // Max distance before disappearing
    }

    update() {
        if (!this.target) return false;

        // Calculate direction to target
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            // Hit target
            this.target.takeDamage(this.damage);

            // Special effects based on tower type
            if (this.towerType === "ice") {
                this.target.applySlowEffect(3);
            }

            // Create impact particle
            particles.push(new Particle(this.target.x, this.target.y, "✦", this.towerType === "laser" ? "#ff0000" : "#ffaa00"));

            return false; // Remove projectile
        }

        // Move towards target
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
        this.traveled += this.speed;

        // Remove if traveled too far
        return this.traveled < this.maxRange;
    }

    draw(ctx) {
        ctx.fillStyle = this.towerType === "laser" ? "#ff0000" : this.towerType === "ice" ? "#00ccff" : "#ffff00";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

// ============================================================================
// SECTION 5: PARTICLE CLASS (Visual Effects)
// ============================================================================

class Particle {
    constructor(x, y, text = "", color = "#ffffff") {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.age = 0;
        this.lifetime = 60; // Frames
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        return this.age < this.lifetime;
    }

    draw(ctx) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

// ============================================================================
// SECTION 6: WAVE MANAGER
// ============================================================================

function startWave() {
    if (gameState.waveActive) return;
    if (!gameState.gameRunning) return;

    gameState.wave++;
    gameState.waveActive = true;
    gameState.spawnCounter = 0;

    // Adjust spawn rate based on wave
    gameState.spawnRate = Math.max(20, 60 - (gameState.wave * 2));

    updateUI();
}

function spawnEnemy() {
    const rand = Math.random();
    let type = "light";
    
    // Vary enemy spawn based on wave
    if (rand < 0.2) {
        type = "fast";
    } else if (rand < 0.5) {
        type = "heavy";
    }

    // Increase heavy/fast enemies in later waves
    if (gameState.wave > 10) {
        if (rand < 0.3) type = "fast";
        if (rand < 0.6) type = "heavy";
    }

    enemies.push(new Enemy(type));
}

// ============================================================================
// SECTION 7: GAME LOOP FUNCTIONS
// ============================================================================

function update() {
    if (gameState.gamePaused || !gameState.gameRunning) return;

    // Spawn enemies
    if (gameState.waveActive) {
        gameState.spawnCounter++;
        if (gameState.spawnCounter >= gameState.spawnRate) {
            spawnEnemy();
            gameState.spawnCounter = 0;
        }
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const stillOnMap = enemy.update();

        if (!stillOnMap) {
            // Enemy reached end
            gameState.lives--;
            enemies.splice(i, 1);

            if (gameState.lives <= 0) {
                endGame();
            }
        } else if (enemy.isDead()) {
            // Enemy killed
            gameState.gold += enemy.goldReward;
            gameState.totalGoldEarned += enemy.goldReward;
            gameState.totalEnemiesDefeated++;
            
            // Create gold particles
            for (let j = 0; j < 3; j++) {
                particles.push(new Particle(enemy.x, enemy.y, "💰", "#ffd700"));
            }
            
            enemies.splice(i, 1);
        }
    }

    // Check if wave ended (no more enemies spawning and none on map)
    if (gameState.waveActive && gameState.spawnCounter === 0 && gameState.spawnRate > 0) {
        if (enemies.length === 0 && gameState.spawnCounter > gameState.spawnRate * 2) {
            gameState.waveActive = false;
        }
    }

    // Update towers
    for (let tower of towers) {
        tower.update(enemies);
    }

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        if (!projectile.update()) {
            projectiles.splice(i, 1);
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (!particle.update()) {
            particles.splice(i, 1);
        }
    }

    // Victory condition (reach wave 100)
    if (gameState.wave >= 100 && enemies.length === 0 && !gameState.waveActive) {
        showVictory();
    }

    updateUI();
}

function draw(ctx) {
    // Clear canvas
    ctx.fillStyle = "#0a1f2e";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = "rgba(100, 150, 200, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }

    // Draw enemy path
    ctx.strokeStyle = "rgba(255, 200, 0, 0.2)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ENEMY_PATH[0].x, ENEMY_PATH[0].y);
    for (let i = 1; i < ENEMY_PATH.length; i++) {
        ctx.lineTo(ENEMY_PATH[i].x, ENEMY_PATH[i].y);
    }
    ctx.stroke();

    // Draw towers
    for (let tower of towers) {
        tower.draw(ctx);
    }

    // Draw projectiles
    for (let projectile of projectiles) {
        projectile.draw(ctx);
    }

    // Draw enemies
    for (let enemy of enemies) {
        enemy.draw(ctx);
    }

    // Draw particles
    for (let particle of particles) {
        particle.draw(ctx);
    }

    // Draw base
    ctx.fillStyle = "#FF6B6B";
    ctx.fillRect(ENEMY_PATH[ENEMY_PATH.length - 1].x - 20, ENEMY_PATH[ENEMY_PATH.length - 1].y - 20, 40, 40);
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 3;
    ctx.strokeRect(ENEMY_PATH[ENEMY_PATH.length - 1].x - 20, ENEMY_PATH[ENEMY_PATH.length - 1].y - 20, 40, 40);
}

function gameLoop() {
    update();
    
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    draw(ctx);
    
    requestAnimationFrame(gameLoop);
}

// ============================================================================
// SECTION 8: UI HANDLING
// ============================================================================

function updateUI() {
    document.getElementById("goldDisplay").textContent = gameState.gold;
    document.getElementById("waveDisplay").textContent = gameState.wave;
    document.getElementById("livesDisplay").textContent = gameState.lives;
    document.getElementById("enemyDisplay").textContent = enemies.length;
}

function showTowerStats(tower) {
    const upgradeCost = tower.getUpgradeCost();
    const stats = `
        <div><strong>${tower.name}</strong></div>
        <div style="margin-top: 8px;">Level: <strong>${tower.level}/5</strong></div>
        <div style="margin-top: 8px;">
            <div style="margin: 5px 0;">Damage: <strong>${tower.damage.toFixed(1)}</strong></div>
            <div class="stat-bar"><div class="stat-fill" style="width: ${tower.damage / 30 * 100}%"></div></div>
        </div>
        <div style="margin-top: 8px;">
            <div style="margin: 5px 0;">Range: <strong>${tower.range.toFixed(0)}</strong></div>
            <div class="stat-bar"><div class="stat-fill" style="width: ${tower.range / 150 * 100}%"></div></div>
        </div>
        <div style="margin-top: 8px;">
            <div style="margin: 5px 0;">Speed: <strong>${tower.attackSpeed.toFixed(2)}/s</strong></div>
            <div class="stat-bar"><div class="stat-fill" style="width: ${tower.attackSpeed / 2 * 100}%"></div></div>
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2);">
            Total Invested: <strong>${tower.totalCost}</strong> gold
        </div>
        ${upgradeCost > 0 ? `<div style="margin-top: 8px; color: ${gameState.gold >= upgradeCost ? '#4caf50' : '#ff6666'};">Upgrade Cost: <strong>${upgradeCost}</strong></div>` : '<div style="margin-top: 8px; color: #ffaa00;">Max Level!</div>'}
    `;
    document.getElementById("towerStats").innerHTML = stats;

    // Update upgrade button
    if (tower.level >= 5) {
        document.getElementById("upgradeBtn").disabled = true;
        document.getElementById("upgradeMessage").textContent = "Tower at max level!";
    } else if (gameState.gold < upgradeCost) {
        document.getElementById("upgradeBtn").disabled = true;
        document.getElementById("upgradeMessage").textContent = `Need ${upgradeCost - gameState.gold} more gold`;
    } else {
        document.getElementById("upgradeBtn").disabled = false;
        document.getElementById("upgradeMessage").textContent = `Costs ${upgradeCost} gold`;
    }
}

function endGame() {
    gameState.gameRunning = false;
    const modal = document.getElementById("gameOverModal");
    document.getElementById("gameOverStats").textContent = 
        `Final Wave: ${gameState.wave} | Total Gold: ${gameState.totalGoldEarned} | Enemies Defeated: ${gameState.totalEnemiesDefeated}`;
    modal.classList.add("active");
}

function showVictory() {
    gameState.gameRunning = false;
    const modal = document.getElementById("victoryModal");
    document.getElementById("victoryStats").textContent = 
        `Final Wave: ${gameState.wave} | Total Gold: ${gameState.totalGoldEarned} | Enemies Defeated: ${gameState.totalEnemiesDefeated}`;
    modal.classList.add("active");
}

// ============================================================================
// SECTION 9: EVENT HANDLING
// ============================================================================

function setupCanvasEvents() {
    const canvas = document.getElementById("gameCanvas");

    canvas.addEventListener("click", (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / canvas.clientWidth;
        const scaleY = CANVAS_HEIGHT / canvas.clientHeight;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check if clicking on tower (for selection)
        for (let tower of towers) {
            const distance = Math.hypot(tower.x - x, tower.y - y);
            if (distance < 20) {
                selectedTower = tower;
                showTowerStats(tower);
                return;
            }
        }

        // Deselect if clicking on empty space
        selectedTower = null;
        document.getElementById("towerStats").innerHTML = '<div style="opacity: 0.6; text-align: center;">Click a tower to view stats</div>';

        // Place tower if one is selected
        if (selectedTowerType) {
            const towerType = selectedTowerType;
            const typeData = TOWER_TYPES[towerType];

            // Check if enough gold
            if (gameState.gold < typeData.cost) {
                showMessage("Not enough gold!", "error");
                return;
            }

            // Check if valid placement (not overlapping with other towers)
            const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
            const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;

            for (let tower of towers) {
                if (Math.abs(tower.x - (gridX + GRID_SIZE / 2)) < GRID_SIZE / 2 &&
                    Math.abs(tower.y - (gridY + GRID_SIZE / 2)) < GRID_SIZE / 2) {
                    showMessage("Tower already here!", "error");
                    return;
                }
            }

            // Check if in bounds
            if (gridX < 0 || gridX >= CANVAS_WIDTH || gridY < 0 || gridY >= CANVAS_HEIGHT) {
                showMessage("Invalid placement!", "error");
                return;
            }

            // Place tower
            towers.push(new Tower(x, y, towerType));
            gameState.gold -= typeData.cost;
            showMessage(`${typeData.name} placed!`, "success");
            updateUI();
        }
    });
}

function setupUIEvents() {
    // Difficulty buttons
    document.querySelectorAll(".btn-difficulty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-difficulty").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            gameState.difficulty = e.target.dataset.difficulty;
        });
    });

    // Tower selection buttons
    document.getElementById("archerBtn").addEventListener("click", () => {
        selectedTowerType = selectedTowerType === "archer" ? null : "archer";
        updateTowerButtonStates();
    });

    document.getElementById("laserBtn").addEventListener("click", () => {
        selectedTowerType = selectedTowerType === "laser" ? null : "laser";
        updateTowerButtonStates();
    });

    document.getElementById("iceBtn").addEventListener("click", () => {
        selectedTowerType = selectedTowerType === "ice" ? null : "ice";
        updateTowerButtonStates();
    });

    // Game control buttons
    document.getElementById("startWaveBtn").addEventListener("click", () => {
        if (!gameState.gameRunning) {
            gameState.gameRunning = true;
            gameState.gamePaused = false;
            document.getElementById("pauseOverlay").classList.remove("active");
            updateUI();
        }
        startWave();
    });

    document.getElementById("pauseBtn").addEventListener("click", () => {
        if (gameState.gameRunning) {
            gameState.gamePaused = !gameState.gamePaused;
            document.getElementById("pauseOverlay").classList.toggle("active", gameState.gamePaused);
        }
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
        location.reload();
    });

    // Tower upgrade/sell buttons
    document.getElementById("upgradeBtn").addEventListener("click", () => {
        if (selectedTower) {
            if (selectedTower.upgrade()) {
                showMessage(`Upgraded to level ${selectedTower.level}!`, "success");
                showTowerStats(selectedTower);
            } else {
                showMessage("Cannot upgrade!", "error");
            }
            updateUI();
        }
    });

    document.getElementById("sellBtn").addEventListener("click", () => {
        if (selectedTower) {
            const refund = selectedTower.sell();
            towers.splice(towers.indexOf(selectedTower), 1);
            selectedTower = null;
            showMessage(`Tower sold for ${refund} gold!`, "success");
            document.getElementById("towerStats").innerHTML = '<div style="opacity: 0.6; text-align: center;">Click a tower to view stats</div>';
            updateUI();
        }
    });
}

function updateTowerButtonStates() {
    document.getElementById("archerBtn").classList.toggle("selected", selectedTowerType === "archer");
    document.getElementById("laserBtn").classList.toggle("selected", selectedTowerType === "laser");
    document.getElementById("iceBtn").classList.toggle("selected", selectedTowerType === "ice");
}

function showMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;
    
    const gameHeader = document.querySelector(".game-header");
    gameHeader.insertAdjacentElement("afterend", message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

function resizeCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const container = canvas.parentElement;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Set display size
    const rect = container.getBoundingClientRect();
    const scale = Math.min(rect.width / CANVAS_WIDTH, rect.height / CANVAS_HEIGHT);
    canvas.style.width = (CANVAS_WIDTH * scale) + "px";
    canvas.style.height = (CANVAS_HEIGHT * scale) + "px";
}

// ============================================================================
// SECTION 10: INITIALIZE GAME
// ============================================================================

window.addEventListener("DOMContentLoaded", () => {
    // Setup canvas
    const canvas = document.getElementById("gameCanvas");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Setup events
    setupCanvasEvents();
    setupUIEvents();

    // Initialize game state
    gameState.gold = DIFFICULTIES[gameState.difficulty].startingGold;
    updateUI();

    // Start game loop
    gameLoop();
});

// Handle window resize for canvas scaling
window.addEventListener("resize", () => {
    resizeCanvas();
});

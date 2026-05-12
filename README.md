# Tower Defense Game

A complete, browser-based Tower Defense game built with HTML5, CSS3, and vanilla JavaScript. No frameworks required!

## 🎮 Features

### Core Gameplay
- **Real-time Tower Defense**: Place and upgrade towers to defend against waves of enemies
- **Endless Wave System**: Waves continue indefinitely with increasing difficulty
- **3 Difficulty Levels**: Easy, Normal, and Hard with different enemy scaling
- **Multiple Tower Types**: Archer, Laser, and Ice towers with unique abilities
- **Multiple Enemy Types**: Light, Heavy, and Fast enemies with different stats
- **Wave Progression**: Enemies become stronger and faster each wave
- **Currency System**: Earn gold by defeating enemies, spend it to build towers

### Game Mechanics
- **Tower Upgrades**: Upgrade towers to increase damage, range, and attack speed
- **Tower Selling**: Recover some gold by selling unwanted towers
- **Enemy Slowing**: Ice towers slow enemies to 50% speed for 3 seconds
- **Health System**: 20 lives, lose when enemies reach the base
- **Scaling Difficulty**: Wave multipliers increase enemy stats progressively

### Visual Features
- **HTML5 Canvas Rendering**: Smooth, real-time graphics
- **Grid-based Placement**: Visual grid overlay for tower placement
- **Animated Effects**: Particles on enemy deaths and projectile impacts
- **Range Visualization**: See tower attack ranges when selected
- **Responsive Design**: Works on desktop and tablet screens

## 🎯 How to Play

1. **Start the Game**: Open `index.html` in a modern web browser
2. **Select Difficulty**: Click "Change Difficulty" to choose your challenge level
3. **Build Towers**: 
   - Click a tower type from the right sidebar
   - Click on the map to place it (green = valid, red = invalid)
4. **Start Waves**: Click "Start Wave" to begin spawning enemies
5. **Defend Your Base**: Earn gold by defeating enemies
6. **Upgrade Towers**: Select a tower and click "Upgrade Tower" to make it stronger
7. **Survive**: Keep your lives above 0 and progress as far as you can!

## 🏗️ Tower Types

### Archer Tower (Cost: 100 gold)
- **Damage**: Medium (15 base)
- **Range**: Large (120 pixels)
- **Attack Speed**: Medium (1.5/second)
- **Description**: Well-rounded tower, good for general defense

### Laser Tower (Cost: 150 gold)
- **Damage**: High (25 base)
- **Range**: Medium (100 pixels)
- **Attack Speed**: Fast (1.2/second)
- **Description**: High damage output, best for tough enemies

### Ice Tower (Cost: 120 gold)
- **Damage**: Low (8 base)
- **Range**: Large (130 pixels)
- **Attack Speed**: Slow (0.8/second)
- **Special**: Slows enemies to 50% speed
- **Description**: Control enemy movement, weaken their advance

## 👾 Enemy Types

### Light Enemy
- **Health**: 30 (scales with wave)
- **Speed**: 1.5 (medium)
- **Gold Reward**: 25 gold
- **Size**: Small
- **Color**: Green

### Heavy Enemy
- **Health**: 80 (scales with wave)
- **Speed**: 0.7 (slow)
- **Gold Reward**: 50 gold
- **Size**: Large
- **Color**: Red

### Fast Enemy
- **Health**: 40 (scales with wave)
- **Speed**: 2.5 (fast)
- **Gold Reward**: 35 gold
- **Size**: Tiny
- **Color**: Orange

## 🎛️ Difficulty Levels

### Easy
- Enemy Health: 80% of Normal
- Enemy Speed: 85% of Normal
- Starting Gold: 600
- Gold Multiplier: 1.2x

### Normal
- Enemy Health: 100% baseline
- Enemy Speed: 100% baseline
- Starting Gold: 500
- Gold Multiplier: 1.0x

### Hard
- Enemy Health: 130% of Normal
- Enemy Speed: 120% of Normal
- Starting Gold: 400
- Gold Multiplier: 0.9x

## 📊 Game Progression

Each wave:
- Spawn rate increases (enemies appear faster)
- More enemies spawn
- Enemy health scales by 10% per wave
- Enemy speed scales by 5% per wave
- Tower type mix changes (more heavy/fast enemies in later waves)

Example progression:
- **Wave 1**: 5 enemies, mostly light
- **Wave 5**: 15 enemies, mixed types
- **Wave 20**: 45 enemies, mostly heavy/fast

## 🔧 Upgrade System

Each tower can be upgraded up to level 5. Upgrades increase:
- **Damage**: +20% per level
- **Range**: +10% per level
- **Attack Speed**: +15% per level
- **Upgrade Cost**: Increases exponentially by 1.3x per level

Example Archer Tower:
- Level 1: Cost 100, Damage 15, Range 120
- Level 2: Cost 75 upgrade, Damage 18, Range 132
- Level 5: Cost 250 upgrade total, Damage 24, Range 156

## 🎨 Code Structure

### Organized Modules
```
game.js
├── Game State & Configuration
├── Wave Manager
├── Enemy Class
├── Tower Class
├── Projectile Class
├── Particle Class
├── Rendering & Canvas
├── Game Loop
├── UI Handling
├── Sound Effects
└── Initialize Game
```

### Key Classes
- **Enemy**: Handles enemy movement, health, and death
- **Tower**: Manages tower targeting, attacks, and upgrades
- **Projectile**: Tracks projectile movement and hits
- **Particle**: Creates visual effects

## 💾 Saving/Loading

Game state is not persistent between sessions (stored in memory only). In a production version, you could add:
- Local storage for high scores
- Player statistics
- Custom tower configurations

## 🚀 Performance

- 60 FPS target (adaptive)
- Canvas rendering for smooth animation
- Efficient collision detection
- Dead reckoning for enemy movement

## 🌐 Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 Gradients
- CSS3 Flexbox

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

The game is responsive and works on:
- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Android tablets)
- Scales UI and canvas appropriately

## 🔊 Sound Effects

The game includes placeholder audio for:
- Tower placement
- Enemy kills
- Tower upgrades
- Game over

Replace the base64 WAV data in `game.js` with actual audio files for better sounds.

## 🎓 Learning Resources

This code is beginner-friendly and demonstrates:
- Object-oriented programming (Classes)
- Canvas API usage
- Game loop implementation
- Collision detection
- Event handling
- DOM manipulation
- Performance optimization

## 📝 Future Enhancements

Possible additions:
- More tower types (Missile, Sniper, Inferno)
- Boss enemies every 10 waves
- Tower abilities/special attacks
- Leaderboard with local storage
- Multiple maps with different paths
- Pause menu with settings
- Keyboard shortcuts
- Fullscreen support
- Mobile touch controls

## 📄 License

Free to use, modify, and distribute for educational purposes.

## 🤝 Contributing

Feel free to fork and improve! Suggestions for improvements:
1. Better graphics and animations
2. Mobile optimization
3. Additional tower/enemy types
4. Sound effect library
5. Procedural map generation

---

**Enjoy the game! 🎮**

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Airplane from './components/Airplane';
import Cloud from './components/Cloud';
import ScoreBoard from './components/ScoreBoard';

const GRAVITY = 0.6;
const JUMP_STRENGTH = -8;
const OBSTACLE_SPEED = 3;
const OBSTACLE_SPAWN_RATE = 1500; // ms

function App() {
  const [gameDimensions, setGameDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
  const [planeY, setPlaneY] = useState(window.innerHeight / 2);
  const [velocity, setVelocity] = useState(0);
  const [clouds, setClouds] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const requestRef = useRef();
  const lastTimeRef = useRef();
  const spawnTimerRef = useRef(0);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setGameDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setGameState('PLAYING');
    setPlaneY(gameDimensions.height / 2);
    setVelocity(0);
    setClouds([]);
    setScore(0);
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const jump = () => {
    if (gameState === 'PLAYING') {
      setVelocity(JUMP_STRENGTH);
    } else if (gameState !== 'PLAYING') {
      startGame();
    }
  };

  const gameLoop = useCallback((time) => {
    // This loop is replaced by the ref-based updateGame for stability, 
    // but kept here if needed for simple state updates. 
    // We rely on updateGame below.
  }, []);

  // Ref-based game loop for stability
  const gameStateRef = useRef({
    planeY: window.innerHeight / 2,
    velocity: 0,
    clouds: [],
    score: 0,
    isPlaying: false,
  });

  // Update refs on resize (optional, but good for boundaries)
  useEffect(() => {
    if (gameState === 'START') {
      setPlaneY(gameDimensions.height / 2);
    }
  }, [gameDimensions, gameState]);

  const updateGame = (time) => {
    if (!gameStateRef.current.isPlaying) return;

    const height = window.innerHeight;
    const width = window.innerWidth;

    // Update Physics
    gameStateRef.current.velocity += GRAVITY;
    gameStateRef.current.planeY += gameStateRef.current.velocity;

    // Boundaries
    if (gameStateRef.current.planeY > height - 30 || gameStateRef.current.planeY < 0) {
      gameOver();
      return;
    }

    // Move Clouds
    gameStateRef.current.clouds.forEach(cloud => {
      cloud.x -= OBSTACLE_SPEED;
    });

    // Remove off-screen clouds
    gameStateRef.current.clouds = gameStateRef.current.clouds.filter(c => c.x > -100);

    // Spawn Clouds
    if (time - lastTimeRef.current > OBSTACLE_SPAWN_RATE) {
      lastTimeRef.current = time;
      const randomY = Math.random() * (height - 100);
      gameStateRef.current.clouds.push({ id: Date.now(), x: width, y: randomY, passed: false });
    }

    // Collision Detection
    const planeRect = { x: 100, y: gameStateRef.current.planeY, w: 40, h: 30 };

    for (const cloud of gameStateRef.current.clouds) {
      const cloudRect = { x: cloud.x, y: cloud.y, w: 80, h: 50 };

      if (
        planeRect.x < cloudRect.x + cloudRect.w &&
        planeRect.x + planeRect.w > cloudRect.x &&
        planeRect.y < cloudRect.y + cloudRect.h &&
        planeRect.y + planeRect.h > cloudRect.y
      ) {
        gameOver();
        return;
      }

      // Scoring
      if (!cloud.passed && cloud.x + cloudRect.w < planeRect.x) {
        cloud.passed = true;
        gameStateRef.current.score += 1;
        setScore(gameStateRef.current.score); // Sync score for UI
      }
    }

    // Sync State for Render
    setPlaneY(gameStateRef.current.planeY);
    setClouds([...gameStateRef.current.clouds]);
    setVelocity(gameStateRef.current.velocity); // Optional, for rotation

    requestRef.current = requestAnimationFrame(updateGame);
  };

  const gameOver = () => {
    gameStateRef.current.isPlaying = false;
    setGameState('GAME_OVER');
    if (gameStateRef.current.score > highScore) {
      setHighScore(gameStateRef.current.score);
    }
    cancelAnimationFrame(requestRef.current);
  };

  const handleStart = () => {
    gameStateRef.current = {
      planeY: window.innerHeight / 2,
      velocity: 0,
      clouds: [],
      score: 0,
      isPlaying: true,
    };
    setScore(0);
    setGameState('PLAYING');
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateGame);
  };

  const handleJump = () => {
    if (gameState === 'PLAYING') {
      gameStateRef.current.velocity = JUMP_STRENGTH;
    } else {
      handleStart();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div
      className="game-container"
      onMouseDown={handleJump}
      onTouchStart={handleJump}
      style={{
        width: gameDimensions.width,
        height: gameDimensions.height,
        margin: '0',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)',
        cursor: 'pointer'
      }}
    >
      <ScoreBoard score={score} />

      {gameState === 'START' && (
        <div className="overlay">
          <h1>Airfly</h1>
          <p>Click or Press Space to Fly</p>
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="overlay">
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <p>Best: {highScore}</p>
          <p>Click to Restart</p>
        </div>
      )}

      <Airplane position={planeY} rotation={velocity * 2} />

      {clouds.map(cloud => (
        <Cloud key={cloud.id} x={cloud.x} y={cloud.y} />
      ))}
    </div>
  );
}

export default App;

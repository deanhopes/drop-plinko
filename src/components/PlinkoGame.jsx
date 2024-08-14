import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const PlinkoGame = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const [score, setScore] = useState(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log("Effect running, canvasRef:", canvasRef.current);
    const canvas = canvasRef.current;
    const { Engine, Render, World, Bodies, Events, Runner } = Matter;

    console.log("Matter loaded:", Matter);

    engineRef.current = Engine.create();
    const world = engineRef.current.world;

    renderRef.current = Render.create({
      canvas: canvas,
      engine: engineRef.current,
      options: {
        width: 1200,
        height: 1200,
        wireframes: false,
        background: "#1a1a1a",
      },
    });

    console.log("Render created:", renderRef.current);

    const pegRadius = 5;
    const cols = 7;
    const rows = 15;
    const spacing = renderRef.current.options.width / cols;

    // Create pegs
    for (let i = 0; i < cols + 1; i++) {
      for (let j = 0; j < rows; j++) {
        if (i === 0 || i === cols || j % 2 === 0) {
          const x = i * spacing;
          const y = spacing + j * spacing;
          const peg = Bodies.circle(x, y, pegRadius, {
            isStatic: true,
            render: { fillStyle: "#e0e0e0" },
            restitution: 0.5,
            friction: 0.1,
          });
          World.add(world, peg);
        }
      }
    }

    // Create walls and floor
    const wallOptions = { isStatic: true, render: { fillStyle: "#404040" } };
    World.add(world, [
      Bodies.rectangle(600, 0, 1200, 20, wallOptions), // Top
      Bodies.rectangle(600, 1200, 1200, 20, wallOptions), // Bottom
      Bodies.rectangle(0, 600, 20, 1200, wallOptions), // Left
      Bodies.rectangle(1200, 600, 20, 1200, wallOptions), // Right
    ]);

    // Create score zones
    const scoreZones = [];
    for (let i = 0; i < cols; i++) {
      const zone = Bodies.rectangle(
        (i + 0.5) * spacing,
        renderRef.current.options.height - 10,
        spacing,
        20,
        {
          isStatic: true,
          isSensor: true,
          render: { fillStyle: "#2c3e50" },
        }
      );
      scoreZones.push(zone);
      World.add(world, zone);
    }

    // Handle collisions for scoring
    Events.on(engineRef.current, "collisionStart", (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        if (scoreZones.includes(bodyA) && !bodyB.isStatic) {
          setScore((prevScore) => prevScore + 1);
          setTimeout(() => World.remove(world, bodyB), 1000);
        } else if (scoreZones.includes(bodyB) && !bodyA.isStatic) {
          setScore((prevScore) => prevScore + 1);
          setTimeout(() => World.remove(world, bodyA), 1000);
        }
      });
    });

    Runner.run(engineRef.current);
    Render.run(renderRef.current);

    console.log("Game setup complete");
    console.log("Canvas in DOM:", document.body.contains(canvas));

    const checkCanvasInterval = setInterval(() => {
      console.log("Canvas still in DOM:", document.body.contains(canvas));
    }, 1000);

    return () => {
      console.log("Cleanup function called");
      clearInterval(checkCanvasInterval);
      if (renderRef.current) {
        Render.stop(renderRef.current);
        World.clear(world);
        Engine.clear(engineRef.current);
        renderRef.current.canvas.remove();
        renderRef.current.canvas = null;
        renderRef.current.context = null;
        renderRef.current.textures = {};
      }
    };
  }, []);

  const handleClick = () => {
    if (engineRef.current) {
      const world = engineRef.current.world;
      const dropX = Math.random() * 1180 + 10; // Random x position between 10 and 1190
      const token = Matter.Bodies.circle(dropX, 30, 10, {
        restitution: 0.5,
        friction: 0.1,
        render: { fillStyle: "#e74c3c" },
      });
      Matter.World.add(world, token);
    }
  };

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleClick}
      >
        Drop Token
      </button>
      <div className="border-4 border-gray-800 rounded-lg overflow-hidden w-full h-[600px] max-w-screen-lg z-50 relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={1200}
          className="w-full h-auto max-w-full max-h-full"
          style={{
            border: "2px solid red",
            maxWidth: "100vw",
            maxHeight: "100vh",
            display: "block !important",
            visibility: "visible !important"
          }}
        />
      </div>
      <div className="mt-4 text-2xl font-bold text-white">Score: {score}</div>
    </div>
  );
};

export default PlinkoGame;

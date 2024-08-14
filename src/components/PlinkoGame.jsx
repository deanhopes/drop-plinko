import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const PlinkoGame = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;

    engineRef.current = Engine.create();
    const world = engineRef.current.world;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engineRef.current,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#1a1a1a",
      },
    });

    const pegRadius = 5;
    const tokenRadius = 10;
    const cols = 13;
    const rows = 10;
    const spacing = render.options.width / cols;

    // Create pegs
    for (let i = 0; i < cols + 1; i++) {
      for (let j = 0; j < rows; j++) {
        if (i === 0 || i === cols || j % 2 === 0) {
          const x = i * spacing;
          const y = spacing + j * spacing;
          const peg = Bodies.circle(x, y, pegRadius, {
            isStatic: true,
            render: { fillStyle: "#e0e0e0" },
          });
          World.add(world, peg);
        }
      }
    }

    // Create walls and floor
    const wallOptions = { isStatic: true, render: { fillStyle: "#404040" } };
    World.add(world, [
      Bodies.rectangle(400, 0, 800, 50, wallOptions),
      Bodies.rectangle(400, 600, 800, 50, wallOptions),
      Bodies.rectangle(0, 300, 50, 600, wallOptions),
      Bodies.rectangle(800, 300, 50, 600, wallOptions),
    ]);

    // Create score zones
    const scoreZones = [];
    for (let i = 0; i < cols - 1; i++) {
      const zone = Bodies.rectangle(
        (i + 1) * spacing,
        render.options.height - 25,
        spacing,
        50,
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
          World.remove(world, bodyB);
        } else if (scoreZones.includes(bodyB) && !bodyA.isStatic) {
          setScore((prevScore) => prevScore + 1);
          World.remove(world, bodyA);
        }
      });
    });

    Engine.run(engineRef.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(world);
      Engine.clear(engineRef.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const handleClick = () => {
    if (engineRef.current) {
      const world = engineRef.current.world;
      const token = Matter.Bodies.circle(400, 50, 10, {
        restitution: 0.5,
        friction: 0.1,
        render: { fillStyle: "#e74c3c" },
      });
      Matter.World.add(world, token);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          Drop Token
        </button>
      </div>
      <div className="border-4 border-gray-800 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 text-2xl font-bold">Score: {score}</div>
    </div>
  );
};

export default PlinkoGame;

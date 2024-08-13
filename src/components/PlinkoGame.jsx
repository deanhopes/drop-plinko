import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Matter from "matter-js";

const PlinkoGame = () => {
  const canvasRef = useRef(null);
  const [p5, setP5] = useState(null);
  const [world, setWorld] = useState(null);
  const [pegs, setPegs] = useState([]);
  const [tokens, setTokens] = useState([]);

  const WIDTH = 400;
  const HEIGHT = 600;
  const COLS = 13;
  const ROWS = 8;
  const PEG_RADIUS = 5;
  const TOKEN_RADIUS = 10;

  useEffect(() => {
    import("p5").then((p5Module) => {
      const p5 = new p5Module.default((p) => {
        p.setup = () => {
          const canvas = p.createCanvas(WIDTH, HEIGHT);
          canvas.parent(canvasRef.current);

          const engine = Matter.Engine.create();
          const world = engine.world;

          setP5(p);
          setWorld(world);

          // Create pegs
          const newPegs = [];
          for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
              const x = i * (WIDTH / (COLS - 1));
              const y = j * (HEIGHT / (ROWS + 1)) + 100;
              const peg = Matter.Bodies.circle(x, y, PEG_RADIUS, {
                isStatic: true,
              });
              Matter.World.add(world, peg);
              newPegs.push(peg);
            }
          }
          setPegs(newPegs);

          // Create walls and bottom
          const walls = [
            Matter.Bodies.rectangle(0, HEIGHT / 2, 10, HEIGHT, {
              isStatic: true,
            }),
            Matter.Bodies.rectangle(WIDTH, HEIGHT / 2, 10, HEIGHT, {
              isStatic: true,
            }),
            Matter.Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 10, {
              isStatic: true,
            }),
          ];
          Matter.World.add(world, walls);

          Matter.Runner.run(engine);
        };

        p.draw = () => {
          p.background(220);

          // Draw pegs
          p.fill(150);
          pegs.forEach((peg) => {
            p.circle(peg.position.x, peg.position.y, PEG_RADIUS * 2);
          });

          // Draw tokens
          p.fill(255, 0, 0);
          tokens.forEach((token) => {
            p.circle(token.position.x, token.position.y, TOKEN_RADIUS * 2);
          });

          // Draw drop zones
          p.fill(0);
          for (let i = 0; i < COLS; i++) {
            const x = i * (WIDTH / (COLS - 1));
            p.rect(x - 15, 0, 30, 50);
          }

          // Draw collection zones
          for (let i = 0; i < COLS - 1; i++) {
            const x = i * (WIDTH / (COLS - 1)) + WIDTH / (COLS - 1) / 2;
            p.rect(x - 15, HEIGHT - 50, 30, 50);
          }
        };

        p.mousePressed = () => {
          if (p.mouseY < 50 && world) {
            const token = Matter.Bodies.circle(p.mouseX, 50, TOKEN_RADIUS, {
              restitution: 0.5,
              friction: 0.1,
            });
            Matter.World.add(world, token);
            setTokens((prevTokens) => [...prevTokens, token]);
          }
        };
      });
    });

    return () => {
      // Cleanup
      if (p5) {
        p5.remove();
      }
    };
  }, []);

  return (
    <motion.div
      className="border-4 border-gray-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={canvasRef} />
    </motion.div>
  );
};

export default PlinkoGame;

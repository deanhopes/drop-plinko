import Nav from "../components/Nav";
import PlinkoGame from "../components/PlinkoGame";

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Nav />
      <main className="flex-grow flex items-center justify-center p-4 mt-16">
        <PlinkoGame />
      </main>
    </div>
  );
}

export default Home;

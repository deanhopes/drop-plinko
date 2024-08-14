import Nav from "../components/Nav";
import PlinkoGame from "../components/PlinkoGame";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Nav />
      <main className="flex-grow flex items-center justify-center p-4">
        <PlinkoGame />
      </main>
    </div>
  );
}

export default Home;

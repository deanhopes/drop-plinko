import Layout from "../components/Layout";
import PlinkoGame from "../components/PlinkoGame";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Layout />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="mb-4">Enjoy our Plinko Game!</p>
        <PlinkoGame />
      </main>
    </div>
  );
}

export default Home;

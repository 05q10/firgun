import MarvelLanding from './MarvelLanding';
import ComicStrip from './ComicStrip';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero section with parallax effects */}
      <MarvelLanding />
      
      {/* Comic strip section */}
      <ComicStrip />
      
      {/* Call to action section */}
      <section className="bg-red-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-comic mb-8 text-center">JOIN THE ADVENTURE</h2>
          <p className="text-xl mb-8 text-center">
            Dive into the world of Marvel with our interactive experiences!
          </p>
          <div className="flex justify-center">
            <button className="bg-yellow-400 text-black font-bold py-3 px-8 text-xl rounded-lg transform hover:scale-105 transition-transform shadow-comic">
              EXPLORE NOW
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
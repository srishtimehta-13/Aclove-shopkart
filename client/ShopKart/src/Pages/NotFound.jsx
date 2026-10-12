import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F1E6] text-[#292A2A]">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-20 text-center">
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71977C]">
            404 · Page not found
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#17483F] sm:text-5xl">
            This piece isn't in our collection
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#666360]">
            The page may have moved, or the address may be incorrect.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-[#17483F] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] transition hover:bg-[#0f322b]"
          >
            Return to Alcove
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;

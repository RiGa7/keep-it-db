import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-primary text-gray flex flex-col font-sans">
      
      {/* Fake App Document Header */}
      <header className="w-full border-b border-secondary px-6 py-3 flex items-center justify-between bg-primary">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-danger"></span>
          <span className="text-xs font-mono tracking-wider text-gray-dark uppercase">
            unregistered_route.md
          </span>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="text-xs font-medium text-accent hover:underline cursor-pointer transition-all"
        >
          Back to Notes
        </button>
      </header>

      {/* Main Empty Document Layout */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 md:py-20">
        
        {/* Note Metadata Block */}
        <div className="note-content border-b border-secondary pb-6 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            You&apos;ve typed outside the margins.
          </h1>
          <div className="text-xs text-gray-dark flex items-center gap-4 font-mono">
            <span>Location: The Void</span>
            <span>Status: 404</span>
          </div>
        </div>

        {/* Note Content Canvas */}
        <div className="ProseMirror text-base leading-relaxed space-y-6">
          
          <h2 className="text-xl font-semibold text-white">
            There is nothing to take notes on here.
          </h2>

          <p>
            You stumbled onto a route that doesn&apos;t exist in our routing system. Our app prefers keeping things tucked away cleanly in modals, so seeing this view is actually quite rare!
          </p>

          <blockquote>
            &quot;An empty page is full of possibilities, but an empty route is just a dead end.&quot;
          </blockquote>

          <p>
            Unless you are intentionally trying to break our application architecture by rewriting the browser address URL parameters, we highly recommend returning back to your actual writing workspace canvas dashboard below.
          </p>

        </div>

        {/* Back Button */}
        <div className="mt-12 pt-6 border-t border-secondary flex items-center justify-start">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-secondary bg-secondary text-sm font-medium text-white hover:border-accent transition-colors duration-200 cursor-pointer shadow-sm"
          >
            ✍️ Return to App Workspace
          </button>
        </div>

      </main>
    </div>
  );
}

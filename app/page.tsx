import Link from "next/link";

const appTitle = "KotoBank"
const appDescription= "Choose a category to start learning."

const features = [
  {
    title: "Daily Verb",
    description: "Practice JLPT verbs with flashcards",
    href: "/pageVerb",
  },
  {
    title: "Add New kotoba",
    description: "Add kotoba to Bank",
    href:"/pageAddKotoba"
  },
  {
    title: "Daily Sentence",
    description: "Learn with example sentences",
    href: "/sentence",
  },
  {
    title: "Grammar",
    description: "Review grammar rules and examples",
    href: "/grammar",
  },
  {
    title: "Quiz",
    description: "Test your knowledge with quizzes",
    href: "/quiz",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
          {appTitle} App
        </h1>
        <p className="text-center text-gray-600 mb-10">
          {appDescription}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h2>
                <p className="text-gray-500 mt-2">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

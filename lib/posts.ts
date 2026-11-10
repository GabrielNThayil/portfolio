export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang?: string; code: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  accent: "aurora" | "ion" | "plasma" | "ember";
  body: PostBlock[];
};

// Add new posts to the top of this list. Each one gets its own page at /blog/<slug>.
export const posts: Post[] = [
  {
    slug: "building-an-erp-copilot",
    title: "Building an AI Copilot on Top of an ERP",
    excerpt:
      "What I learned wiring a natural-language assistant into a Spring Boot ERP — and why the hard part wasn't the model.",
    date: "2026-06-20",
    tags: ["Spring Boot", "Generative AI", "Architecture"],
    accent: "ion",
    body: [
      {
        type: "p",
        text: "ERP systems are full of answers that nobody can find. The data is there — expenses, leave requests, department budgets — but getting to it means clicking through five screens or writing SQL. I wanted to see what happens when you let people just ask."
      },
      { type: "h2", text: "The shape of the system" },
      {
        type: "p",
        text: "The core is a fairly conventional Spring Boot 3 application: JWT auth with role-based access, PostgreSQL with Flyway migrations, and modules for employees, departments, leave, and expenses. The copilot sits beside those modules rather than inside them."
      },
      {
        type: "ul",
        items: [
          "A question comes in as plain text from an authenticated user.",
          "The service maps it to a small set of known, permission-checked queries.",
          "Results are passed to the model, which composes an answer with its reasoning."
        ]
      },
      { type: "h2", text: "Why the model never touches the database" },
      {
        type: "p",
        text: "It was tempting to let the model generate SQL directly. I decided against it: role-based access has to hold no matter how a question is phrased. Keeping the model on the 'explain the data' side and the application on the 'fetch the data' side made the security story simple to reason about."
      },
      {
        type: "code",
        lang: "java",
        code: `// The copilot only ever sees data the caller could already access.
var rows = queryRouter.resolve(question, currentUser.role());
return copilot.explain(question, rows);`
      },
      { type: "h2", text: "What I'd do next" },
      {
        type: "p",
        text: "Better evaluation. It's easy to demo a copilot on five hand-picked questions; it's much harder to know how it behaves on the fiftieth. A small regression set of real questions with expected answers is the next thing on the list."
      }
    ]
  },
  {
    slug: "speech-to-text-at-a-hackathon",
    title: "Shipping Speech-to-Text in a Hackathon Weekend",
    excerpt:
      "Notes from building a voice-driven equipment inspection assistant with Flask and SQL for the Caterpillar Hackathon.",
    date: "2026-05-02",
    tags: ["Flask", "Speech Recognition", "Hackathons"],
    accent: "ember",
    body: [
      {
        type: "p",
        text: "Inspectors working around heavy equipment usually have their hands full. Typing notes into a form is slow and error-prone. Our idea: let them talk, and turn what they say into a structured inspection record."
      },
      { type: "h2", text: "Scope ruthlessly" },
      {
        type: "p",
        text: "With a weekend on the clock, the most valuable decision was what not to build. We picked one end-to-end flow — record, transcribe, extract fields, save — and made that reliable before touching anything else."
      },
      {
        type: "ul",
        items: [
          "Flask backend with a single upload-and-transcribe endpoint",
          "A lightweight extraction step to pull component, condition, and notes out of the transcript",
          "SQL persistence so every inspection is queryable afterwards"
        ]
      },
      { type: "h2", text: "Noise is the real enemy" },
      {
        type: "p",
        text: "Transcription that works at a desk falls apart next to an engine. Letting the inspector review and correct the extracted fields before saving turned out to matter more than squeezing out extra accuracy."
      },
      {
        type: "quote",
        text: "A demo that works every time beats a feature list that works some of the time."
      }
    ]
  },
  {
    slug: "flutter-for-a-real-cafe",
    title: "Designing a Flutter App Around a Real Café",
    excerpt:
      "Building for an actual business changes everything — from what the home screen shows to how you name things.",
    date: "2026-03-14",
    tags: ["Flutter", "Product UX", "Mobile"],
    accent: "aurora",
    body: [
      {
        type: "p",
        text: "Most of my early projects were built for imaginary users. The La Couronne café app was different: there was a real menu, real staff, and real customers with opinions."
      },
      { type: "h2", text: "Start from the workflow, not the screens" },
      {
        type: "p",
        text: "Before opening an editor, I mapped out what actually happens during a busy hour — who takes orders, what gets asked most often, where things slow down. The app's structure fell out of that map."
      },
      { type: "h2", text: "Small things that mattered" },
      {
        type: "ul",
        items: [
          "Using the café's own names for items instead of generic categories",
          "Making the most-ordered items reachable in one tap",
          "Keeping the visual style close to the café's existing branding"
        ]
      },
      {
        type: "p",
        text: "Flutter made it easy to iterate on layouts quickly, which mattered because the first version was wrong in several ways I wouldn't have guessed without feedback from the people using it."
      }
    ]
  }
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function readingMinutes(post: Post) {
  const words = post.body
    .map((block) => ("text" in block ? block.text : "items" in block ? block.items.join(" ") : block.code))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

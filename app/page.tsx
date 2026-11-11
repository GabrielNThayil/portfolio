"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  Rocket,
  Satellite,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import Link from "next/link";
import { Starfield } from "@/components/Starfield";

const rotatingPhrases = [
  "Building AI-powered products",
  "Designing scalable software systems",
  "Creating full-stack applications",
  "Exploring embedded engineering",
  "Documenting my engineering journey"
];

const skillGroups = [
  { label: "Languages", skills: ["Java", "Python", "TypeScript", "JavaScript", "C++"] },
  { label: "Frontend", skills: ["React", "Next.js", "Flutter", "Tailwind"] },
  { label: "Backend", skills: ["Spring Boot", "FastAPI", "Flask", "Node.js", "REST APIs"] },
  { label: "Data", skills: ["PostgreSQL", "MySQL", "MongoDB"] },
  { label: "AI & ML", skills: ["RAG", "LLM apps", "Gemini AI", "Speech recognition"] },
  { label: "Embedded", skills: ["Arduino", "PID control", "IMU sensors"] },
  { label: "Tools", skills: ["Git", "Docker", "Linux", "Swagger / OpenAPI"] }
];

type Project = {
  title: string;
  kind: string;
  body: string;
  stack: string[];
  orbit: string;
  github?: string;
  live?: string;
};

const projects: Project[] = [
  {
    title: "AI-Powered ERP Copilot",
    kind: "Enterprise software + AI",
    body: "An ERP with a natural-language copilot: ask “which department spent the most this quarter?” and get an answer drawn from live, permission-checked data. JWT roles, approval workflows, audit logging.",
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "Gemini AI", "Docker"],
    orbit: "orbit-d",
    github: "https://github.com/GabrielNThayil/AI-Powered-ERP-Copilot"
  },
  {
    title: "RAG Query Retrieval System",
    kind: "AI / LLM",
    body: "Retrieval-augmented generation over PDFs, DOCX and email. Hybrid BM25 + vector search, clause-level matching, and answers that trace back to their source.",
    stack: ["Python", "FastAPI", "Hybrid search", "Docker"],
    orbit: "orbit-c",
    github: "https://github.com/GabrielNThayil/rag-query-retrieval"
  },
  {
    title: "La Couronne Café",
    kind: "Full-stack web app",
    body: "The website for a real café: full menu, online ordering, and mood-based recommendations that pair drinks and desserts with how you feel.",
    stack: ["Next.js", "TypeScript", "Tailwind", "NextAuth"],
    orbit: "orbit-a",
    github: "https://github.com/GabrielNThayil/LaCWeb"
  },
  {
    title: "Equipment Inspection Assistant",
    kind: "Caterpillar Hackathon",
    body: "Inspectors speak, the app writes the report: speech-to-text turned into structured inspection records with a Flask backend and SQL storage.",
    stack: ["Flask", "Speech-to-text", "SQL"],
    orbit: "orbit-b"
  },
  {
    title: "Telemetry PID Gimbal",
    kind: "Embedded systems",
    body: "An Arduino gimbal that holds itself level: IMU sensor fusion feeds a PID loop driving a servo, with temperature and humidity telemetry streamed as JSON.",
    stack: ["Arduino C++", "MPU6050", "PID control", "DHT22"],
    orbit: "orbit-e",
    github: "https://github.com/GabrielNThayil/Telemetry-TVC-PID"
  }
];

const achievements = [
  "Black Belt in Taekwondo",
  "Multiple Hackathon Participations",
  "Technical Club Leadership",
  "Music Club Leadership",
  "CERN Internship Applicant",
  "Google STEP Applicant",
  "J.P. Morgan Internship Candidate"
];

const interests = ["Guitar", "Drums", "Music Production", "Robotics", "Astronomy", "Fitness", "Open Source", "AI Research"];

function PlanetScene({ animate }: { animate: boolean }) {
  const planet = useRef<Mesh>(null);
  const satellite = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.getElapsedTime();
    if (planet.current) {
      planet.current.rotation.y = t * 0.22;
      planet.current.rotation.x = 0.24;
    }
    if (satellite.current) {
      satellite.current.position.x = Math.cos(t * 1.25) * 2.45;
      satellite.current.position.z = Math.sin(t * 1.25) * 2.45;
      satellite.current.position.y = Math.sin(t * 1.7) * 0.35;
      satellite.current.rotation.y = t;
    }
  });

  return (
    <>
      <ambientLight intensity={1.25} />
      <pointLight position={[4, 3, 4]} intensity={16} color="#78ffb7" />
      <pointLight position={[-5, -2, 2]} intensity={8} color="#ff5df7" />
      <mesh ref={planet}>
        <sphereGeometry args={[1.42, 64, 64]} />
        <meshStandardMaterial color="#1f6b88" roughness={0.48} metalness={0.18} emissive="#08243c" />
      </mesh>
      <mesh rotation={[Math.PI / 2.65, 0, 0]}>
        <torusGeometry args={[1.88, 0.018, 12, 160]} />
        <meshBasicMaterial color="#32d7ff" transparent opacity={0.6} />
      </mesh>
      <mesh ref={satellite}>
        <boxGeometry args={[0.42, 0.16, 0.16]} />
        <meshStandardMaterial color="#f7b955" roughness={0.22} metalness={0.7} />
      </mesh>
    </>
  );
}

function RotatingTagline() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const longestPhrase = useMemo(
    () => rotatingPhrases.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    []
  );

  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(
      () => setIndex((value) => (value + 1) % rotatingPhrases.length),
      2800
    );
    return () => window.clearTimeout(id);
  }, [index, reduce]);

  return (
    <span className="rotating-tagline" aria-live="polite" aria-atomic="true">
      <span className="rotating-tagline-ghost" aria-hidden="true">{longestPhrase}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={rotatingPhrases[index]}
          className="rotating-tagline-active"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {rotatingPhrases[index]}
      </motion.span>
    </AnimatePresence>
  </span>
  );
}


function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const move = (event: PointerEvent) => setPos({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce]);

  if (reduce) return null;
  return <div className="target-cursor" style={{ transform: `translate3d(${pos.x - 18}px, ${pos.y - 18}px, 0)` }} aria-hidden="true" />;
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="site-section relative mx-auto w-full max-w-7xl px-5 sm:px-8" aria-labelledby={`${id}-title`}>
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="hud-label">{eyebrow}</p>
          <h2 id={`${id}-title`} className="section-title">{title}</h2>
        </div>
        <div className="section-ruler hidden sm:block" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

const navItems = ["About", "Skills", "Projects", "Experience", "Contact"];

const trackedSections = [
  { id: "hero", label: "Launch" },
  { id: "about", label: "Mission log" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Timeline" },
  { id: "achievements", label: "Badges" },
  { id: "beyond", label: "Beyond code" },
  { id: "contact", label: "Contact" }
];

/** Real readouts for the HUD: UTC clock, scroll depth, and the section in view. */
function useTelemetry() {
  const [clock, setClock] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [active, setActive] = useState("hero");
  /** 0..1 position along the section rail: section index plus progress through that section. */
  const [flight, setFlight] = useState(0);

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setDepth(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
      const probe = window.innerHeight * 0.35;
      let index = 0;
      trackedSections.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) index = i;
      });
      const el = document.getElementById(trackedSections[index].id);
      let within = 0;
      if (el) {
        const rect = el.getBoundingClientRect();
        within = Math.min(1, Math.max(0, (probe - rect.top) / Math.max(rect.height, 1)));
      }
      const last = trackedSections.length - 1;
      const atBottom = max > 0 && window.scrollY >= max - 2;
      setActive(trackedSections[atBottom ? last : index].id);
      setFlight(atBottom ? 1 : Math.min(1, (index + (index === last ? 0 : within)) / last));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { clock, depth, active, flight };
}

/** Sidebar flight path: one stop per section, with a rocket that travels down it as you scroll. */
function SectionRail({ active, flight, depth }: { active: string; flight: number; depth: number }) {
  const activeIndex = trackedSections.findIndex((s) => s.id === active);
  return (
    <nav className="section-rail" aria-label="Page sections">
      <p className="rail-title" aria-hidden="true">Flight path</p>
      <div className="rail-body" style={{ "--flight": flight } as React.CSSProperties}>
        <div className="rail-line" aria-hidden="true"><i /></div>
        <Rocket className="rail-rocket" size={16} aria-hidden="true" />
        <ol>
          {trackedSections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                className={index < activeIndex ? "is-passed" : undefined}
              >
                <span className="rail-dot" aria-hidden="true" />
                <span className="rail-num" aria-hidden="true">{String(index).padStart(2, "0")}</span>
                <span className="rail-label">{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <p className="rail-depth" aria-hidden="true">{String(depth).padStart(3, "0")}%</p>
    </nav>
  );
}

/** Thin trajectory bar under the nav for screens too narrow for the sidebar. */
function FlightBar({ depth }: { depth: number }) {
  return (
    <div className="flight-bar" style={{ "--depth": depth / 100 } as React.CSSProperties} aria-hidden="true">
      <i />
      <Rocket size={13} className="flight-bar-rocket" />
    </div>
  );
}

function SiteNav({ clock, depth, active }: Pick<ReturnType<typeof useTelemetry>, "clock" | "depth" | "active">) {
  const [open, setOpen] = useState(false);
  const activeLabel = trackedSections.find((s) => s.id === active)?.label ?? "";
  return (
    <nav className="site-nav fixed left-0 right-0 top-0 z-40 px-5 py-3.5" aria-label="Primary navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <a href="#hero" className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.28em] text-white">GT // ORBITAL</a>
        <div className="console-readout hidden xl:flex" aria-hidden="true">
          <span><i>UTC</i>{clock ?? "--:--:--"}</span>
          <span><i>Depth</i>{String(depth).padStart(3, "0")}%</span>
          <span className="readout-section"><i>Sector</i>{activeLabel}</span>
        </div>
        <div className="hidden items-center gap-5 text-xs uppercase tracking-[0.18em] text-white/62 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-ion">{item}</a>
          ))}
          <Link href="/blog" className="text-aurora transition hover:text-ion">Blog</Link>
        </div>
        <button
          type="button"
          className="mobile-menu-btn md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      <FlightBar depth={depth} />
      {open && (
        <div id="mobile-menu" className="mobile-menu md:hidden">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>
          ))}
          <Link href="/blog" className="text-aurora">Blog</Link>
        </div>
      )}
    </nav>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const nebulaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const reduce = useReducedMotion();
  const telemetry = useTelemetry();

  useEffect(() => {
    if (reduce) {
      const id = window.setTimeout(() => setLoading(false), 150);
      return () => window.clearTimeout(id);
    }
    const timers = [
      window.setTimeout(() => setCountdown(2), 450),
      window.setTimeout(() => setCountdown(1), 900),
      window.setTimeout(() => setCountdown(0), 1350),
      window.setTimeout(() => setLoading(false), 1700)
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduce]);

  return (
    <main>
      <a className="skip-link" href="#projects">Skip to projects</a>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            className="boot-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="boot-panel">
              <div className="boot-head">
                <Rocket className={`boot-rocket ${countdown === 0 ? "is-lifting" : ""}`} aria-hidden="true" />
                <span className="boot-count" aria-hidden="true">{countdown > 0 ? `T−${countdown}` : "Liftoff"}</span>
              </div>
              <p>GABRIEL THAYIL CAREER SYSTEM</p>
              <span>Launch sequence: navigation, telemetry, and project archives...</span>
              <div className="boot-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-label="Launch sequence progress">
                <i aria-hidden="true" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomCursor />
      <Starfield />
      <motion.div className="nebula-layer" style={{ y: nebulaY }} aria-hidden="true" />
      <SiteNav {...telemetry} />
      <SectionRail active={telemetry.active} flight={telemetry.flight} depth={telemetry.depth} />

      <section id="hero" className="hero-grid relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-20 pt-28 sm:px-8" aria-labelledby="hero-title">
        <div className="hero-copy z-10 max-w-3xl">
          <motion.p className="hero-eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>Mission Portfolio // VIT Computer Science</motion.p>
          <motion.h1 id="hero-title" className="hero-title" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            Gabriel Thayil
          </motion.h1>
          <motion.p className="hero-tagline" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
            Building Intelligent Software Systems
          </motion.p>
          <motion.p className="hero-description" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, ease: [0.22, 1, 0.36, 1] }}>
            Passionate about AI applications, full-stack development, embedded engineering, and crafting elegant solutions to complex problems. Turning creative ideas into production-ready software.
          </motion.p>
          <RotatingTagline />
          <motion.div className="status-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
            <span className="status-indicator-glow" aria-hidden="true" />
            Currently seeking Software Engineering opportunities
          </motion.div>
          <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
            <a className="primary-btn" href="/Gabriel_Resume.docx" target="_blank" rel="noopener noreferrer" aria-label="Download Gabriel's resume"><Download size={18} /> Resume</a>
            <a className="icon-btn" href="https://github.com/GabrielNThayil/" target="_blank" rel="noopener noreferrer" aria-label="View Gabriel's GitHub profile"><Github size={18} /> GitHub</a>
            <a className="icon-btn" href="https://www.linkedin.com/in/gabrielthayil/" target="_blank" rel="noopener noreferrer" aria-label="View Gabriel's LinkedIn profile"><Linkedin size={18} /> LinkedIn</a>
            <a className="icon-btn" href="#contact" aria-label="Contact Gabriel"><Mail size={18} /> Contact</a>
          </motion.div>
          <motion.div className="recruiter-strip" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.54, ease: [0.22, 1, 0.36, 1] }}>
            <div><strong>Focus</strong><span>AI systems, full-stack dev, embedded engineering</span></div>
            <div><strong>Stack</strong><span>Python, Java, React, Flask, Spring Boot, C++</span></div>
            <div><strong>Goal</strong><span>Software engineering opportunities</span></div>
          </motion.div>
        </div>
        <motion.div className="planet-stage" initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">
          <div className="orbit-ring orbit-ring-1">
            <div className="orbit-dot orbit-dot-1" />
          </div>
          <div className="orbit-ring orbit-ring-2">
            <div className="orbit-dot orbit-dot-2" />
          </div>
          <div className="orbit-ring orbit-ring-3">
            <div className="orbit-dot orbit-dot-3" />
          </div>
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="reticle" />
          <Canvas style={{ position: "absolute", inset: 0, height: "auto" }} camera={{ position: [0, 0, 5.4], fov: 52 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
            <PlanetScene animate={!reduce} />
          </Canvas>
          <div className="planet-stats">
            <div className="planet-stat"><strong>3+</strong>Years Coding</div>
            <div className="planet-stat"><strong>10+</strong>Projects Built</div>
            <div className="planet-stat"><strong>∞</strong>Curiosity</div>
          </div>
        </motion.div>
      </section>

      <Section id="about" eyebrow="01 // Mission Log" title="Computer Science Trajectory">
        <div className="mission-log">
          <p>
            B.Tech Computer Science student at VIT focused on AI, machine learning, software engineering, and full stack development.
            Gabriel builds hackathon projects, speech-to-text systems, and practical apps shaped around real workflows.
          </p>
          <p>
            Beyond code, the mission file includes music, robotics, astronomy, and technology. Current objective: software engineering
            internship opportunities where curiosity, velocity, and polished execution matter.
          </p>
        </div>
      </Section>

      <Section id="skills" eyebrow="02 // Orbital Skills" title="Planets In The Stack">
        <div className="skills-orbit">
          {skillGroups.map((group) => (
            <div className="skill-cluster" key={group.label}>
              <h3>{group.label}</h3>
              <div>
                {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="projects" eyebrow="03 // Solar Archive" title="Projects As Worlds">
        <div className="project-system">
          {projects.map((project, index) => (
            <article className={`project-card ${project.orbit} ${index === 0 ? "project-featured" : ""}`} key={project.title}>
              <div className="project-head">
                <div className="project-planet" aria-hidden="true"><Code2 size={22} /></div>
                <p className="project-kind">{project.kind}</p>
              </div>
              <h3>{project.title}</h3>
              <p>{project.body}</p>
              <div className="stack-row">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              {(project.github || project.live) && (
                <div className="project-actions">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code on GitHub`}><Github size={16} aria-hidden="true" /> Code</a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}><ArrowUpRight size={16} aria-hidden="true" /> Live site</a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section id="experience" eyebrow="04 // Mission Timeline" title="Signals Of Initiative">
        <ul className="timeline">
          {["Hackathon participation", "Open source contributions", "Music club leadership", "Robotics and technical club involvement"].map((item) => (
            <li key={item} className="timeline-item">
              <Satellite aria-hidden="true" />
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="achievements" eyebrow="05 // Badge Vault" title="Collected Signals">
        <ul className="badge-grid">
          {achievements.map((achievement, index) => (
            <li className="badge" key={achievement}>
              {index === 0 ? <Trophy aria-hidden="true" /> : index < 3 ? <Zap aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="beyond" eyebrow="06 // Beyond Coding" title="Rotating Galaxy Of Interests">
        <div className="galaxy-panel">
          <div className="galaxy-core">
            {interests.map((interest, index) => (
              <span key={interest} style={{ transform: `rotate(${index * 45}deg) translateX(150px) rotate(-${index * 45}deg)` }}>{interest}</span>
            ))}
          </div>
          <div className="galaxy-copy">
            <Sparkles aria-hidden="true" />
            <p>
              Plays advanced guitar pieces including works by Ichika Nito and Mateus Asato, and performs in bands inspired by progressive
              metal and modern rock.
            </p>
          </div>
        </div>
      </Section>

      <Section id="contact" eyebrow="07 // Deep Space Comms" title="Open A Channel">
        <div className="contact-panel">
          <div className="contact-copy">
            <span className="status-indicator-glow" aria-hidden="true" />
            <h3>Looking for a software engineering internship</h3>
            <p>
              I&apos;m interested in teams building AI products, backend systems, or anything that touches hardware.
              Email is the quickest way to reach me.
            </p>
          </div>
          <div className="contact-links">
            <a className="primary-btn" href="mailto:gabrielnthayil@gmail.com"><Mail size={18} aria-hidden="true" /> gabrielnthayil@gmail.com</a>
            <a className="icon-btn" href="https://www.linkedin.com/in/gabrielthayil/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} aria-hidden="true" /> LinkedIn</a>
            <a className="icon-btn" href="https://github.com/GabrielNThayil/" target="_blank" rel="noopener noreferrer"><Github size={18} aria-hidden="true" /> GitHub</a>
            <a className="icon-btn" href="/Gabriel_Resume.docx" target="_blank" rel="noopener noreferrer"><Download size={18} aria-hidden="true" /> Résumé</a>
          </div>
        </div>
      </Section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Gabriel Thayil</span>
        <Link href="/blog">Read the blog</Link>
        <a href="#hero" className="back-to-launch">
          <Rocket size={16} aria-hidden="true" /> Back to launch
        </a>
      </footer>
    </main>
  );
}

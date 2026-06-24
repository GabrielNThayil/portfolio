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
  Radio,
  Satellite,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";

const roles = ["Software Engineer", "AI Developer", "Open Source Contributor", "Problem Solver"];

const skillGroups = [
  { label: "Programming", skills: ["Java", "Python", "C++", "JavaScript", "TypeScript"] },
  { label: "Frontend", skills: ["React", "Next.js", "Flutter", "HTML", "CSS", "Tailwind"] },
  { label: "Backend", skills: ["Spring Boot", "Flask", "Node.js", "REST APIs"] },
  { label: "Database", skills: ["MySQL", "PostgreSQL", "MongoDB"] },
  { label: "AI & ML", skills: ["Machine Learning", "Speech Recognition", "Generative AI", "Data Analysis"] },
  { label: "Tools", skills: ["Git", "GitHub", "Docker", "Linux"] }
];

const projects = [
  {
    title: "La Couronne Cafe Application",
    body: "Flutter application for cafe management and customer experience, designed around a real business workflow.",
    stack: ["Flutter", "Dart", "Product UX", "Business App"],
    orbit: "orbit-a",
    github: "https://github.com/GabrielNThayil/LaCWeb"
  },
  {
    title: "AI-Powered Equipment Inspection Assistant",
    body: "Speech-to-text inspection workflow with a Flask backend and SQL persistence, built for the Caterpillar Hackathon.",
    stack: ["Flask", "Speech-to-text", "SQL", "AI Workflow"],
    orbit: "orbit-b",
    github: null
  },
  {
    title: "Second-Hand Marketplace Platform",
    body: "College marketplace concept with product discovery, listing flows, and e-commerce inspired interactions.",
    stack: ["Marketplace", "Full Stack", "UX", "Commerce"],
    orbit: "orbit-c",
    github: null
  },
  {
    title: "E-Commerce Application",
    body: "Product browsing and management app built with FakeStore API data and a clean commerce workflow.",
    stack: ["FakeStore API", "React", "Products", "REST"],
    orbit: "orbit-d",
    github: null
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

function Typewriter() {
  const [role, setRole] = useState(0);
  const [letters, setLetters] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setLetters(roles[0].length);
      return;
    }
    const text = roles[role];
    if (letters < text.length) {
      const id = window.setTimeout(() => setLetters((value) => value + 1), 55);
      return () => window.clearTimeout(id);
    }
    const pause = window.setTimeout(() => {
      setLetters(0);
      setRole((value) => (value + 1) % roles.length);
    }, 1400);
    return () => window.clearTimeout(pause);
  }, [letters, reduce, role]);

  return <span>{roles[role].slice(0, letters)}<span className="cursor-pulse">|</span></span>;
}

function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 130 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 61) % 100}%`,
        size: `${1 + (index % 4) * 0.7}px`,
        delay: `${(index % 17) * 0.22}s`
      })),
    []
  );

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => (
        <span key={star.id} style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />
      ))}
      <i className="shooting shooting-one" />
      <i className="shooting shooting-two" />
      <i className="shooting shooting-three" />
    </div>
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
    <motion.section
      id={id}
      className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px", amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby={`${id}-title`}
    >
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="hud-label">{eyebrow}</p>
          <h2 id={`${id}-title`} className="section-title">{title}</h2>
        </div>
        <div className="constellation-line hidden sm:block" />
      </div>
      {children}
    </motion.section>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const nebulaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), reduce ? 150 : 1400);
    return () => window.clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    if (!loading && skipLinkRef.current) {
      skipLinkRef.current.focus();
    }
  }, [loading]);

  return (
    <main>
      <a ref={skipLinkRef} className="skip-link" href="#projects">Skip to projects</a>
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
              <Radio className="h-8 w-8 text-aurora" aria-hidden="true" />
              <p>GABRIEL THAYIL CAREER SYSTEM</p>
              <span>Booting navigation, telemetry, and project archives...</span>
              <div className="boot-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-label="System boot progress">
                <i aria-hidden="true" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomCursor />
      <Starfield />
      <motion.div className="nebula-layer" style={{ y: nebulaY }} aria-hidden="true" />
      <nav className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-void/75 px-5 py-4 backdrop-blur-xl" aria-label="Primary navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#hero" className="font-display text-sm font-bold uppercase tracking-[0.28em] text-white">GT // ORBITAL</a>
          <div className="hidden items-center gap-5 text-xs uppercase tracking-[0.18em] text-white/62 md:flex">
            {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-ion">{item}</a>
            ))}
          </div>
        </div>
      </nav>

      <section id="hero" className="hero-grid relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-20 pt-28 sm:px-8" aria-labelledby="hero-title">
        <div className="hero-copy z-10 max-w-3xl">
          <motion.p className="hud-label" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>MISSION PORTFOLIO // VIT COMPUTER SCIENCE</motion.p>
          <motion.h1 id="hero-title" className="hero-title" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            Gabriel Thayil
          </motion.h1>
          <motion.p className="mt-4 max-w-2xl text-xl text-white/78 sm:text-2xl" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Software Engineer | AI Enthusiast | Full Stack Developer
          </motion.p>
          <motion.p className="mt-5 max-w-2xl text-base leading-8 text-white/66 sm:text-lg" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            Exploring the intersection of software, artificial intelligence, and innovation.
          </motion.p>
          <motion.div className="mt-7 font-display text-2xl font-semibold text-aurora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Typewriter />
          </motion.div>
          <motion.div className="mt-9 flex flex-wrap gap-3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <a className="primary-btn" href="/Gabriel_Resume.docx" target="_blank" rel="noopener noreferrer" aria-label="Download Gabriel's resume"><Download size={18} /> Resume</a>
            <a className="icon-btn" href="https://github.com/GabrielNThayil/" target="_blank" rel="noopener noreferrer" aria-label="View Gabriel's GitHub profile"><Github size={18} /> GitHub</a>
            <a className="icon-btn" href="https://www.linkedin.com/in/gabrielthayil/" target="_blank" rel="noopener noreferrer" aria-label="View Gabriel's LinkedIn profile"><Linkedin size={18} /> LinkedIn</a>
            <a className="icon-btn" href="#contact" aria-label="Contact Gabriel"><Mail size={18} /> Contact</a>
          </motion.div>
          <motion.div className="recruiter-strip" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, ease: [0.22, 1, 0.36, 1] }}>
            <div><strong>Builds</strong><span>AI workflows, full stack apps, product-focused tools</span></div>
            <div><strong>Stack</strong><span>Java, Python, React, Next.js, Flask, Spring Boot</span></div>
            <div><strong>Seeking</strong><span>Software engineering internships</span></div>
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
          <Canvas camera={{ position: [0, 0, 5.4], fov: 44 }} dpr={[1, 1.7]} performance={{ min: 0.5 }}>
            <PlanetScene animate={!reduce} />
          </Canvas>
          <div className="planet-stats">
            <div className="planet-stat"><strong>3+</strong>Years Coding</div>
            <div className="planet-stat"><strong>5+</strong>Projects Built</div>
            <div className="planet-stat"><strong>∞</strong>Ideas Ready</div>
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
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              className="skill-cluster"
              key={group.label}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            >
              <span className="cluster-index">0{groupIndex + 1}</span>
              <h3>{group.label}</h3>
              <div>
                {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="projects" eyebrow="03 // Solar Archive" title="Projects As Worlds">
        <div className="project-system">
          {projects.map((project, index) => (
            <motion.article
              className={`project-card ${project.orbit}`}
              key={project.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -10 }}
            >
              <div className="project-planet" aria-hidden="true"><Code2 size={24} /></div>
              <h3>{project.title}</h3>
              <p>{project.body}</p>
              <div className="stack-row">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <details>
                <summary>Mission details</summary>
                <p>Expandable recruiter scan: problem, implementation, and outcome can be swapped with live metrics when available.</p>
              </details>
              <div className="project-actions">
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub`}><Github size={16} /> GitHub</a>
                ) : (
                  <span className="disabled-link" aria-disabled="true"><Github size={16} /> GitHub</span>
                )}
                <span className="disabled-link" aria-disabled="true"><ArrowUpRight size={16} /> Demo</span>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="experience" eyebrow="04 // Mission Timeline" title="Signals Of Initiative">
        <div className="timeline">
          {["Hackathon participation", "Open source contributions", "Music club leadership", "Robotics and technical club involvement"].map((item, index) => (
            <motion.div key={item} className="timeline-item" whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: index % 2 ? 28 : -28 }} viewport={{ once: true }}>
              <Satellite aria-hidden="true" />
              <span>0{index + 1}</span>
              <p>{item}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="achievements" eyebrow="05 // Badge Vault" title="Collected Signals">
        <div className="badge-grid">
          {achievements.map((achievement, index) => (
            <motion.div className="badge" key={achievement} whileHover={{ rotate: index % 2 ? -2 : 2, scale: 1.04 }}>
              {index % 3 === 0 ? <Trophy /> : index % 3 === 1 ? <ShieldCheck /> : <Zap />}
              <span>{achievement}</span>
            </motion.div>
          ))}
        </div>
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
        <div className="contact-grid">
          <form className="terminal-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="name">Name<input id="name" name="name" placeholder="Your name" autoComplete="name" /></label>
            <label htmlFor="email">Email<input id="email" name="email" placeholder="you@example.com" type="email" autoComplete="email" /></label>
            <label htmlFor="message">Message<textarea id="message" name="message" placeholder="Transmission contents" rows={5} /></label>
            <button type="button"><Send size={18} /> Send transmission</button>
          </form>
          <div className="contact-card">
            <Radio aria-hidden="true" />
            <h3>Recruiter frequency locked</h3>
            <p>Available for software engineering internships, AI-focused projects, and full stack development opportunities.</p>
            <a href="https://www.linkedin.com/in/gabrielthayil/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} /> LinkedIn</a>
            <a href="https://github.com/GabrielNThayil/" target="_blank" rel="noopener noreferrer"><Github size={18} /> GitHub</a>
            <a href="mailto:gabriel@example.com"><Mail size={18} /> Email</a>
          </div>
        </div>
      </Section>
    </main>
  );
}

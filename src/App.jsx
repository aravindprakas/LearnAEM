import { useState, useEffect, useRef } from "react";

// ─── Theme & Constants ───
const COLORS = {
  bg: "#f1f1f1",
  surface: "#ffffff",
  surfaceHover: "#f8f9fa",
  border: "#dce0e5",
  accent: "#04AA6D",
  accentSoft: "rgba(4,170,109,0.08)",
  green: "#04AA6D",
  greenSoft: "rgba(4,170,109,0.08)",
  yellow: "#e6a817",
  yellowSoft: "rgba(230,168,23,0.08)",
  blue: "#2196F3",
  blueSoft: "rgba(33,150,243,0.08)",
  purple: "#9C27B0",
  purpleSoft: "rgba(156,39,176,0.08)",
  text: "#1a1a2e",
  textMuted: "#6c757d",
  codeBg: "#f6f8fa",
  tryBg: "rgba(4,170,109,0.05)",
  quizBg: "#282d3a",
};

// ─── Code Block Component ───
function CodeBlock({ code, language = "java", title }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ background: COLORS.codeBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, marginBottom: 16, overflow: "hidden" }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.codeBg }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{title}</span>
          <button onClick={copy} style={{ background: copied ? COLORS.green : "none", border: `1px solid ${copied ? COLORS.green : COLORS.border}`, color: copied ? "#000" : COLORS.textMuted, cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", padding: "2px 10px", borderRadius: 4, transition: "all 0.2s" }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre style={{ margin: 0, padding: 16, overflowX: "auto", fontSize: 13, lineHeight: 1.65, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {code}
      </pre>
    </div>
  );
}

// ─── "Try It Yourself" Block (W3Schools Style) ───
function TryItBlock({ code, result, description }) {
  const [showResult, setShowResult] = useState(false);
  return (
    <div style={{ background: COLORS.tryBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, fontFamily: "'Space Grotesk', sans-serif" }}>Example</span>
      </div>
      {description && <p style={{ fontSize: 13.5, color: COLORS.textMuted, margin: "0 0 12px", lineHeight: 1.6 }}>{description}</p>}
      <div style={{ background: COLORS.codeBg, borderLeft: `4px solid ${COLORS.green}`, borderRadius: "0 6px 6px 0", padding: "14px 16px", marginBottom: 14 }}>
        <pre style={{ margin: 0, fontSize: 13, lineHeight: 1.65, fontFamily: "'JetBrains Mono', monospace", color: COLORS.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{code}</pre>
      </div>
      <button
        onClick={() => setShowResult(!showResult)}
        style={{ background: COLORS.green, color: "#000", border: "none", padding: "10px 24px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" }}
        onMouseOver={e => e.target.style.opacity = "0.85"}
        onMouseOut={e => e.target.style.opacity = "1"}>
        {showResult ? "Hide Result ×" : "Try it Yourself »"}
      </button>
      {showResult && (
        <div style={{ marginTop: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>Result:</div>
          <pre style={{ margin: 0, fontSize: 13, lineHeight: 1.65, fontFamily: "'JetBrains Mono', monospace", color: COLORS.text, whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Quiz Component ───
function Quiz({ title, questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? questions.filter((q, i) => answers[i] === q.correct).length : 0;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div style={{ background: COLORS.quizBg, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "28px 24px", marginTop: 32, marginBottom: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace" }}>Test Yourself</span>
        <h3 style={{ fontSize: 22, color: "#fff", fontWeight: 700, margin: "4px 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>
          Exercise{submitted && <span style={{ fontSize: 15, marginLeft: 8, color: score === questions.length ? COLORS.green : COLORS.yellow }}>{score}/{questions.length} correct</span>}
        </h3>
      </div>
      {questions.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 18 }}>
          <p style={{ color: "#e2e4ed", fontSize: 14.5, fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.question}</p>
          {q.options.map((opt, oi) => {
            const selected = answers[qi] === oi;
            let bg = "rgba(255,255,255,0.04)";
            let border = "1px solid rgba(255,255,255,0.08)";
            if (submitted && oi === q.correct) { bg = "rgba(74,222,128,0.15)"; border = `2px solid ${COLORS.green}`; }
            else if (submitted && selected && oi !== q.correct) { bg = "rgba(232,74,53,0.15)"; border = `2px solid ${COLORS.accent}`; }
            else if (!submitted && selected) { bg = "rgba(74,222,128,0.1)"; border = `2px solid ${COLORS.green}`; }
            return (
              <div key={oi} onClick={() => !submitted && setAnswers(p => ({ ...p, [qi]: oi }))}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: bg, border, borderRadius: 8, marginBottom: 6, cursor: submitted ? "default" : "pointer", transition: "all 0.15s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? COLORS.green : "rgba(255,255,255,0.25)"}`, background: selected ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {selected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: selected && !submitted ? "#fff" : "#000" }} />}
                </div>
                <code style={{ color: "#e2e4ed", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{opt}</code>
                {submitted && oi === q.correct && <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.green, fontWeight: 700 }}>✓ Correct</span>}
                {submitted && selected && oi !== q.correct && <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.accent, fontWeight: 700 }}>✗ Wrong</span>}
              </div>
            );
          })}
          {submitted && answers[qi] !== q.correct && q.explanation && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 12px", marginTop: 4, fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>💡 {q.explanation}</div>
          )}
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        {!submitted ? (
          <button onClick={() => allAnswered && setSubmitted(true)}
            style={{ background: COLORS.green, color: "#000", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: allAnswered ? "pointer" : "not-allowed", opacity: allAnswered ? 1 : 0.4, fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" }}>
            Submit Answer »
          </button>
        ) : (
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            style={{ background: "transparent", color: COLORS.green, border: `2px solid ${COLORS.green}`, padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
            Retry Quiz
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Info Box Component ───
function InfoBox({ type = "info", title, children }) {
  const styles = {
    info: { border: COLORS.blue, bg: COLORS.blueSoft, icon: "ℹ️" },
    warning: { border: COLORS.yellow, bg: COLORS.yellowSoft, icon: "⚠️" },
    tip: { border: COLORS.green, bg: COLORS.greenSoft, icon: "💡" },
    important: { border: COLORS.accent, bg: COLORS.accentSoft, icon: "🔥" },
  };
  const s = styles[type];
  return (
    <div style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: s.border }}>{s.icon} {title}</div>
      <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

// ─── Section Heading ───
function SectionTitle({ children, id }) {
  return <h2 id={id} style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: "32px 0 12px", borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{children}</h2>;
}

function SubTitle({ children }) {
  return <h3 style={{ fontSize: 17, fontWeight: 600, color: COLORS.text, margin: "20px 0 8px", fontFamily: "'Space Grotesk', sans-serif" }}>{children}</h3>;
}

function Para({ children }) {
  return <p style={{ fontSize: 14.5, color: COLORS.text, lineHeight: 1.75, marginBottom: 14 }}>{children}</p>;
}

function InlineCode({ children }) {
  return <code style={{ background: "#fff4f4", border: "1px solid #fdd", padding: "2px 6px", borderRadius: 4, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#d63384" }}>{children}</code>;
}

// ─── Subtopic Chips ───
function SubtopicChips({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
      {items.map((item, i) => (
        <span key={i} style={{ fontSize: 11, padding: "4px 10px", background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: 20, color: "#2e7d32", fontFamily: "'JetBrains Mono', monospace" }}>{item}</span>
      ))}
    </div>
  );
}

// ─── All Topics / Content Data ───

const TOPICS = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      { id: "intro", title: "AEM Introduction", subtopics: ["Overview", "AEM Editions", "AEM vs Other CMS"] },
      { id: "architecture", title: "AEM Architecture", subtopics: ["Technology Stack", "JCR", "OSGi", "Sling", "Author & Publish"] },
      { id: "setup", title: "Setup & Installation", subtopics: ["Prerequisites", "Starting AEM", "Creating a Project", "Key URLs"] },
      { id: "project-structure", title: "Project Structure", subtopics: ["Maven Modules", "JCR Root Paths", "Overlays"] },
    ],
  },
  {
    category: "Core Concepts",
    icon: "⚙️",
    items: [
      { id: "jcr", title: "JCR & Content Repository", subtopics: ["Nodes & Properties", "JCR API", "Resource API", "Queries"] },
      { id: "osgi", title: "OSGi Framework", subtopics: ["DS Annotations", "Services", "Injection", "Configuration"] },
      { id: "sling", title: "Apache Sling", subtopics: ["URL Decomposition", "Script Resolution", "Resource Types", "Request Pipeline"] },
      { id: "sling-models", title: "Sling Models", subtopics: ["Basic Model", "Advanced Model", "Injection Cheatsheet", "JSON Exporter"] },
      { id: "resource-resolution", title: "Resource Resolution", subtopics: ["Mapping Rules", "Vanity URLs", "Service User Mapping"] },
    ],
  },
  {
    category: "Component Development",
    icon: "🧩",
    items: [
      { id: "htl", title: "HTL (Sightly)", subtopics: ["Expressions", "Block Statements", "Templates & Calls", "Built-in Objects"] },
      { id: "components", title: "Component Basics", subtopics: ["File Structure", "Definition XML", "HTL Template", "Core Components"] },
      { id: "dialogs", title: "Touch UI Dialogs", subtopics: ["Dialog Structure", "Widgets Reference", "Multifield", "Show/Hide"] },
      { id: "clientlibs", title: "Client Libraries", subtopics: ["Structure", "Categories & Embed", "HTL Inclusion", "Frontend Pipeline"] },
      { id: "editable-templates", title: "Editable Templates", subtopics: ["Template Structure", "Template Types", "Policies"] },
    ],
  },
  {
    category: "Advanced Topics",
    icon: "🔬",
    items: [
      { id: "servlets", title: "Sling Servlets", subtopics: ["Resource Type", "Path-Based", "Servlet Filters"] },
      { id: "workflows", title: "Workflows", subtopics: ["Built-in Workflows", "Custom Steps", "Launchers"] },
      { id: "dispatcher", title: "Dispatcher", subtopics: ["Architecture", "Filter Rules", "Cache Rules"] },
      { id: "cloud-service", title: "AEM as Cloud Service", subtopics: ["Key Differences", "Immutable vs Mutable", "Repoinit", "CI/CD Pipeline"] },
      { id: "content-fragments", title: "Content Fragments", subtopics: ["Fragment Models", "Java API", "GraphQL"] },
    ],
  },
  {
    category: "Best Practices",
    icon: "✅",
    items: [
      { id: "testing", title: "Testing in AEM", subtopics: ["AEM Mocks", "Model Tests", "Service Tests", "Dependencies"] },
      { id: "performance", title: "Performance Tips", subtopics: ["Query Optimization", "Caching Strategy", "Component Checklist"] },
    ],
  },
];

// ─── Massive Content Renderer (Original + TryIt + Quiz) ───

function TopicContent({ topicId }) {
  // Find subtopics for current topic
  const currentItem = TOPICS.flatMap(c => c.items).find(i => i.id === topicId);
  
  const content = {
    intro: () => (
      <>
        <SectionTitle>What is AEM?</SectionTitle>
        <Para>
          Adobe Experience Manager (AEM) is a comprehensive content management solution for building websites, mobile apps, and forms. It's part of the Adobe Experience Cloud and enables marketers and developers to create, manage, and optimize digital customer experiences.
        </Para>
        <InfoBox type="info" title="Key Fact">
          AEM is built on top of open-source technologies: Apache Sling, Apache Jackrabbit Oak (JCR), and OSGi (Apache Felix).
        </InfoBox>

        <SubTitle>Why AEM?</SubTitle>
        <Para>AEM combines a powerful content management system (CMS) with a digital asset management (DAM) solution. It allows organizations to deliver personalized content across multiple channels — web, mobile, email, IoT, and more.</Para>

        <SubTitle>AEM Editions</SubTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { title: "AEM Sites", desc: "Build & manage web pages, templates, and components." },
            { title: "AEM Assets (DAM)", desc: "Store, organize, and deliver digital assets at scale." },
            { title: "AEM Forms", desc: "Create adaptive forms, e-signatures, and document workflows." },
            { title: "AEM as Cloud Service", desc: "Cloud-native, always up-to-date, auto-scaling AEM." },
          ].map((item) => (
            <div key={item.title} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#04AA6D", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <SubTitle>AEM vs Other CMS</SubTitle>
        <Para>
          Unlike WordPress or Drupal which are primarily PHP-based, AEM is enterprise-grade and Java-based. It uses a hierarchical content repository (JCR) instead of a relational database, which makes content modeling far more flexible.
        </Para>

        <CodeBlock title="Key Terminology" code={`Author Instance  → Where authors create/edit content (port 4502)
Publish Instance → Where end-users view content (port 4503)
Dispatcher       → Apache web server module for caching & security
Replication      → Process of moving content from Author to Publish
JCR              → Java Content Repository (the content database)
OSGi             → Module system for Java (manages bundles/services)
Sling            → Web framework that maps URLs to JCR resources`} />

        <InfoBox type="tip" title="Quick Start Path">
          To start learning AEM effectively: Java basics → OSGi concepts → Sling framework → JCR → HTL templating → Component development → Dialogs → Templates → Workflows.
        </InfoBox>


        <TryItBlock
          description="How AEM resolves a URL to rendered HTML:"
          code={`// User visits: https://mysite.com/about\n\n// Step 1: Sling maps URL → JCR Resource\n//   "/content/mysite/en/about" → Node in repository\n\n// Step 2: Read sling:resourceType\n//   sling:resourceType = "mysite/components/page"\n\n// Step 3: Find rendering script\n//   /apps/mysite/components/page/page.html\n\n// Step 4: Execute HTL + Sling Model → HTML`}
          result={`<!DOCTYPE html>\n<html>\n  <head><title>About Us - MySite</title></head>\n  <body>\n    <h1>About Us</h1>\n    <p>Welcome to our company...</p>\n  </body>\n</html>`}
        />

        <Quiz questions={[
          { question: "What does AEM stand for?", options: ["Adobe Enterprise Manager", "Adobe Experience Manager", "Advanced Experience Module", "Apache Experience Manager"], correct: 1, explanation: "AEM = Adobe Experience Manager, Adobe's enterprise CMS." },
          { question: "What type of database does AEM use?", options: ["MySQL", "MongoDB", "JCR (Java Content Repository)", "PostgreSQL"], correct: 2, explanation: "AEM uses JCR — a hierarchical, tree-based content repository." },
          { question: "Which is NOT an AEM module?", options: ["AEM Sites", "AEM Assets", "AEM Forms", "AEM Kubernetes"], correct: 3, explanation: "AEM Kubernetes doesn't exist. Modules: Sites, Assets, Forms, Cloud Service." },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // ARCHITECTURE
    // ══════════════════════════════════════════════
    architecture: () => (
      <>
        <SectionTitle>AEM Architecture</SectionTitle>
        <Para>
          AEM is a layered stack built on open-source Java technologies. Understanding each layer is essential for effective AEM development.
        </Para>

        <SubTitle>The Technology Stack (Bottom-Up)</SubTitle>
        <CodeBlock title="AEM Stack" code={`┌─────────────────────────────────────────┐
│            AEM Application              │  ← Your components, templates, workflows
├─────────────────────────────────────────┤
│          Apache Sling                   │  ← REST-based web framework
├─────────────────────────────────────────┤
│       Apache Jackrabbit Oak             │  ← JCR implementation (content DB)
├─────────────────────────────────────────┤
│           OSGi (Felix)                  │  ← Module/service management
├─────────────────────────────────────────┤
│              JVM (Java)                 │  ← Runtime
└─────────────────────────────────────────┘`} />

        <SubTitle>1. JCR (Java Content Repository)</SubTitle>
        <Para>
          The JCR is a hierarchical, tree-structured content repository — think of it as a file system meets database. Every piece of content in AEM is a "node" in this tree, and nodes have "properties" (key-value pairs).
        </Para>
        <CodeBlock title="JCR Node Structure Example" language="text" code={`/content
  /mysite
    /en
      /home
        jcr:primaryType = "cq:Page"
        /jcr:content
          jcr:title = "Home Page"
          sling:resourceType = "mysite/components/page/home"
          /hero
            text = "Welcome to MySite"
            imageRef = "/content/dam/mysite/hero.jpg"`} />

        <SubTitle>2. OSGi (Open Services Gateway initiative)</SubTitle>
        <Para>
          OSGi is the modular framework that manages Java bundles (JARs with metadata). Each bundle can declare services, import/export packages, and be started/stopped independently — without restarting AEM.
        </Para>
        <CodeBlock title="OSGi Bundle Lifecycle" code={`INSTALLED → RESOLVED → STARTING → ACTIVE → STOPPING → UNINSTALLED

Key concepts:
• Bundle    = A JAR with OSGi metadata (MANIFEST.MF)
• Service   = A Java interface registered in the OSGi service registry
• Component = An OSGi Declarative Services component (annotated class)
• Config    = OSGi configuration (via Felix Console or .cfg.json files)`} />

        <SubTitle>3. Apache Sling</SubTitle>
        <Para>
          Sling is the web framework that sits on top of JCR. It resolves incoming HTTP requests to JCR resources and dispatches them to rendering scripts. The magic: <InlineCode>URL → Resource → Script → Response</InlineCode>.
        </Para>
        <CodeBlock title="Sling Request Processing" code={`Request: GET /content/mysite/en/home.html

Step 1: Resource Resolution
  URL "/content/mysite/en/home" → JCR node at that path
  
Step 2: Find sling:resourceType
  Node has sling:resourceType = "mysite/components/page/home"

Step 3: Script Resolution
  Looks for rendering script at:
  /apps/mysite/components/page/home/home.html (HTL file)
  
Step 4: Render & Return Response`} />

        <SubTitle>4. Author & Publish Architecture</SubTitle>
        <CodeBlock title="Deployment Topology" code={`                    ┌──────────────┐
  Authors ─────────→│   Author     │
                    │  Instance    │──── Replication ────┐
                    │  (port 4502) │                     │
                    └──────────────┘                     ▼
                                                 ┌──────────────┐
  Users ── Dispatcher (Cache) ─────────────────→│   Publish    │
                                                 │  Instance    │
                                                 │  (port 4503) │
                                                 └──────────────┘

• Author: Content creation, workflows, page editing
• Publish: Serves content to end users
• Dispatcher: Apache module for caching & load balancing`} />

        <InfoBox type="important" title="Golden Rule">
          Never expose the Author instance to the public internet. Always use a Dispatcher in front of Publish instances for caching and security.
        </InfoBox>


        <TryItBlock
          description="Trace a request from browser to AEM response:"
          code={`GET /content/mysite/en/home.html HTTP/1.1\nHost: www.mysite.com\n\n// Request travels through:\n// 1. CDN (edge cache check)\n// 2. Dispatcher (file cache check)\n// 3. AEM Publish instance\n//    → Sling Engine\n//    → Resource Resolution: URL → /content/mysite/en/home\n//    → Script Resolution: sling:resourceType → HTL\n//    → Sling Model executes Java logic\n//    → HTL renders HTML\n// 4. Response cached by Dispatcher\n// 5. HTML returned to browser`}
          result={`HTTP/1.1 200 OK\nContent-Type: text/html\nCache-Control: max-age=300\n\n<!DOCTYPE html>\n<html>..rendered page..</html>\n\n// Next request for same URL:\n// Served directly from Dispatcher cache (< 1ms)`}
        />

        <Quiz questions={[
          { question: "What port does AEM Author run on by default?", options: ["4503", "8080", "4502", "3000"], correct: 2, explanation: "Author = 4502, Publish = 4503." },
          { question: "What sits between users and AEM Publish?", options: ["OSGi Console", "Dispatcher", "CRXDE Lite", "Package Manager"], correct: 1, explanation: "Dispatcher is an Apache module for caching and security." },
          { question: "Moving content from Author to Publish is called?", options: ["Deployment", "Sync", "Replication", "Migration"], correct: 2 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // SETUP
    // ══════════════════════════════════════════════
    setup: () => (
      <>
        <SectionTitle>Setup & Installation</SectionTitle>
        <Para>Setting up a local AEM development environment requires the AEM SDK/JAR, Java JDK, Maven, and an IDE.</Para>

        <SubTitle>Prerequisites</SubTitle>
        <CodeBlock title="Required Software" code={`# 1. Java JDK 11 (AEM 6.5) or JDK 11/17 (AEM Cloud Service)
java -version
# Expected: java version "11.0.x"

# 2. Apache Maven 3.6+
mvn -version
# Expected: Apache Maven 3.6.x+

# 3. Node.js 18+ (for frontend module)
node -v

# 4. IDE: IntelliJ IDEA or VS Code
# Recommended plugins:
#   - AEM IDE Tooling (for IntelliJ)
#   - AEM Repo Tool (for code sync)`} />

        <SubTitle>Starting AEM Locally</SubTitle>
        <CodeBlock title="Start AEM Author Instance" language="bash" code={`# Place your AEM JAR and license.properties in a folder
# Rename the JAR to follow convention:
mv aem-sdk-quickstart-*.jar aem-author-p4502.jar

# Start the Author instance (port 4502)
java -jar aem-author-p4502.jar

# First boot takes 5-10 minutes
# Access at: http://localhost:4502
# Default credentials: admin / admin`} />

        <CodeBlock title="Start AEM Publish Instance" language="bash" code={`# Copy the JAR for Publish
cp aem-author-p4502.jar aem-publish-p4503.jar

# Start in publish run mode
java -jar aem-publish-p4503.jar -r publish

# Access at: http://localhost:4503`} />

        <SubTitle>Creating a New AEM Project</SubTitle>
        <CodeBlock title="Generate Project from Archetype" language="bash" code={`# Use the AEM Project Archetype (v56+)
mvn -B archetype:generate \\
  -D archetypeGroupId=com.adobe.aem \\
  -D archetypeArtifactId=aem-project-archetype \\
  -D archetypeVersion=56 \\
  -D appTitle="My Site" \\
  -D appId="mysite" \\
  -D groupId="com.mysite" \\
  -D aemVersion="cloud"

# Build and deploy to local Author
cd mysite
mvn clean install -PautoInstallSinglePackage`} />

        <InfoBox type="tip" title="Pro Tip">
          Use <InlineCode>-PautoInstallSinglePackage</InlineCode> to deploy to Author (4502) and <InlineCode>-PautoInstallSinglePackagePublish</InlineCode> for Publish (4503).
        </InfoBox>

        <SubTitle>Key URLs After Setup</SubTitle>
        <CodeBlock title="Important AEM URLs" code={`http://localhost:4502/crx/de        → CRXDE Lite (content browser)
http://localhost:4502/system/console → OSGi Felix Console
http://localhost:4502/sites.html     → Sites Console
http://localhost:4502/assets.html    → DAM Console
http://localhost:4502/crx/packmgr    → Package Manager
http://localhost:4502/libs/granite/operations/content/systemoverview.html → System Overview`} />


        <TryItBlock
          description="Generate and deploy an AEM project from scratch:"
          code={`# Step 1: Generate project\nmvn -B archetype:generate \\\n  -D archetypeGroupId=com.adobe.aem \\\n  -D archetypeArtifactId=aem-project-archetype \\\n  -D archetypeVersion=56 \\\n  -D appTitle="My Site" \\\n  -D appId="mysite" \\\n  -D groupId="com.mysite" \\\n  -D aemVersion="cloud"\n\n# Step 2: Build & deploy\ncd mysite\nmvn clean install -PautoInstallSinglePackage`}
          result={`[INFO] Reactor Summary:\n[INFO] mysite (parent) ..................... SUCCESS\n[INFO] mysite - Core ...................... SUCCESS\n[INFO] mysite - UI apps ................... SUCCESS\n[INFO] mysite - UI content ................ SUCCESS\n[INFO] mysite - UI config ................. SUCCESS\n[INFO] mysite - UI frontend ............... SUCCESS\n[INFO] mysite - All ....................... SUCCESS\n[INFO] BUILD SUCCESS\n[INFO] Total time: 45.2s\n\n✓ Deployed to http://localhost:4502`}
        />

        <Quiz questions={[
          { question: "Which Java version does AEM Cloud Service require?", options: ["Java 8", "Java 11 or 17", "Java 21", "Any version"], correct: 1 },
          { question: "What Maven profile deploys to Author?", options: ["-Pauthor", "-PautoInstallSinglePackage", "-Pdeploy", "-Pinstall"], correct: 1, explanation: "-PautoInstallSinglePackage builds the 'all' package and deploys to port 4502." },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // PROJECT STRUCTURE
    // ══════════════════════════════════════════════
    "project-structure": () => (
      <>
        <SectionTitle>AEM Project Structure</SectionTitle>
        <Para>
          An AEM project generated from the archetype follows a multi-module Maven structure. Each module has a specific purpose.
        </Para>

        <CodeBlock title="Project Folder Layout" code={`mysite/
├── pom.xml                    # Parent POM (reactor)
├── all/                       # Container package (embeds all sub-packages)
│   └── pom.xml
├── core/                      # Java backend (OSGi bundles, Sling Models, Servlets)
│   ├── pom.xml
│   └── src/main/java/com/mysite/core/
│       ├── models/            # Sling Models
│       ├── servlets/          # Sling Servlets
│       ├── services/          # OSGi Services
│       └── filters/           # Servlet Filters
├── ui.apps/                   # AEM components, templates, configs
│   └── src/main/content/jcr_root/
│       └── apps/mysite/
│           ├── components/    # AEM Components (HTL + dialog)
│           ├── clientlibs/    # CSS/JS Client Libraries
│           └── osgiconfig/    # OSGi configurations
├── ui.content/                # Sample/demo content
│   └── src/main/content/jcr_root/
│       └── content/mysite/    # Page content
├── ui.config/                 # Run-mode specific OSGi configs
├── ui.frontend/               # Frontend module (Webpack/Vite)
│   ├── src/main/webpack/
│   │   ├── site/              # SCSS & JS source
│   │   └── components/        # Component-specific CSS/JS
│   └── package.json
├── dispatcher/                # Dispatcher config (for Cloud Service)
│   └── src/conf.d/
│       ├── available_vhosts/
│       └── dispatcher_vhost.conf
└── it.tests/                  # Integration tests`} />

        <SubTitle>Module Responsibilities</SubTitle>
        <InfoBox type="info" title="core/">
          Contains all Java code: Sling Models, OSGi services, servlets, schedulers, workflow steps. Compiles into an OSGi bundle JAR.
        </InfoBox>
        <InfoBox type="info" title="ui.apps/">
          Contains AEM-specific artifacts: component definitions (HTL scripts, dialog XMLs), editable templates, page policies, clientlibs, and OSGi configs. Deployed as a content package.
        </InfoBox>
        <InfoBox type="info" title="ui.frontend/">
          Modern frontend build pipeline. Write SCSS/JS/TS here. Webpack or Vite compiles and copies output to ui.apps clientlibs.
        </InfoBox>
        <InfoBox type="info" title="ui.content/">
          Mutable content: sample pages, experience fragments, content policies. In Cloud Service, this is deployed only to Author.
        </InfoBox>

        <SubTitle>Understanding content/apps/libs</SubTitle>
        <CodeBlock title="JCR Root Paths" code={`/apps/       → Your project code (components, templates, configs)
              Immutable in Cloud Service — deployed via CI/CD

/content/    → Authored content (pages, assets, experience fragments)
              Mutable — created/edited by authors

/libs/       → AEM core/product code (DO NOT modify directly)
              Overlayed by placing same structure in /apps/

/conf/       → Editable templates and policies
/etc/        → Legacy configs (deprecated, use /conf/)
/var/        → System-generated content (audit logs, workflows)
/tmp/        → Temporary storage
/home/       → User and group data`} />

        <InfoBox type="warning" title="Never Modify /libs">
          Always use overlays and overrides. Copy the node from /libs to the same path under /apps to customize it. AEM's Sling Resource Merger handles the rest.
        </InfoBox>


        <Quiz questions={[
          { question: "Which module contains Sling Models?", options: ["ui.apps/", "core/", "ui.frontend/", "ui.config/"], correct: 1 },
          { question: "Where should you NEVER modify files directly?", options: ["/apps/", "/content/", "/libs/", "/conf/"], correct: 2, explanation: "/libs/ is AEM product code. Use overlays in /apps/ to customize." },
          { question: "What module compiles SCSS/JS to clientlibs?", options: ["core/", "ui.content/", "ui.frontend/", "all/"], correct: 2 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // JCR
    // ══════════════════════════════════════════════
    jcr: () => (
      <>
        <SectionTitle>JCR & Content Repository</SectionTitle>
        <Para>
          The Java Content Repository (JCR) is the foundation of AEM's data storage. Based on the JSR-283 specification, it stores content as a hierarchical tree of nodes and properties — similar to a file system but far more powerful.
        </Para>

        <SubTitle>Nodes and Properties</SubTitle>
        <Para>
          Every piece of data in AEM is stored as a <InlineCode>Node</InlineCode>. Nodes can have child nodes (forming a tree) and <InlineCode>Properties</InlineCode> (key-value pairs).
        </Para>
        <CodeBlock title="Node Types" code={`Common Node Types:
─────────────────
nt:unstructured    → Most flexible, accepts any properties/children
cq:Page            → Represents a page (has jcr:content child)
cq:PageContent     → The jcr:content node under a page
dam:Asset          → A DAM asset
nt:folder          → Simple folder
sling:Folder       → Sling-aware folder
sling:OrderedFolder→ Ordered folder (maintains child order)`} />

        <SubTitle>Working with JCR API</SubTitle>
        <CodeBlock title="JCR API Example (Java)" language="java" code={`import javax.jcr.Session;
import javax.jcr.Node;

// Get the JCR session (injected via Sling)
@Reference
private ResourceResolverFactory resolverFactory;

public void readContent() throws Exception {
    // Get a service resource resolver
    Map<String, Object> params = Map.of(
        ResourceResolverFactory.SUBSERVICE, "myservice"
    );
    
    try (ResourceResolver resolver = 
            resolverFactory.getServiceResourceResolver(params)) {
        
        Session session = resolver.adaptTo(Session.class);
        
        // Read a node
        Node pageNode = session.getNode("/content/mysite/en/home/jcr:content");
        
        // Read properties
        String title = pageNode.getProperty("jcr:title").getString();
        boolean hideInNav = pageNode.getProperty("hideInNav").getBoolean();
        
        // Create a new node
        Node newNode = pageNode.addNode("banner", "nt:unstructured");
        newNode.setProperty("heading", "Welcome!");
        newNode.setProperty("enabled", true);
        
        // Save changes
        session.save();
    }
}`} />

        <SubTitle>Sling Resource API (Preferred)</SubTitle>
        <Para>
          In modern AEM development, prefer the Sling Resource API over the raw JCR API. It's higher-level, safer, and integrates better with Sling Models.
        </Para>
        <CodeBlock title="Sling Resource API" language="java" code={`// Using Resource API (preferred over JCR API)
Resource pageResource = resolver.getResource("/content/mysite/en/home/jcr:content");

if (pageResource != null) {
    // Read properties via ValueMap
    ValueMap props = pageResource.getValueMap();
    String title = props.get("jcr:title", "Default Title");
    String[] tags = props.get("cq:tags", String[].class);
    
    // Iterate children
    for (Resource child : pageResource.getChildren()) {
        String childName = child.getName();
        String resourceType = child.getResourceType();
    }
    
    // Adapt to a specific type
    Page page = pageResource.getParent().adaptTo(Page.class);
}`} />

        <SubTitle>JCR Queries</SubTitle>
        <CodeBlock title="Query Examples" language="java" code={`// 1. SQL2 Query (recommended for Oak)
String query = "SELECT * FROM [cq:Page] AS page " +
    "WHERE ISDESCENDANTNODE(page, '/content/mysite') " +
    "AND page.[jcr:content/jcr:title] LIKE '%news%'";

Iterator<Resource> results = resolver.findResources(query, "JCR-SQL2");

// 2. QueryBuilder API (AEM-specific, great for servlets)
Map<String, String> queryMap = new HashMap<>();
queryMap.put("path", "/content/mysite");
queryMap.put("type", "cq:Page");
queryMap.put("property", "jcr:content/jcr:title");
queryMap.put("property.operation", "like");
queryMap.put("property.value", "%news%");
queryMap.put("p.limit", "10");
queryMap.put("orderby", "@jcr:content/cq:lastModified");
queryMap.put("orderby.sort", "desc");

Query query = queryBuilder.createQuery(
    PredicateGroup.create(queryMap), session);
SearchResult result = query.getResult();

for (Hit hit : result.getHits()) {
    String path = hit.getPath();
    Resource resource = hit.getResource();
}`} />

        <InfoBox type="warning" title="Query Performance">
          Always include a path constraint in queries to avoid full repository traversals. Use Oak indexes for frequently-run queries. Avoid queries in request-time code if possible — use them in scheduled jobs or async operations.
        </InfoBox>


        <TryItBlock
          description="Read content using the Sling Resource API:"
          code={`Resource pageRes = resolver.getResource(\n    "/content/mysite/en/home/jcr:content");\n\nValueMap props = pageRes.getValueMap();\nString title = props.get("jcr:title", "Default");\nboolean hide = props.get("hideInNav", false);\n\nfor (Resource child : pageRes.getChildren()) {\n    System.out.println(child.getName());\n}`}
          result={`title  = "Home Page"\nhide   = false\n\nChildren:\n  hero\n  content\n  sidebar\n  footer`}
        />

        <Quiz questions={[
          { question: "What is the most flexible JCR node type?", options: ["cq:Page", "nt:folder", "nt:unstructured", "sling:Folder"], correct: 2 },
          { question: "Which API is preferred over raw JCR API?", options: ["JDBC API", "Sling Resource API", "DOM API", "REST API"], correct: 1, explanation: "Sling Resource API is higher-level, safer, and integrates with Sling Models." },
          { question: "What must you ALWAYS include in JCR queries?", options: ["ORDER BY", "LIMIT", "Path constraint", "JOIN"], correct: 2 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // OSGI
    // ══════════════════════════════════════════════
    osgi: () => (
      <>
        <SectionTitle>OSGi Framework</SectionTitle>
        <Para>
          OSGi (Open Services Gateway initiative) is the modular framework underlying AEM. It manages Java bundles (modules), their dependencies, and services. Understanding OSGi is crucial for backend AEM development.
        </Para>

        <SubTitle>OSGi Components with DS Annotations</SubTitle>
        <Para>
          Modern AEM uses OSGi Declarative Services (DS) R7 annotations. These replaced the older Felix SCR annotations.
        </Para>
        <CodeBlock title="OSGi Service Example" language="java" code={`package com.mysite.core.services.impl;

import com.mysite.core.services.GreetingService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.osgi.service.metatype.annotations.AttributeDefinition;

// 1. Define the configuration interface
@ObjectClassDefinition(
    name = "Greeting Service Configuration",
    description = "Configures the greeting service"
)
public @interface GreetingConfig {
    @AttributeDefinition(
        name = "Greeting Prefix",
        description = "Prefix added before the name"
    )
    String greeting_prefix() default "Hello";

    @AttributeDefinition(
        name = "Enabled",
        description = "Enable/disable the service"
    )
    boolean enabled() default true;
}

// 2. Implement the service
@Component(
    service = GreetingService.class,
    immediate = true
)
@Designate(ocd = GreetingConfig.class)
public class GreetingServiceImpl implements GreetingService {

    private String prefix;
    private boolean enabled;

    @Activate
    @Modified
    protected void activate(GreetingConfig config) {
        this.prefix = config.greeting_prefix();
        this.enabled = config.enabled();
    }

    @Deactivate
    protected void deactivate() {
        // Cleanup if needed
    }

    @Override
    public String greet(String name) {
        if (!enabled) return "Service disabled";
        return prefix + ", " + name + "!";
    }
}`} />

        <SubTitle>Service Interface</SubTitle>
        <CodeBlock title="Service Interface" language="java" code={`package com.mysite.core.services;

public interface GreetingService {
    String greet(String name);
}`} />

        <SubTitle>Injecting Services</SubTitle>
        <CodeBlock title="Using @Reference" language="java" code={`import org.osgi.service.component.annotations.Reference;

@Component(service = SomeOtherService.class)
public class SomeOtherServiceImpl implements SomeOtherService {

    // Inject another OSGi service
    @Reference
    private GreetingService greetingService;

    // Inject with filter
    @Reference(target = "(component.name=com.mysite.core.services.impl.SpecialImpl)")
    private GreetingService specialGreeting;

    // Inject multiple services
    @Reference(
        cardinality = ReferenceCardinality.MULTIPLE,
        policy = ReferencePolicy.DYNAMIC
    )
    private volatile List<GreetingService> allGreetings;
}`} />

        <SubTitle>OSGi Configuration (JSON)</SubTitle>
        <CodeBlock title="OSGi Config File: com.mysite.core.services.impl.GreetingServiceImpl.cfg.json" language="json" code={`{
    "greeting.prefix": "Welcome",
    "enabled": true
}

// File location in project:
// ui.config/src/main/content/jcr_root/apps/mysite/osgiconfig/
//   config/           → All run modes
//   config.author/    → Author only
//   config.publish/   → Publish only
//   config.dev/       → Dev environment only`} />

        <InfoBox type="tip" title="DS Annotation Migration">
          If you see old Felix annotations like <InlineCode>@org.apache.felix.scr.annotations.Component</InlineCode>, migrate to <InlineCode>@org.osgi.service.component.annotations.Component</InlineCode>. The OSGi R7 annotations are the standard.
        </InfoBox>


        <TryItBlock
          description="Create an OSGi service with configurable greeting:"
          code={`@Component(service = GreetingService.class)\n@Designate(ocd = GreetingConfig.class)\npublic class GreetingServiceImpl implements GreetingService {\n\n    private String prefix;\n\n    @Activate @Modified\n    protected void activate(GreetingConfig config) {\n        this.prefix = config.greeting_prefix();\n    }\n\n    @Override\n    public String greet(String name) {\n        return prefix + ", " + name + "!";\n    }\n}`}
          result={`// Default config: greeting.prefix = "Hello"\ngreetingService.greet("Arvi")\n→ "Hello, Arvi!"\n\n// After config change to "Welcome":\n// @Modified triggers automatically!\ngreetingService.greet("Arvi")\n→ "Welcome, Arvi!"`}
        />

        <Quiz questions={[
          { question: "Which annotation replaces old Felix @Component?", options: ["@Service", "@org.osgi.service.component.annotations.Component", "@Bean", "@Injectable"], correct: 1 },
          { question: "What triggers when OSGi config changes at runtime?", options: ["@Activate", "@Modified", "@Deactivate", "@Updated"], correct: 1, explanation: "@Modified is called when config updates without bundle restart." },
          { question: "What file format for OSGi configs in Cloud Service?", options: [".xml", ".properties", ".cfg.json", ".yaml"], correct: 2 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // SLING
    // ══════════════════════════════════════════════
    sling: () => (
      <>
        <SectionTitle>Apache Sling</SectionTitle>
        <Para>
          Apache Sling is the REST-based web framework that powers AEM's content delivery. Its core principle: <strong>content is king</strong>. URLs map directly to content resources in the JCR, and the framework finds the right script to render them.
        </Para>

        <SubTitle>URL Decomposition</SubTitle>
        <Para>Sling decomposes every URL into parts to resolve the correct resource and rendering script:</Para>
        <CodeBlock title="Sling URL Anatomy" code={`URL: /content/mysite/en/products.search.html/bikes?color=red

Decomposition:
──────────────
Resource Path  : /content/mysite/en/products
Selectors      : search
Extension      : html
Suffix          : /bikes
Query Params   : color=red

How Sling uses this:
1. Resource Resolution → find JCR node at /content/mysite/en/products
2. Read sling:resourceType → "mysite/components/page/products"
3. Script Resolution → look for script matching selectors + extension:
   /apps/mysite/components/page/products/search.html
   (falls back to products.html if search.html not found)`} />

        <SubTitle>Script Resolution Order</SubTitle>
        <CodeBlock title="Script Resolution Priority" code={`For resource type "mysite/components/page/products"
with selector "search" and extension "html":

Sling looks for scripts in this order:
1. /apps/mysite/components/page/products/search.html      ← exact match
2. /apps/mysite/components/page/products/products.html     ← name match
3. /apps/mysite/components/page/products/html.html         ← extension match
4. /apps/mysite/components/page/products/GET.html          ← method match

For the resource super type (inheritance):
5. /apps/core/wcm/components/page/search.html
6. /apps/core/wcm/components/page/page.html
... and so on up the resource type hierarchy`} />

        <SubTitle>sling:resourceType & sling:resourceSuperType</SubTitle>
        <CodeBlock title="Resource Type Inheritance" language="xml" code={`<!-- In .content.xml of your component -->
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Product Page"
    sling:resourceSuperType="core/wcm/components/page/v3/page"
    componentGroup="MySite - Structure"/>

<!-- This means:
     Your "Product Page" EXTENDS the Core Page component.
     Sling will fall back to core page scripts if yours don't exist. -->`} />

        <SubTitle>Request Processing Pipeline</SubTitle>
        <CodeBlock title="Sling Request Flow" code={`HTTP Request
    │
    ▼
┌─────────────────────┐
│  Sling Engine        │ ← Servlet container integration
├─────────────────────┤
│  Authentication      │ ← Verify user credentials
├─────────────────────┤
│  Resource Resolution │ ← URL → JCR Resource mapping
├─────────────────────┤
│  Servlet/Script      │ ← Find the right handler
│  Resolution          │
├─────────────────────┤
│  Request Filters     │ ← Pre-processing (SlingServletFilter)
├─────────────────────┤
│  Servlet Execution   │ ← Your HTL script, Servlet, etc.
├─────────────────────┤
│  Response Filters    │ ← Post-processing
├─────────────────────┤
│  HTTP Response       │
└─────────────────────┘`} />

        <InfoBox type="info" title="Key Sling Principle">
          In Sling, the content determines the rendering, not the URL pattern. This is the opposite of MVC frameworks like Spring MVC where controllers define routes. In AEM/Sling, the JCR content node's <InlineCode>sling:resourceType</InlineCode> property determines which component renders it.
        </InfoBox>


        <TryItBlock
          description="How Sling decomposes a URL into parts:"
          code={`URL: /content/mysite/en/products.search.html/bikes?color=red\n\nSling Decomposition:\n  Resource Path : /content/mysite/en/products\n  Selectors     : search\n  Extension     : html\n  Suffix        : /bikes\n  Query Params  : color=red`}
          result={`Sling uses each part:\n\n1. Resource Path  → Find JCR node at that path\n2. Selectors      → Pick specific rendering script (search.html)\n3. Extension      → Output format (html, json, xml)\n4. Suffix         → Additional path info for the script\n5. Query Params   → Passed to servlet/model as parameters\n\nScript resolved: /apps/mysite/components/page/products/search.html`}
        />

        <Quiz questions={[
          { question: "In URL /content/site/page.search.json, what is 'search'?", options: ["Extension", "Selector", "Suffix", "Parameter"], correct: 1 },
          { question: "Which property defines component inheritance?", options: ["jcr:superType", "sling:resourceSuperType", "cq:inherits", "extends"], correct: 1 },
          { question: "In Sling, what determines the rendering?", options: ["URL pattern", "Controller mapping", "Content's sling:resourceType", "File extension"], correct: 2 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // SLING MODELS
    // ══════════════════════════════════════════════
    "sling-models": () => (
      <>
        <SectionTitle>Sling Models</SectionTitle>
        <Para>
          Sling Models are POJO-based (Plain Old Java Objects) annotations-driven models that map JCR content to Java objects. They are the standard way to write backend logic for AEM components.
        </Para>

        <SubTitle>Basic Sling Model</SubTitle>
        <CodeBlock title="Simple Sling Model" language="java" code={`package com.mysite.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

@Model(
    adaptables = Resource.class,              // Can adapt from Resource
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL  // null if missing
)
public class HeroModel {

    @ValueMapValue
    private String title;                      // Maps to "title" property

    @ValueMapValue
    private String description;

    @ValueMapValue(name = "fileReference")     // Maps to "fileReference" property
    private String imagePath;

    @ValueMapValue
    private boolean ctaEnabled;                // boolean with default false

    // Getters
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImagePath() { return imagePath; }
    public boolean isCtaEnabled() { return ctaEnabled; }
}`} />

        <SubTitle>Advanced Sling Model with @PostConstruct</SubTitle>
        <CodeBlock title="Advanced Model" language="java" code={`package com.mysite.core.models;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.*;
import org.apache.sling.models.annotations.injectorspecific.*;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import javax.annotation.PostConstruct;
import java.util.*;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = NavigationModel.class,           // Interface it implements
    resourceType = "mysite/components/navigation",
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class NavigationModelImpl implements NavigationModel {

    @Self
    private SlingHttpServletRequest request;

    @SlingObject
    private ResourceResolver resourceResolver;

    @SlingObject
    private Resource resource;

    @ValueMapValue
    private String rootPath;

    @ValueMapValue
    private int depth;

    @OSGiService                               // Inject an OSGi service
    private ExternalizerService externalizer;

    @ScriptVariable                            // Inject HTL script variable
    private Page currentPage;

    private List<NavItem> navItems;

    @PostConstruct                             // Runs after injection
    protected void init() {
        navItems = new ArrayList<>();
        if (rootPath == null) {
            rootPath = currentPage.getAbsoluteParent(2).getPath();
        }
        
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Page rootPage = pageManager.getPage(rootPath);
        
        if (rootPage != null) {
            buildNavTree(rootPage, 0);
        }
    }

    private void buildNavTree(Page page, int currentDepth) {
        if (currentDepth > depth) return;
        for (Page child : page.listChildren()) {
            if (!child.isHideInNav()) {
                navItems.add(new NavItem(
                    child.getTitle(),
                    child.getPath() + ".html",
                    currentPage.getPath().equals(child.getPath())
                ));
            }
        }
    }

    @Override
    public List<NavItem> getNavItems() { return navItems; }
}`} />

        <SubTitle>Sling Model Injection Annotations</SubTitle>
        <CodeBlock title="Injection Cheat Sheet" code={`@ValueMapValue         → Injects a property from the resource's ValueMap
@ChildResource         → Injects a child resource as another Model
@SlingObject           → Injects Sling objects (Resource, ResourceResolver, etc.)
@OSGiService           → Injects an OSGi service
@Self                  → Injects the adaptable itself (Request or Resource)
@ScriptVariable        → Injects HTL script variables (currentPage, properties, etc.)
@RequestAttribute      → Injects a request attribute (set via data-sly-use)
@ResourcePath          → Injects a resource by absolute/relative path

// Default injection strategies:
DefaultInjectionStrategy.REQUIRED  → Throws if value missing (default)
DefaultInjectionStrategy.OPTIONAL  → Returns null if missing`} />

        <SubTitle>Sling Model Exporter (JSON API)</SubTitle>
        <CodeBlock title="Jackson Exporter for JSON" language="java" code={`@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { HeroModel.class, SlingModel.class },
    resourceType = "mysite/components/hero"
)
@Exporter(
    name = "jackson",
    extensions = "json",
    options = {
        @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "true")
    }
)
public class HeroModelImpl implements HeroModel {
    @ValueMapValue
    private String title;

    @Override
    public String getTitle() { return title; }
}

// Access JSON at: /content/mysite/en/home/jcr:content/hero.model.json
// Returns: { "title": "Welcome to My Site" }`} />

        <InfoBox type="tip" title="Best Practice">
          Always use an interface + implementation pattern for Sling Models. The interface goes in <InlineCode>core/models/</InlineCode> and the implementation in <InlineCode>core/models/impl/</InlineCode>. This allows mocking in unit tests.
        </InfoBox>


        <TryItBlock
          description="A Sling Model maps JCR properties to Java fields:"
          code={`@Model(adaptables = Resource.class,\n    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)\npublic class HeroModel {\n\n    @ValueMapValue\n    private String title;\n\n    @ValueMapValue(name = "fileReference")\n    private String imagePath;\n\n    @ValueMapValue\n    private boolean ctaEnabled;\n\n    // Getters...\n}`}
          result={`Given JCR content at /content/mysite/en/home/jcr:content/hero:\n  title = "Welcome to AEM"\n  fileReference = "/content/dam/hero.jpg"\n  ctaEnabled = true\n\nmodel.getTitle()     → "Welcome to AEM"\nmodel.getImagePath() → "/content/dam/hero.jpg"\nmodel.isCtaEnabled() → true`}
        />

        <Quiz questions={[
          { question: "Which annotation reads a property from ValueMap?", options: ["@Inject", "@Value", "@ValueMapValue", "@Property"], correct: 2 },
          { question: "What does @OSGiService inject?", options: ["A JCR node", "An OSGi service", "A Sling resource", "A page property"], correct: 1 },
          { question: "What URL accesses a model's JSON export?", options: ["resource.json", "resource.model.json", "resource.export.json", "resource.api"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // RESOURCE RESOLUTION
    // ══════════════════════════════════════════════
    "resource-resolution": () => (
      <>
        <SectionTitle>Resource Resolution</SectionTitle>
        <Para>
          Resource Resolution is the process by which Sling maps an incoming URL to a JCR resource. It's one of the most critical concepts in AEM because it determines which content and script will handle every request.
        </Para>

        <SubTitle>Mapping Rules</SubTitle>
        <CodeBlock title="Resource Resolver Mapping" code={`# /etc/map/http (JCR-based URL mappings)
# Maps external URLs to internal JCR paths

External URL                    →  Internal Path
─────────────────────────────────────────────────────
https://www.mysite.com/         →  /content/mysite/en/
https://www.mysite.com/about    →  /content/mysite/en/about

# Configuration via sling:mapping nodes:
/etc/map/http/
  www.mysite.com/
    sling:internalRedirect = ["/content/mysite/en/"]
    sling:match = "www\\.mysite\\.com\\.4503"`} />

        <SubTitle>Vanity URLs</SubTitle>
        <CodeBlock title="Vanity URL Configuration" language="xml" code={`<!-- On a page's jcr:content node -->
<jcr:content
    jcr:primaryType="cq:PageContent"
    sling:vanityPath="/about-us"
    sling:vanityOrder="100"
    sling:redirect="false"/>

<!-- Now /about-us resolves to this page -->
<!-- sling:redirect=true would send a 302 redirect instead -->`} />

        <SubTitle>Resource Resolver Factory Config</SubTitle>
        <CodeBlock title="Service User Mapping" language="json" code={`// org.apache.sling.serviceusermapping.impl.ServiceUserMapperImpl.amended-mysite.cfg.json
{
    "user.mapping": [
        "com.mysite.core:myservice=[mysite-service-user]"
    ]
}

// This maps bundle "com.mysite.core" with subservice "myservice"
// to the system user "mysite-service-user"

// Usage in Java:
Map<String, Object> params = Map.of(
    ResourceResolverFactory.SUBSERVICE, "myservice"
);
ResourceResolver resolver = resolverFactory.getServiceResourceResolver(params);`} />

        <InfoBox type="important" title="Always Close ResourceResolvers">
          Service resource resolvers obtained via <InlineCode>getServiceResourceResolver()</InlineCode> must be closed explicitly. Use try-with-resources to prevent resource leaks.
        </InfoBox>


        <Quiz questions={[
          { question: "Where are URL mappings configured?", options: ["/content/mappings", "/etc/map", "/conf/sling/mapping", "/apps/sling/map"], correct: 1 },
          { question: "What must you always do with service ResourceResolvers?", options: ["Cache them", "Close them explicitly", "Share across threads", "Use admin session"], correct: 1, explanation: "Service resolvers must be closed in try-with-resources to prevent leaks." },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // HTL
    // ══════════════════════════════════════════════
    htl: () => (
      <>
        <SectionTitle>HTL (Sightly) — HTML Template Language</SectionTitle>
        <Para>
          HTL is AEM's recommended templating language, replacing JSP. It's secure by default (auto-escaping XSS), expressive, and keeps logic out of templates via Sling Models and Use-APIs.
        </Para>

        <SubTitle>Basic Syntax</SubTitle>
        <CodeBlock title="HTL Expressions" language="html" code={`<!-- Variable Output (auto-escaped) -->
<h1>\${properties.jcr:title}</h1>
<p>\${properties.description @ context='html'}</p>

<!-- Display Contexts -->
\${value @ context='text'}           <!-- Default: HTML text escaping -->
\${value @ context='html'}           <!-- No escaping (trusted HTML) -->
\${value @ context='attribute'}      <!-- Attribute escaping -->
\${value @ context='uri'}            <!-- URI escaping -->
\${value @ context='scriptString'}   <!-- JS string escaping -->
\${value @ context='unsafe'}         <!-- No escaping (DANGEROUS!) -->`} />

        <SubTitle>Block Statements</SubTitle>
        <CodeBlock title="HTL Block Statements" language="html" code={`<!-- data-sly-use: Load a Sling Model or Use-object -->
<sly data-sly-use.hero="com.mysite.core.models.HeroModel">
    <h1>\${hero.title}</h1>
    <p>\${hero.description}</p>
</sly>

<!-- data-sly-test: Conditional rendering -->
<div data-sly-test="\${hero.ctaEnabled}">
    <a href="\${hero.ctaLink}">\${hero.ctaText}</a>
</div>

<!-- Negation -->
<div data-sly-test="\${!hero.ctaEnabled}">
    <p>No CTA configured</p>
</div>

<!-- data-sly-list: Iterate over a collection -->
<ul data-sly-list.item="\${hero.navItems}">
    <li class="\${item.active ? 'active' : ''}">
        <a href="\${item.url}">\${item.title}</a>
        <!-- Built-in variables: itemList.index, itemList.count,
             itemList.first, itemList.last, itemList.odd, itemList.even -->
        <span>(\${itemList.index + 1} of \${itemList.count})</span>
    </li>
</ul>

<!-- data-sly-repeat: Like list but keeps the host element -->
<div data-sly-repeat.card="\${model.cards}" class="card">
    <h3>\${card.title}</h3>
    <p>\${card.text}</p>
</div>

<!-- data-sly-resource: Include another component -->
<div data-sly-resource="\${'header' @ resourceType='mysite/components/header'}"></div>

<!-- data-sly-include: Include another HTL script -->
<sly data-sly-include="partials/footer.html"/>

<!-- data-sly-template & data-sly-call: Reusable templates -->
<template data-sly-template.badge="\${@ label, color}">
    <span class="badge" style="background: \${color}">\${label}</span>
</template>

<sly data-sly-call="\${badge @ label='New', color='#e84a35'}"/>
<sly data-sly-call="\${badge @ label='Sale', color='#4ade80'}"/>`} />

        <SubTitle>data-sly-attribute & data-sly-element</SubTitle>
        <CodeBlock title="Dynamic Attributes" language="html" code={`<!-- Set dynamic attributes -->
<div data-sly-attribute.class="\${model.cssClass}"
     data-sly-attribute.id="\${model.elementId}">
    Content
</div>

<!-- Renders as: <div class="hero-banner" id="main-hero">Content</div> -->

<!-- Dynamic element tag -->
<h2 data-sly-element="\${model.headingLevel}">
    \${model.title}
</h2>
<!-- If headingLevel = 'h3', renders as: <h3>Title</h3> -->

<!-- Unwrap the host element (render only children) -->
<sly data-sly-unwrap>
    <p>This p tag renders, but no wrapper element</p>
</sly>`} />

        <SubTitle>HTL Built-in Objects</SubTitle>
        <CodeBlock title="Available Objects in HTL" code={`\${properties}        → ValueMap of current resource's properties
\${pageProperties}    → ValueMap of containing page's jcr:content
\${currentPage}       → com.day.cq.wcm.api.Page object
\${currentNode}       → javax.jcr.Node of current resource
\${resource}          → org.apache.sling.api.resource.Resource
\${request}           → SlingHttpServletRequest
\${response}          → SlingHttpServletResponse
\${wcmmode}           → WCM mode info (wcmmode.edit, wcmmode.preview, etc.)
\${currentDesign}     → Current design object
\${currentStyle}      → Current style (cell/design)`} />

        <InfoBox type="tip" title="Best Practice">
          Keep HTL templates thin — all business logic belongs in Sling Models. HTL should only handle presentation: conditionals, loops, and output. Never put complex logic in HTL expressions.
        </InfoBox>


        <TryItBlock
          description="HTL auto-escapes output to prevent XSS:"
          code={`<!-- If jcr:title = 'Hello <script>alert("xss")</script>' -->\n\n<!-- Auto-escaped (safe) -->\n<h1>${"${"}properties.jcr:title}</h1>\n\n<!-- With context='unsafe' (DANGEROUS) -->\n<h1>${"${"}properties.jcr:title @ context='unsafe'}</h1>`}
          result={`Auto-escaped output:\n  <h1>Hello &lt;script&gt;alert("xss")&lt;/script&gt;</h1>\n  → Safe! Script tags are escaped\n\nUnsafe output:\n  <h1>Hello <script>alert("xss")</script></h1>\n  → DANGEROUS! Script would execute!`}
        />

        <Quiz questions={[
          { question: "Which HTL attribute loads a Sling Model?", options: ["data-sly-model", "data-sly-use", "data-sly-load", "data-sly-import"], correct: 1 },
          { question: "What does itemList.count give in data-sly-list?", options: ["Current index", "Total items", "Is last item", "Item value"], correct: 1 },
          { question: "Which context disables XSS escaping?", options: ["html", "text", "unsafe", "raw"], correct: 2, explanation: "context='unsafe' disables all escaping — never use it with user input!" },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // COMPONENTS
    // ══════════════════════════════════════════════
    components: () => (
      <>
        <SectionTitle>AEM Component Basics</SectionTitle>
        <Para>
          Components are the fundamental building blocks of AEM pages. Each component is a reusable unit with its own dialog (for authoring), HTL template (for rendering), and optional Sling Model (for logic).
        </Para>

        <SubTitle>Component File Structure</SubTitle>
        <CodeBlock title="Component Folder Layout" code={`/apps/mysite/components/
  /hero/
    ├── .content.xml        ← Component definition (metadata)
    ├── hero.html           ← HTL rendering script
    ├── _cq_dialog/
    │   └── .content.xml    ← Touch UI dialog definition
    ├── _cq_editConfig/
    │   └── .content.xml    ← Edit configuration (drop targets, listeners)
    ├── _cq_design_dialog/
    │   └── .content.xml    ← Design/Policy dialog
    └── clientlib/
        ├── css/
        │   └── hero.css    ← Component-specific CSS
        └── js/
            └── hero.js     ← Component-specific JS`} />

        <SubTitle>Component Definition (.content.xml)</SubTitle>
        <CodeBlock title=".content.xml" language="xml" code={`<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Hero Banner"
    jcr:description="Full-width hero banner with image and CTA"
    sling:resourceSuperType="core/wcm/components/image/v3/image"
    componentGroup="MySite - Content"
    cq:icon="hero-banner"/>

<!-- Key properties:
  jcr:title          → Display name in component browser
  componentGroup     → Category in component browser sidebar
  sling:resourceSuperType → Parent component (inheritance)
  cq:icon            → CoralUI icon name -->`} />

        <SubTitle>HTL Template (hero.html)</SubTitle>
        <CodeBlock title="hero.html" language="html" code={`<sly data-sly-use.model="com.mysite.core.models.HeroModel"/>

<div class="cmp-hero"
     data-sly-test="\${model.hasContent}"
     style="background-image: url('\${model.backgroundImage}')">
    
    <div class="cmp-hero__content">
        <h1 class="cmp-hero__title" data-sly-test="\${model.title}">
            \${model.title}
        </h1>
        
        <p class="cmp-hero__description" data-sly-test="\${model.description}">
            \${model.description}
        </p>
        
        <a class="cmp-hero__cta"
           data-sly-test="\${model.ctaLink && model.ctaText}"
           href="\${model.ctaLink}.html">
            \${model.ctaText}
        </a>
    </div>
</div>

<sly data-sly-test="\${!model.hasContent && wcmmode.edit}">
    <div class="cmp-hero--empty">
        <p>Please configure the Hero Banner component.</p>
    </div>
</sly>`} />

        <SubTitle>Core Components</SubTitle>
        <Para>
          Adobe provides a set of production-ready, well-tested Core Components. Always extend these instead of building from scratch.
        </Para>
        <CodeBlock title="Common Core Components" code={`Core Components (always prefer these as base):
─────────────────────────────────────────────
core/wcm/components/text/v2/text           → Rich text
core/wcm/components/image/v3/image         → Image with smart crop
core/wcm/components/title/v3/title         → Heading
core/wcm/components/button/v2/button       → Button/CTA
core/wcm/components/teaser/v2/teaser       → Teaser card
core/wcm/components/list/v4/list           → List of pages
core/wcm/components/navigation/v2/navigation → Site navigation
core/wcm/components/breadcrumb/v3/breadcrumb → Breadcrumb
core/wcm/components/carousel/v1/carousel   → Carousel/slider
core/wcm/components/tabs/v1/tabs           → Tabbed container
core/wcm/components/accordion/v1/accordion → Accordion
core/wcm/components/container/v1/container → Layout container
core/wcm/components/experiencefragment/v2/experiencefragment → XF
core/wcm/components/page/v3/page           → Page component

// Extend via sling:resourceSuperType in your component's .content.xml
// Then proxy in your project: /apps/mysite/components/text → extends core text`} />

        <InfoBox type="important" title="Proxy Components">
          Always create proxy components in your project that extend Core Components. Never reference <InlineCode>core/wcm/components/...</InlineCode> directly in templates. This gives you a layer to customize without modifying core code.
        </InfoBox>


        <TryItBlock
          description="A complete AEM component setup:"
          code={`// Component definition: .content.xml\njcr:primaryType="cq:Component"\njcr:title="Hero Banner"\nsling:resourceSuperType="core/wcm/components/image/v3/image"\ncomponentGroup="MySite - Content"\n\n// HTL template: hero.html\n<sly data-sly-use.model="com.mysite.core.models.HeroModel"/>\n<div class="cmp-hero" data-sly-test="${"${"}model.hasContent}">\n    <h1>${"${"}model.title}</h1>\n    <p>${"${"}model.description}</p>\n    <a href="${"${"}model.ctaLink}.html">${"${"}model.ctaText}</a>\n</div>`}
          result={`Rendered HTML:\n<div class="cmp-hero">\n    <h1>Welcome to My Site</h1>\n    <p>Learn AEM development with us</p>\n    <a href="/content/mysite/en/about.html">Learn More</a>\n</div>`}
        />

        <Quiz questions={[
          { question: "What should you always create instead of using Core Components directly?", options: ["Custom components", "Proxy components", "Shadow components", "Clone components"], correct: 1, explanation: "Proxy components extend Core Components, giving you a customization layer." },
          { question: "Where does component HTL live?", options: ["/content/components/", "/apps/mysite/components/", "/libs/components/", "/conf/components/"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // DIALOGS
    // ══════════════════════════════════════════════
    dialogs: () => (
      <>
        <SectionTitle>Touch UI Dialogs</SectionTitle>
        <Para>
          Dialogs are the authoring interface for components. Authors use them to configure component properties. Touch UI dialogs are built using Granite UI / Coral UI widgets, defined in XML under <InlineCode>_cq_dialog/.content.xml</InlineCode>.
        </Para>

        <SubTitle>Basic Dialog Structure</SubTitle>
        <CodeBlock title="_cq_dialog/.content.xml" language="xml" code={`<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Hero Banner"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container">
        <items jcr:primaryType="nt:unstructured">
            <tabs
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/tabs"
                maximized="{Boolean}true">
                <items jcr:primaryType="nt:unstructured">
                
                    <!-- Tab 1: Content -->
                    <content
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Content"
                        sling:resourceType="granite/ui/components/coral/foundation/container"
                        margin="{Boolean}true">
                        <items jcr:primaryType="nt:unstructured">
                        
                            <!-- Text Field -->
                            <title
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                fieldLabel="Title"
                                name="./title"
                                required="{Boolean}true"/>
                            
                            <!-- Text Area -->
                            <description
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/textarea"
                                fieldLabel="Description"
                                name="./description"
                                rows="3"/>
                            
                            <!-- Path Picker -->
                            <ctaLink
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
                                fieldLabel="CTA Link"
                                name="./ctaLink"
                                rootPath="/content"/>
                                
                        </items>
                    </content>
                    
                    <!-- Tab 2: Style -->
                    <style
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Style"
                        sling:resourceType="granite/ui/components/coral/foundation/container"
                        margin="{Boolean}true">
                        <items jcr:primaryType="nt:unstructured">
                        
                            <!-- Dropdown / Select -->
                            <theme
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/select"
                                fieldLabel="Theme"
                                name="./theme">
                                <items jcr:primaryType="nt:unstructured">
                                    <light jcr:primaryType="nt:unstructured"
                                        text="Light" value="light"/>
                                    <dark jcr:primaryType="nt:unstructured"
                                        text="Dark" value="dark"/>
                                </items>
                            </theme>
                            
                            <!-- Checkbox -->
                            <fullWidth
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
                                fieldDescription="Make banner full viewport width"
                                name="./fullWidth"
                                text="Full Width"
                                value="{Boolean}true"
                                uncheckedValue="{Boolean}false"/>
                                
                        </items>
                    </style>
                    
                </items>
            </tabs>
        </items>
    </content>
</jcr:root>`} />

        <SubTitle>Common Granite UI Widgets</SubTitle>
        <CodeBlock title="Widget Reference" code={`Widget Resource Types (under granite/ui/components/coral/foundation/form/):
──────────────────────────────────────────────────────────────────────
textfield            → Single line text input
textarea             → Multi-line text input
numberfield          → Numeric input
checkbox             → Boolean checkbox
select               → Dropdown select
radiogroup           → Radio button group
datepicker           → Date/time picker
colorfield           → Color picker
pathfield            → Path browser (content/asset picker)
fileupload           → File upload widget
hidden               → Hidden field
switch               → Toggle switch
multifield           → Repeatable field group (add/remove items)
richtext             → Rich text editor (RTE)
tagfield             → Tag picker

Container types:
─────────────────
well                 → Bordered container
fieldset             → Grouped fields with legend
tabs                 → Tabbed container
accordion            → Collapsible sections
fixedcolumns         → Fixed column layout`} />

        <SubTitle>Multifield (Repeatable Items)</SubTitle>
        <CodeBlock title="Multifield Dialog Example" language="xml" code={`<!-- Multifield for a list of links -->
<links
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/multifield"
    fieldLabel="Navigation Links"
    composite="{Boolean}true">
    <field
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container"
        name="./links">
        <items jcr:primaryType="nt:unstructured">
            <label
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                fieldLabel="Label"
                name="./label"/>
            <url
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
                fieldLabel="URL"
                name="./url"/>
        </items>
    </field>
</links>

<!-- Accessing multifield in Sling Model: -->
<!-- @ChildResource List<LinkItem> links; -->`} />

        <SubTitle>Show/Hide with Checkbox</SubTitle>
        <CodeBlock title="Checkbox Show/Hide Pattern" language="xml" code={`<!-- Checkbox that controls visibility of other fields -->
<enableCta
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
    fieldLabel="Enable CTA"
    name="./enableCta"
    text="Show call-to-action button"
    value="{Boolean}true"
    uncheckedValue="{Boolean}false"
    cq-dialog-checkbox-showhide=""
    cq-dialog-checkbox-showhide-target=".cta-fields"/>

<!-- Fields that show/hide based on checkbox -->
<ctaWrapper
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/container">
    <granite:data
        jcr:primaryType="nt:unstructured"
        cq-dialog-checkbox-showhide-target2=".cta-fields"
        showhidetargetvalue="{Boolean}true"/>
    <items jcr:primaryType="nt:unstructured">
        <ctaText .../>
        <ctaLink .../>
    </items>
</ctaWrapper>`} />

        <InfoBox type="tip" title="Dialog Development Workflow">
          Use CRXDE Lite (<InlineCode>/crx/de</InlineCode>) to prototype dialogs quickly, then copy the XML back to your project's FileVault structure. Run <InlineCode>vlt</InlineCode> or use the AEM Repo Tool for sync.
        </InfoBox>


        <TryItBlock
          description="Multifield creates repeatable field groups:"
          code={`<links sling:resourceType="...form/multifield"\n    fieldLabel="Navigation Links"\n    composite="{Boolean}true">\n    <field sling:resourceType="...container" name="./links">\n        <items>\n            <label sling:resourceType="...form/textfield"\n                fieldLabel="Label" name="./label"/>\n            <url sling:resourceType="...form/pathfield"\n                fieldLabel="URL" name="./url"/>\n        </items>\n    </field>\n</links>`}
          result={`Authors see in the dialog:\n\n  Link 1: [Home]    [/content/mysite/en/home]\n  Link 2: [About]   [/content/mysite/en/about]\n  Link 3: [Blog]    [/content/mysite/en/blog]\n  [+ Add]\n\nIn Sling Model:\n  @ChildResource\n  private List<LinkItem> links;\n\n  links.size() → 3\n  links.get(0).getLabel() → "Home"`}
        />

        <Quiz questions={[
          { question: "Where is a component's dialog stored?", options: ["_cq_dialog/.content.xml", "dialog.xml", "cq:dialog.xml", "_dialog/"], correct: 0 },
          { question: "What makes multifield store nested items?", options: ["required=true", "composite=true", "repeatable=true", "nested=true"], correct: 1 },
          { question: "What prefix do dialog field names use?", options: ["jcr:", "sling:", "./", "@"], correct: 2, explanation: "'./' prefix saves values relative to the component's resource node." },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // CLIENTLIBS
    // ══════════════════════════════════════════════
    clientlibs: () => (
      <>
        <SectionTitle>Client Libraries (ClientLibs)</SectionTitle>
        <Para>
          Client Libraries are AEM's mechanism for managing CSS and JavaScript files. They handle dependency management, minification, and categorization of frontend assets.
        </Para>

        <SubTitle>ClientLib Structure</SubTitle>
        <CodeBlock title="ClientLib Folder Layout" code={`/apps/mysite/clientlibs/
  /clientlib-base/              ← Main site clientlib
    ├── .content.xml            ← ClientLib definition
    ├── css.txt                 ← CSS file manifest
    ├── js.txt                  ← JS file manifest
    ├── css/
    │   ├── base.css
    │   └── layout.css
    └── js/
        ├── site.js
        └── utils.js`} />

        <SubTitle>ClientLib Definition</SubTitle>
        <CodeBlock title=".content.xml" language="xml" code={`<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[mysite.base]"
    dependencies="[granite.utils, granite.jquery]"
    embed="[mysite.vendor]"
    allowProxy="{Boolean}true"/>

<!-- Key properties:
  categories    → Unique identifier(s) for this clientlib
  dependencies  → Other clientlibs loaded BEFORE this one
  embed         → Other clientlibs MERGED INTO this one's output
  allowProxy    → Serve via /etc.clientlibs/ proxy path (required for Dispatcher) -->`} />

        <SubTitle>Manifest Files</SubTitle>
        <CodeBlock title="css.txt & js.txt" code={`# css.txt - Lists CSS files in load order
#base=css

base.css
layout.css
components/hero.css
components/card.css

# js.txt - Lists JS files in load order
#base=js

utils.js
site.js
components/hero.js`} />

        <SubTitle>Including ClientLibs in HTL</SubTitle>
        <CodeBlock title="HTL ClientLib Inclusion" language="html" code={`<!-- Include CSS only -->
<sly data-sly-use.clientlib="core/wcm/components/commons/v1/templates/clientlib.html">
    <sly data-sly-call="\${clientlib.css @ categories='mysite.base'}"/>
</sly>

<!-- Include JS only (place before </body>) -->
<sly data-sly-call="\${clientlib.js @ categories='mysite.base'}"/>

<!-- Include both CSS and JS -->
<sly data-sly-call="\${clientlib.all @ categories='mysite.base'}"/>

<!-- Multiple categories -->
<sly data-sly-call="\${clientlib.css @ categories=['mysite.base', 'mysite.vendor']}"/>`} />

        <SubTitle>Frontend Module Integration</SubTitle>
        <CodeBlock title="ui.frontend → ui.apps Pipeline" code={`ui.frontend/                      Build output goes to:
├── src/main/webpack/             ───────────────────→
│   ├── site/                     ui.apps/.../clientlib-site/
│   │   ├── main.ts               ├── css/site.css   (compiled)
│   │   └── main.scss             └── js/site.js     (compiled)
│   └── components/               
│       └── hero/                 ui.apps/.../clientlib-hero/
│           ├── hero.ts           ├── css/hero.css
│           └── hero.scss         └── js/hero.js

# Build: cd ui.frontend && npm run build
# This compiles + copies to ui.apps clientlib folders`} />

        <InfoBox type="warning" title="Performance">
          Use <InlineCode>embed</InlineCode> instead of <InlineCode>dependencies</InlineCode> where possible. Embedding merges files into one HTTP request. Dependencies create separate requests. For production, minimize the number of clientlib categories loaded per page.
        </InfoBox>


        <Quiz questions={[
          { question: "What merges another clientlib INTO yours?", options: ["dependencies", "embed", "include", "merge"], correct: 1, explanation: "'embed' combines into one HTTP request; 'dependencies' loads separately." },
          { question: "What must be true for Dispatcher to serve clientlibs?", options: ["allowProxy", "isPublic", "cacheable", "serveExternal"], correct: 0 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // EDITABLE TEMPLATES
    // ══════════════════════════════════════════════
    "editable-templates": () => (
      <>
        <SectionTitle>Editable Templates</SectionTitle>
        <Para>
          Editable Templates allow template authors (non-developers) to create and modify page templates in the AEM UI. They define the structure, initial content, and allowed components for pages.
        </Para>

        <SubTitle>Template Structure in JCR</SubTitle>
        <CodeBlock title="Template Node Hierarchy" code={`/conf/mysite/settings/wcm/templates/
  /article-page/
    ├── jcr:content
    │   ├── cq:templateType → /conf/mysite/settings/wcm/template-types/page
    │   └── status          → enabled
    ├── structure/           ← Locked layout (developers define)
    │   └── jcr:content/
    │       ├── root/        ← Root layout container
    │       │   ├── header   ← Fixed header component
    │       │   ├── main     ← Editable content area
    │       │   └── footer   ← Fixed footer component
    ├── initial/             ← Default content for new pages
    │   └── jcr:content/
    │       └── root/
    │           └── main/
    │               └── text ← Pre-populated text component
    └── policies/            ← Component policies for this template
        └── jcr:content/
            └── root/
                └── main/
                    └── cq:policy → "mysite/components/policy"`} />

        <SubTitle>Template Type Definition</SubTitle>
        <CodeBlock title="Template Type .content.xml" language="xml" code={`<!-- /conf/mysite/settings/wcm/template-types/page/.content.xml -->
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Template"
    jcr:title="Base Page"
    jcr:description="Base page template type"
    ranking="{Long}100">
    <jcr:content
        jcr:primaryType="cq:PageContent"
        sling:resourceType="mysite/components/page"/>
</jcr:root>`} />

        <SubTitle>Policies</SubTitle>
        <Para>
          Policies define which components are allowed in a given layout container and configure component behavior per template.
        </Para>
        <CodeBlock title="Policy Configuration" language="xml" code={`<!-- Policy allows specific component groups in a container -->
<contentPolicy
    jcr:primaryType="nt:unstructured"
    sling:resourceType="wcm/core/components/policy/policy"
    jcr:title="Main Content Policy"
    components="group:MySite - Content,group:MySite - Media"
    layout="responsiveGrid"
    columns="{Long}12"/>

<!-- This policy:
  - Allows components from "MySite - Content" and "MySite - Media" groups
  - Uses responsive grid layout
  - Sets 12 columns for the responsive grid -->`} />

        <InfoBox type="tip" title="Template Editor">
          Access the Template Editor at <InlineCode>/conf/mysite/settings/wcm/templates.html</InlineCode>. Authors can drag components into the structure, set initial content, and configure policies — all without code changes.
        </InfoBox>


        <Quiz questions={[
          { question: "Where are editable templates stored?", options: ["/apps/templates/", "/conf/mysite/settings/wcm/templates/", "/content/templates/", "/libs/templates/"], correct: 1 },
          { question: "What defines allowed components in a container?", options: ["Template type", "Policy", "Design dialog", "ACL"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // SERVLETS
    // ══════════════════════════════════════════════
    servlets: () => (
      <>
        <SectionTitle>Sling Servlets</SectionTitle>
        <Para>
          Sling Servlets handle HTTP requests in AEM. They can be registered by resource type (recommended) or by path. They're the go-to for custom API endpoints, form handling, and AJAX responses.
        </Para>

        <SubTitle>Resource Type Servlet</SubTitle>
        <CodeBlock title="Servlet by Resource Type (Recommended)" language="java" code={`package com.mysite.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodServlet;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import com.google.gson.JsonObject;

@Component(service = Servlet.class)
@SlingServletResourceTypes(
    resourceTypes = "mysite/components/search",
    methods = HttpConstants.METHOD_GET,
    selectors = "results",           // Triggered by .results selector
    extensions = "json"              // Only for .json extension
)
public class SearchResultsServlet extends SlingSafeMethodServlet {

    @Override
    protected void doGet(SlingHttpServletRequest request,
                         SlingHttpServletResponse response)
            throws ServletException, IOException {
        
        String query = request.getParameter("q");
        
        // Build JSON response
        JsonObject json = new JsonObject();
        json.addProperty("query", query);
        json.addProperty("resultCount", 42);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json.toString());
    }
}

// URL: /content/mysite/en/search.results.json?q=hello
// The resource at /content/mysite/en/search must have
// sling:resourceType = "mysite/components/search"`} />

        <SubTitle>Path-Based Servlet</SubTitle>
        <CodeBlock title="Servlet by Path" language="java" code={`@Component(service = Servlet.class)
@SlingServletPaths(
    value = "/bin/mysite/api/weather"
)
public class WeatherApiServlet extends SlingAllMethodsServlet {

    @Reference
    private WeatherService weatherService;

    @Override
    protected void doGet(SlingHttpServletRequest request,
                         SlingHttpServletResponse response)
            throws ServletException, IOException {
        
        String city = request.getParameter("city");
        WeatherData data = weatherService.getWeather(city);
        
        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(data));
    }

    @Override
    protected void doPost(SlingHttpServletRequest request,
                          SlingHttpServletResponse response)
            throws ServletException, IOException {
        // Handle POST requests (form submissions, etc.)
        String body = IOUtils.toString(request.getReader());
        // Process...
    }
}

// URL: /bin/mysite/api/weather?city=bangalore`} />

        <InfoBox type="warning" title="Security Note">
          Path-based servlets are accessible without authentication by default. Always add proper ACLs or Dispatcher rules to protect <InlineCode>/bin/</InlineCode> paths. Resource-type servlets are inherently more secure because they require a matching resource in the JCR.
        </InfoBox>

        <SubTitle>Sling Servlet Filter</SubTitle>
        <CodeBlock title="Servlet Filter" language="java" code={`@Component(service = Filter.class)
@SlingServletFilter(
    scope = {FilterScope.REQUEST},
    pattern = "/content/mysite/.*",
    order = -500
)
public class LoggingFilter implements Filter {

    private static final Logger LOG = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        SlingHttpServletRequest slingReq = (SlingHttpServletRequest) req;
        LOG.debug("Request: {} {}", slingReq.getMethod(), slingReq.getRequestURI());
        
        long start = System.currentTimeMillis();
        chain.doFilter(req, res);  // Continue the filter chain
        long duration = System.currentTimeMillis() - start;
        
        LOG.debug("Response time: {}ms", duration);
    }

    @Override public void init(FilterConfig config) {}
    @Override public void destroy() {}
}`} />


        <TryItBlock
          description="A resource-type servlet returns JSON on .results.json selector:"
          code={`@Component(service = Servlet.class)\n@SlingServletResourceTypes(\n    resourceTypes = "mysite/components/search",\n    methods = HttpConstants.METHOD_GET,\n    selectors = "results",\n    extensions = "json"\n)\npublic class SearchServlet extends SlingSafeMethodServlet {\n    @Override\n    protected void doGet(SlingHttpServletRequest request,\n                         SlingHttpServletResponse response) {\n        String query = request.getParameter("q");\n        JsonObject json = new JsonObject();\n        json.addProperty("query", query);\n        json.addProperty("resultCount", 42);\n        response.setContentType("application/json");\n        response.getWriter().write(json.toString());\n    }\n}`}
          result={`Request:\n  GET /content/mysite/en/search.results.json?q=hello\n\nResponse:\n{\n    "query": "hello",\n    "resultCount": 42\n}`}
        />

        <Quiz questions={[
          { question: "Which servlet type is more secure?", options: ["Path-based (@SlingServletPaths)", "Resource-type (@SlingServletResourceTypes)"], correct: 1, explanation: "Resource-type servlets require a matching JCR resource, adding access control." },
          { question: "For GET-only servlets, extend which class?", options: ["HttpServlet", "SlingAllMethodsServlet", "SlingSafeMethodServlet", "GenericServlet"], correct: 2 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // WORKFLOWS
    // ══════════════════════════════════════════════
    workflows: () => (
      <>
        <SectionTitle>AEM Workflows</SectionTitle>
        <Para>
          Workflows automate business processes in AEM — like content approval, asset processing, and page activation. They consist of steps that execute sequentially or in parallel.
        </Para>

        <SubTitle>Built-in Workflows</SubTitle>
        <CodeBlock title="Common OOTB Workflows" code={`Request for Activation    → Content approval before publish
Request for Deactivation  → Approval before unpublish
DAM Update Asset          → Processes uploaded assets (renditions, metadata)
DAM Metadata Writeback    → Writes metadata back to asset binaries
Page Move                 → Handles page move with references
Project Creation          → Sets up project structure`} />

        <SubTitle>Custom Workflow Process Step</SubTitle>
        <CodeBlock title="Custom WorkflowProcess" language="java" code={`package com.mysite.core.workflows;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
    service = WorkflowProcess.class,
    property = {
        "process.label=My Site - Send Notification"
    }
)
public class NotificationWorkflowStep implements WorkflowProcess {

    @Reference
    private NotificationService notificationService;

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession,
                        MetaDataMap metaDataMap) throws Exception {
        
        // Get the payload path
        String payloadPath = workItem.getWorkflowData().getPayload().toString();
        
        // Get process arguments from the step config
        String recipientEmail = metaDataMap.get("PROCESS_ARGS", String.class);
        
        // Get the initiator
        String initiator = workItem.getWorkflow().getInitiator();
        
        // Your custom logic
        notificationService.sendEmail(
            recipientEmail,
            "Content Ready for Review",
            "Page " + payloadPath + " submitted by " + initiator
        );
    }
}`} />

        <SubTitle>Workflow Launcher</SubTitle>
        <CodeBlock title="Launcher Configuration" code={`Launchers trigger workflows automatically based on JCR events:

Configuration:
  Event Type   : NODE_MODIFIED (or CREATED, DELETED)
  Path         : /content/mysite/.*
  Node Type    : cq:PageContent
  Property     : cq:lastModified
  Workflow     : /var/workflow/models/request-for-activation
  Run Modes    : author
  Conditions   : jcr:content/cq:template == /conf/mysite/settings/wcm/templates/article
  Excludes     : jcr:content/cq:lastRolledout

// Launchers are configured at:
// /libs/settings/workflow/launcher/config/`} />

        <InfoBox type="tip" title="Best Practice">
          Keep workflow steps lightweight. For heavy processing, use Sling Jobs instead of workflow steps. Workflows should orchestrate, not execute complex operations.
        </InfoBox>


        <Quiz questions={[
          { question: "What annotation marks a custom workflow step?", options: ["@WorkflowStep", "@Component(service=WorkflowProcess.class)", "@Process", "@Step"], correct: 1 },
          { question: "For heavy processing, use ___ instead of workflow steps:", options: ["Servlets", "Sling Jobs", "Schedulers", "Filters"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // DISPATCHER
    // ══════════════════════════════════════════════
    dispatcher: () => (
      <>
        <SectionTitle>AEM Dispatcher</SectionTitle>
        <Para>
          The Dispatcher is an Apache HTTP Server module that sits in front of AEM Publish instances. It provides caching, load balancing, and security. Proper Dispatcher configuration is critical for AEM site performance.
        </Para>

        <SubTitle>Dispatcher Architecture</SubTitle>
        <CodeBlock title="Request Flow with Dispatcher" code={`User Request
    │
    ▼
┌─────────────────┐
│   CDN (Fastly)  │ ← Edge caching (Cloud Service)
├─────────────────┤
│   Apache HTTPD  │ ← Rewrite rules, SSL termination
│   + Dispatcher  │ ← Cache module
├─────────────────┤
│  Cache (Disk)   │ ← Serves cached content (fast!)
├─────────────────┤
│   AEM Publish   │ ← Only hit on cache miss
└─────────────────┘`} />

        <SubTitle>Dispatcher Config (Cloud Service - Flexible Mode)</SubTitle>
        <CodeBlock title="dispatcher/ Folder Structure" code={`dispatcher/
├── src/
│   ├── conf.d/
│   │   ├── available_vhosts/
│   │   │   └── default.vhost        ← Virtual host config
│   │   ├── enabled_vhosts/
│   │   │   └── default.vhost → symlink
│   │   ├── rewrites/
│   │   │   └── rewrite.rules        ← URL rewrite rules
│   │   └── variables/
│   │       └── custom.vars          ← Environment variables
│   └── conf.dispatcher.d/
│       ├── available_farms/
│       │   └── default.farm          ← Farm configuration
│       ├── cache/
│       │   └── rules.any             ← Cache rules
│       ├── clientheaders/
│       │   └── clientheaders.any     ← Allowed headers
│       └── filters/
│           └── filters.any           ← Request filters (security)`} />

        <SubTitle>Filter Rules</SubTitle>
        <CodeBlock title="filters.any" code={`# Deny everything by default
/0001 { /type "deny"  /url "*" }

# Allow content pages
/0002 { /type "allow" /url "/content/mysite/*" }

# Allow clientlibs
/0003 { /type "allow" /url "/etc.clientlibs/*" }

# Allow DAM assets
/0004 { /type "allow" /url "/content/dam/mysite/*" }

# Block sensitive paths
/0020 { /type "deny" /url "/crx/*" }
/0021 { /type "deny" /url "/system/*" }
/0022 { /type "deny" /url "/bin/*" }
/0023 { /type "deny" /url "/apps/*" }
/0024 { /type "deny" /url "/home/*" }

# Allow specific bin paths (APIs)
/0030 { /type "allow" /url "/bin/mysite/api/*" }`} />

        <SubTitle>Cache Rules</SubTitle>
        <CodeBlock title="rules.any" code={`# Cache HTML pages
/0001 { /glob "*.html" /type "allow" }

# Cache clientlib assets
/0002 { /glob "/etc.clientlibs/*" /type "allow" }

# Cache DAM images
/0003 { /glob "/content/dam/*" /type "allow" }

# Don't cache POST responses
/0004 { /glob "* POST *" /type "deny" }

# Don't cache query strings
/0005 { /glob "* *?*" /type "deny" }

# Cache invalidation headers
/cache {
    /docroot "/mnt/var/www/html"
    /statfileslevel "4"    # Granular invalidation
    /allowAuthorized "0"   # Don't cache authenticated requests
    /gracePeriod "2"       # Serve stale content for 2s during invalidation
}`} />

        <InfoBox type="important" title="Cache Invalidation">
          AEM uses stat files for cache invalidation. When content is activated, the Dispatcher flushes the cache. Set <InlineCode>statfileslevel</InlineCode> to at least 2-4 to avoid flushing the entire cache on every activation.
        </InfoBox>


        <TryItBlock
          description="Cache invalidation on content activation:"
          code={`# Step 1: Author publishes a page\n# /content/mysite/en/news/article-1\n\n# Step 2: Replication agent sends to Publish\n\n# Step 3: Publish notifies Dispatcher\n\n# Step 4: Dispatcher checks statfileslevel\n# statfileslevel = 4 means:\n#   /content/mysite/en/news/ is flushed\n#   NOT the entire /content/ cache!`}
          result={`Before activation:\n  Cache HIT for /content/mysite/en/news/article-1.html\n  (served from disk in < 1ms)\n\nAfter activation:\n  Cache MISS → AEM Publish renders fresh HTML\n  → New version cached to disk\n  → Subsequent requests served from cache again\n\nKey: Only /content/mysite/en/news/ was invalidated,\nnot /content/mysite/en/about/ or other sections!`}
        />

        <Quiz questions={[
          { question: "What should the FIRST filter rule always be?", options: ["Allow /content/*", "Deny everything", "Allow /libs/*", "Deny /crx/*"], correct: 1, explanation: "Whitelist approach: deny all, then selectively allow." },
          { question: "What does statfileslevel control?", options: ["Max cache size", "Cache invalidation granularity", "Stat file count", "TTL duration"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // CLOUD SERVICE
    // ══════════════════════════════════════════════
    "cloud-service": () => (
      <>
        <SectionTitle>AEM as a Cloud Service</SectionTitle>
        <Para>
          AEM as a Cloud Service (AEMaaCS) is the cloud-native version of AEM. It's always up-to-date, auto-scaling, and managed by Adobe. Understanding the differences from AEM 6.5 on-premise is critical for modern AEM development.
        </Para>

        <SubTitle>Key Differences from AEM 6.5</SubTitle>
        <CodeBlock title="Cloud Service vs On-Premise" code={`Feature               AEM 6.5 (On-Prem)          AEM Cloud Service
──────────────────────────────────────────────────────────────────
Deployment            Manual packages            Cloud Manager CI/CD
Updates               Service packs (manual)     Auto-updated by Adobe
Content repo          Tar/MongoDB               Cloud-native (Oak Segment Tar)
Config                JCR + Felix Console        Repo-Init + cfg.json (Git only)
OSGi Console          Full access               Read-only in prod
Dispatcher            Self-managed Apache        Managed (flexible mode)
Scaling               Manual                    Auto-scaling
Mutable content       /apps is mutable          /apps is IMMUTABLE
Custom runmodes       Unlimited                 dev, stage, prod only`} />

        <SubTitle>Immutable vs Mutable Content</SubTitle>
        <CodeBlock title="Content Classification" code={`IMMUTABLE (deployed via CI/CD, cannot be changed at runtime):
─────────────────────────────────────────────────────────
/apps/            → Components, templates, code
/libs/            → AEM product code
/oak:index/       → Oak indexes

MUTABLE (can be changed at runtime by authors):
─────────────────────────────────────────────────────────
/content/         → Pages, assets, experience fragments
/conf/            → Editable templates, Cloud Configs
/home/            → Users and groups
/var/             → Workflow instances, audit logs`} />

        <SubTitle>Repo Init (Repoinit)</SubTitle>
        <Para>
          In Cloud Service, you can't use CRX Package Manager or CRXDE to create system users or set ACLs. Use Repoinit scripts instead.
        </Para>
        <CodeBlock title="Repoinit Configuration" language="json" code={`// org.apache.sling.jcr.repoinit.RepositoryInitializer-mysite.cfg.json
{
    "scripts": [
        "create service user mysite-service-user",
        "",
        "set ACL for mysite-service-user",
        "    allow jcr:read on /content/mysite",
        "    allow jcr:read on /content/dam/mysite",
        "    allow rep:write on /content/mysite",
        "end",
        "",
        "create path (sling:Folder) /content/mysite/data",
        "create path (sling:OrderedFolder) /content/experience-fragments/mysite"
    ]
}`} />

        <SubTitle>Cloud Manager Pipeline</SubTitle>
        <CodeBlock title="CI/CD Pipeline Stages" code={`Git Push → Cloud Manager Detects Change
    │
    ▼
┌─────────────────┐
│  Build Phase     │ ← Maven build, unit tests
├─────────────────┤
│  Code Quality    │ ← SonarQube, AEM Best Practice Analyzer
├─────────────────┤
│  Deploy to Dev   │ ← Automatic for dev branches
├─────────────────┤
│  Integration     │ ← Custom integration tests (it.tests/)
│  Tests           │
├─────────────────┤
│  Deploy to Stage │ ← Manual approval gate
├─────────────────┤
│  Performance     │ ← Load testing
│  Tests           │
├─────────────────┤
│  Deploy to Prod  │ ← Manual approval + audit log
└─────────────────┘`} />

        <InfoBox type="tip" title="Cloud-First Development">
          Always develop with Cloud Service constraints in mind even for AEM 6.5 projects. Use OSGi R7 annotations, repoinit for system users, cfg.json for configs, and avoid direct JCR access via admin session. This makes future migration smoother.
        </InfoBox>


        <TryItBlock
          description="In Cloud Service, /apps is immutable — what changes?"
          code={`// What you CAN'T do in Cloud Service:\n✗ Use CRXDE Lite to edit components in prod\n✗ Install packages via Package Manager\n✗ Create system users via Felix Console\n✗ Use custom run modes beyond dev/stage/prod\n✗ Modify anything under /apps at runtime\n\n// What you MUST do instead:\n✓ Use Git + Cloud Manager CI/CD pipeline\n✓ Use repoinit for system users & ACLs\n✓ Use .cfg.json for OSGi configs\n✓ Deploy everything through code`}
          result={`Deployment flow:\n\n  git push origin main\n    → Cloud Manager detects change\n    → Maven build + unit tests\n    → Code quality scan (SonarQube)\n    → Deploy to Dev (automatic)\n    → Integration tests\n    → Deploy to Stage (manual approval)\n    → Performance tests\n    → Deploy to Prod (manual approval)\n\nResult: Zero-downtime deployment with full audit trail`}
        />

        <Quiz questions={[
          { question: "Is /apps mutable or immutable in Cloud Service?", options: ["Mutable", "Immutable"], correct: 1, explanation: "/apps can only change through CI/CD deployment." },
          { question: "What replaces Felix Console for system users?", options: ["CRXDE Lite", "Package Manager", "Repoinit scripts", "Admin console"], correct: 2 },
          { question: "How many standard run modes exist in Cloud Service?", options: ["Unlimited", "3 (dev, stage, prod)", "5", "2 (author, publish)"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // CONTENT FRAGMENTS
    // ══════════════════════════════════════════════
    "content-fragments": () => (
      <>
        <SectionTitle>Content Fragments</SectionTitle>
        <Para>
          Content Fragments are channel-agnostic content assets that can be delivered as structured data via APIs (headless) or embedded in AEM pages. They're defined by Content Fragment Models.
        </Para>

        <SubTitle>Content Fragment Model</SubTitle>
        <CodeBlock title="Model Definition (via UI)" code={`Location: /conf/mysite/settings/dam/cfm/models/article

Model: Article
Fields:
─────────────────────────────────────────
headline        : Single-line text (required)
subHeadline     : Single-line text
body            : Multi-line text (Rich Text)
author          : Content Reference (→ /content/dam/mysite/authors)
publishDate     : Date and Time
category        : Enumeration (News, Blog, Tutorial, Case Study)
tags            : Tags
featuredImage   : Content Reference (→ /content/dam)
relatedArticles : Fragment Reference (→ Article model, multi-value)`} />

        <SubTitle>Accessing Content Fragments in Java</SubTitle>
        <CodeBlock title="Content Fragment API" language="java" code={`import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentElement;

// Adapt a DAM asset resource to ContentFragment
Resource cfResource = resolver.getResource("/content/dam/mysite/articles/intro-to-aem");
ContentFragment fragment = cfResource.adaptTo(ContentFragment.class);

if (fragment != null) {
    // Get element values
    String headline = fragment.getElement("headline")
        .getContent();
    
    String body = fragment.getElement("body")
        .getContent();
    
    // Get metadata
    Calendar publishDate = fragment.getElement("publishDate")
        .getValue()
        .getValue(Calendar.class);
    
    // Iterate all elements
    Iterator<ContentElement> elements = fragment.getElements();
    while (elements.hasNext()) {
        ContentElement el = elements.next();
        String name = el.getName();
        String value = el.getContent();
    }
}`} />

        <SubTitle>GraphQL API (Headless)</SubTitle>
        <CodeBlock title="GraphQL Query" code={`# Endpoint: /content/cq:graphql/mysite/endpoint.json

query ArticleList {
  articleList(
    filter: {
      category: { _expressions: [{ value: "Tutorial" }] }
    }
    _sort: [{ publishDate: DESC }]
    _limit: 10
  ) {
    items {
      headline
      subHeadline
      body { html }
      publishDate
      featuredImage { ... on ImageRef { _path width height } }
      author { ... on AuthorModel { name bio } }
    }
  }
}

# Persisted query (cached):
# GET /graphql/execute.json/mysite/article-list`} />

        <InfoBox type="info" title="Headless AEM">
          Content Fragments + GraphQL API = headless CMS. Use this to power React/Next.js/Flutter frontends while keeping content management in AEM. The GraphQL endpoint supports persisted queries for CDN caching.
        </InfoBox>


        <TryItBlock
          description="GraphQL query for content fragments:"
          code={`query ArticleList {\n  articleList(\n    filter: {\n      category: { _expressions: [{ value: "Tutorial" }] }\n    }\n    _sort: [{ publishDate: DESC }]\n    _limit: 10\n  ) {\n    items {\n      headline\n      body { html }\n      publishDate\n      featuredImage { ... on ImageRef { _path } }\n    }\n  }\n}`}
          result={`{\n  "data": {\n    "articleList": {\n      "items": [\n        {\n          "headline": "Getting Started with AEM",\n          "body": { "html": "<p>Learn the basics...</p>" },\n          "publishDate": "2025-03-15",\n          "featuredImage": { "_path": "/content/dam/hero.jpg" }\n        },\n        ...\n      ]\n    }\n  }\n}`}
        />

        <Quiz questions={[
          { question: "Content Fragments + GraphQL API = ?", options: ["Headless CMS", "Full-stack CMS", "Static site", "Blog engine"], correct: 0 },
          { question: "Where are CF models defined?", options: ["/apps/cfm/", "/conf/mysite/settings/dam/cfm/models/", "/content/dam/models/", "/libs/cfm/"], correct: 1 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // TESTING
    // ══════════════════════════════════════════════
    testing: () => (
      <>
        <SectionTitle>Testing in AEM</SectionTitle>
        <Para>
          Testing AEM applications requires specialized frameworks that can mock the JCR, Sling, and OSGi runtime. The primary framework is <InlineCode>io.wcm AEM Mocks</InlineCode>.
        </Para>

        <SubTitle>Unit Testing with AEM Mocks</SubTitle>
        <CodeBlock title="Sling Model Unit Test" language="java" code={`package com.mysite.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class HeroModelTest {

    private final AemContext ctx = new AemContext();

    @BeforeEach
    void setUp() {
        // Load test content from JSON
        ctx.load().json("/com/mysite/core/models/HeroModelTest.json",
            "/content/mysite/en/home/jcr:content/hero");
        
        // Register the Sling Model
        ctx.addModelsForClasses(HeroModel.class);
    }

    @Test
    void testTitle() {
        // Get the test resource
        Resource resource = ctx.resourceResolver()
            .getResource("/content/mysite/en/home/jcr:content/hero");
        
        // Adapt to Sling Model
        HeroModel model = resource.adaptTo(HeroModel.class);
        
        assertNotNull(model);
        assertEquals("Welcome to My Site", model.getTitle());
        assertEquals("Learn AEM with us", model.getDescription());
        assertTrue(model.isCtaEnabled());
    }

    @Test
    void testEmptyProperties() {
        // Create a resource with no properties
        ctx.create().resource("/content/empty", "sling:resourceType", "mysite/components/hero");
        
        Resource resource = ctx.resourceResolver().getResource("/content/empty");
        HeroModel model = resource.adaptTo(HeroModel.class);
        
        assertNotNull(model);
        assertNull(model.getTitle());
    }
}`} />

        <SubTitle>Test Content JSON</SubTitle>
        <CodeBlock title="HeroModelTest.json" language="json" code={`{
    "jcr:primaryType": "nt:unstructured",
    "sling:resourceType": "mysite/components/hero",
    "title": "Welcome to My Site",
    "description": "Learn AEM with us",
    "ctaEnabled": true,
    "ctaLink": "/content/mysite/en/about",
    "ctaText": "Learn More",
    "fileReference": "/content/dam/mysite/hero.jpg"
}`} />

        <SubTitle>Testing OSGi Services</SubTitle>
        <CodeBlock title="Service Test with Mocked Dependencies" language="java" code={`@ExtendWith(AemContextExtension.class)
class GreetingServiceImplTest {

    private final AemContext ctx = new AemContext();
    private GreetingServiceImpl service;

    @BeforeEach
    void setUp() {
        // Register OSGi config
        ctx.registerInjectActivateService(new GreetingServiceImpl(),
            "greeting.prefix", "Hello",
            "enabled", true
        );
        
        service = (GreetingServiceImpl) ctx.getService(GreetingService.class);
    }

    @Test
    void testGreet() {
        assertEquals("Hello, Arvi!", service.greet("Arvi"));
    }

    @Test
    void testDisabled() {
        // Re-register with disabled config
        ctx.registerInjectActivateService(new GreetingServiceImpl(),
            "enabled", false
        );
        GreetingService disabled = ctx.getService(GreetingService.class);
        assertEquals("Service disabled", disabled.greet("Arvi"));
    }
}`} />

        <SubTitle>Maven Test Dependencies</SubTitle>
        <CodeBlock title="pom.xml Test Dependencies" language="xml" code={`<dependency>
    <groupId>io.wcm</groupId>
    <artifactId>io.wcm.testing.aem-mock.junit5</artifactId>
    <version>5.5.2</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.11.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.11.0</version>
    <scope>test</scope>
</dependency>`} />


        <TryItBlock
          description="Unit test a Sling Model with AEM Mocks:"
          code={`@ExtendWith(AemContextExtension.class)\nclass HeroModelTest {\n    private final AemContext ctx = new AemContext();\n\n    @BeforeEach\n    void setUp() {\n        ctx.load().json("/HeroModelTest.json",\n            "/content/mysite/en/home/jcr:content/hero");\n        ctx.addModelsForClasses(HeroModel.class);\n    }\n\n    @Test\n    void testTitle() {\n        Resource res = ctx.resourceResolver()\n            .getResource("/content/mysite/en/home/jcr:content/hero");\n        HeroModel model = res.adaptTo(HeroModel.class);\n        assertEquals("Welcome", model.getTitle());\n        assertTrue(model.isCtaEnabled());\n    }\n}`}
          result={`Test fixture (HeroModelTest.json):\n{\n  "sling:resourceType": "mysite/components/hero",\n  "title": "Welcome",\n  "ctaEnabled": true\n}\n\nTest output:\n  ✓ testTitle()       PASSED\n  ✓ testEmpty()       PASSED\n  ──────────────────────────\n  2 tests, 0 failures`}
        />

        <Quiz questions={[
          { question: "Which framework provides AEM testing mocks?", options: ["Mockito", "io.wcm AEM Mocks", "PowerMock", "JMockit"], correct: 1 },
          { question: "How to load test content into AemContext?", options: ["ctx.load().json()", "ctx.importContent()", "ctx.addResource()", "ctx.createContent()"], correct: 0 },
        ]} />

      </>
    ),

    // ══════════════════════════════════════════════
    // PERFORMANCE
    // ══════════════════════════════════════════════
    performance: () => (
      <>
        <SectionTitle>Performance Best Practices</SectionTitle>

        <SubTitle>Query Optimization</SubTitle>
        <CodeBlock title="Query Do's and Don'ts" code={`✅ DO:
  - Always use path constraints: WHERE ISDESCENDANTNODE(page, '/content/mysite')
  - Use Oak indexes for frequent queries
  - Limit results: queryMap.put("p.limit", "20")
  - Use the QueryBuilder Debugger: /libs/cq/search/content/querydebug.html

❌ DON'T:
  - Run traversal queries (no path constraint = scans entire repo)
  - Use queries in component rendering (per-request)
  - Use LIKE with leading wildcard: '%searchterm' (can't use index)
  - Forget to close query results iterators`} />

        <SubTitle>Caching Strategy</SubTitle>
        <CodeBlock title="Multi-Layer Cache" code={`Layer 1: Browser Cache
  → Cache-Control headers for static assets (clientlibs, images)
  → Long TTL (e.g., 1 year) + fingerprinted URLs

Layer 2: CDN (Fastly / Akamai)
  → Cache HTML pages at edge
  → Surrogate-Control headers
  → Tag-based invalidation

Layer 3: Dispatcher Cache
  → File-system cache on Apache
  → statfileslevel for granular invalidation
  → Cache entire HTML pages

Layer 4: AEM Internal Cache
  → Sling Resource Resolver cache
  → JCR session cache
  → OSGi service singletons`} />

        <SubTitle>Component Performance Checklist</SubTitle>
        <CodeBlock title="Performance Checklist" code={`□ Sling Model uses @PostConstruct, not getter-based lazy loading
□ No JCR queries in component rendering (use lists/tags instead)
□ Images use Dynamic Media / adaptive renditions
□ CSS/JS are minified and in clientlib categories
□ Component has proper caching headers set
□ No admin session usage (use service users)
□ ResourceResolver is closed in finally/try-with-resources
□ HTL template doesn't use data-sly-use for heavy operations
□ Multifield items have a reasonable max limit
□ No Thread.sleep or synchronous HTTP calls in rendering`} />

        <InfoBox type="important" title="Golden Performance Rule">
          Every page render should hit the JCR as little as possible. Cache aggressively, query sparingly, and always profile with the AEM Request Performance Analyzer.
        </InfoBox>


        <Quiz questions={[
          { question: "Where should Sling Model logic run?", options: ["In getters (lazy)", "In @PostConstruct (eager)", "In HTL template", "In servlet filter"], correct: 1 },
          { question: "What kills query performance most?", options: ["LIMIT clause", "ORDER BY", "No path constraint", "Too many properties"], correct: 2, explanation: "Without a path constraint, queries scan the entire repository — a guaranteed performance killer." },
          { question: "Which session type should you NEVER use?", options: ["Service user session", "Request session", "Admin session", "Anonymous session"], correct: 2 },
        ]} />

      </>
    ),
  };


  const renderer = content[topicId];
  if (!renderer) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted }}>
        <p style={{ fontSize: 18 }}>Select a topic from the sidebar to start learning.</p>
      </div>
    );
  }
  return <div>
    {currentItem?.subtopics && <SubtopicChips items={currentItem.subtopics} />}
    {renderer()}
  </div>;
}

// ─── Progress Tracker ───
function useProgress() {
  const [completed, setCompleted] = useState(new Set());
  const toggle = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return { completed, toggle };
}

// ─── Main App ───
export default function AEMLearning() {
  const [activeTopic, setActiveTopic] = useState("intro");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { completed, toggle } = useProgress();
  const contentRef = useRef(null);

  const allItems = TOPICS.flatMap((cat) => cat.items);
  const totalTopics = allItems.length;
  const completedCount = completed.size;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTopic]);

  const currentIndex = allItems.findIndex((i) => i.id === activeTopic);
  const prevTopic = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextTopic = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const filteredTopics = TOPICS.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: COLORS.text, overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 280 : 0,
        minWidth: sidebarOpen ? 280 : 0,
        background: "#1b2a3b",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 18px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>A</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif" }}>AEM Academy</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>Learn Adobe Experience Manager</div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          />
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
              <span>Progress</span>
              <span>{completedCount}/{totalTopics}</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(completedCount / totalTopics) * 100}%`, height: "100%", background: COLORS.green, borderRadius: 2, transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {filteredTopics.map((category) => (
            <div key={category.category} style={{ marginBottom: 4 }}>
              <div style={{ padding: "8px 18px 4px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5 }}>
                {category.icon} {category.category}
              </div>
              {category.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTopic(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "7px 18px",
                    cursor: "pointer",
                    background: activeTopic === item.id ? "rgba(4,170,109,0.15)" : "transparent",
                    borderLeft: activeTopic === item.id ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                    borderRight: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2,
                      border: `1.5px solid ${completed.has(item.id) ? COLORS.green : "rgba(255,255,255,0.2)"}`,
                      background: completed.has(item.id) ? COLORS.green : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#fff", cursor: "pointer",
                    }}
                  >
                    {completed.has(item.id) && "✓"}
                  </div>
                  <div>
                    <span style={{ fontSize: 13, color: activeTopic === item.id ? "#fff" : "rgba(255,255,255,0.65)", fontWeight: activeTopic === item.id ? 600 : 400, display: "block" }}>
                      {item.title}
                    </span>
                    {activeTopic === item.id && item.subtopics && (
                      <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {item.subtopics.map((st, si) => (
                          <span key={si} style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", opacity: 1 }}>· {st}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 24px", borderBottom: `1px solid ${COLORS.border}`, background: "#ffffff", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 18, padding: 4 }}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
            <span style={{ fontSize: 14, color: COLORS.textMuted }}>
              {TOPICS.find((c) => c.items.some((i) => i.id === activeTopic))?.category}
            </span>
            <span style={{ color: COLORS.border }}>›</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {allItems.find((i) => i.id === activeTopic)?.title}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => toggle(activeTopic)}
              style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
                background: completed.has(activeTopic) ? COLORS.greenSoft : COLORS.accentSoft,
                color: completed.has(activeTopic) ? COLORS.green : COLORS.accent,
                border: `1px solid ${completed.has(activeTopic) ? COLORS.green : COLORS.accent}`,
              }}
            >
              {completed.has(activeTopic) ? "✓ Completed" : "Mark Complete"}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "24px 40px 60px" }}>
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <TopicContent topicId={activeTopic} />
          </div>

          {/* Navigation Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
            {prevTopic ? (
              <button onClick={() => setActiveTopic(prevTopic.id)} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 20px", cursor: "pointer", color: COLORS.text, fontFamily: "inherit", fontSize: 13, textAlign: "left" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>← Previous</div>
                <div style={{ fontWeight: 600 }}>{prevTopic.title}</div>
              </button>
            ) : <div />}
            {nextTopic ? (
              <button onClick={() => setActiveTopic(nextTopic.id)} style={{ background: COLORS.green, border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", color: "#fff", fontFamily: "inherit", fontSize: 13, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Next →</div>
                <div style={{ fontWeight: 600 }}>{nextTopic.title}</div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
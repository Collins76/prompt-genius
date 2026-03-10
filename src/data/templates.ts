import { PromptTemplate } from "@/types";

export const promptTemplates: PromptTemplate[] = [
  {
    id: "t1",
    name: "Blog Post Writer",
    description: "Generate a comprehensive blog post on any topic",
    category: "Content Writing",
    template:
      "Write a comprehensive blog post about {{topic}}. The target audience is {{audience}}. The tone should be {{tone}}. Include an engaging introduction, {{sections}} main sections with subheadings, practical examples, and a compelling conclusion with a call to action.",
    variables: ["topic", "audience", "tone", "sections"],
    icon: "📝",
  },
  {
    id: "t2",
    name: "Code Review Assistant",
    description: "Get thorough code review feedback",
    category: "Development",
    template:
      "Review the following {{language}} code for: \n1. Bugs and potential issues\n2. Performance optimizations\n3. Best practices and design patterns\n4. Security vulnerabilities\n5. Code readability and maintainability\n\nCode:\n```{{language}}\n{{code}}\n```\n\nProvide specific suggestions with code examples.",
    variables: ["language", "code"],
    icon: "🔍",
  },
  {
    id: "t3",
    name: "Marketing Email",
    description: "Create a persuasive marketing email",
    category: "Marketing",
    template:
      "Write a marketing email for {{product}} targeting {{audience}}. The goal is {{goal}}. Use a {{tone}} tone. Include:\n- A compelling subject line (3 options)\n- An attention-grabbing opener\n- Key benefits and value propositions\n- Social proof or testimonials\n- A clear call-to-action\n- P.S. line",
    variables: ["product", "audience", "goal", "tone"],
    icon: "📧",
  },
  {
    id: "t4",
    name: "Learning Plan Creator",
    description: "Generate a structured learning plan",
    category: "Education",
    template:
      "Create a {{duration}} learning plan for {{topic}}. My current level is {{level}}. I can dedicate {{hours}} hours per week. Include:\n- Week-by-week breakdown\n- Specific resources (books, courses, tutorials)\n- Practice exercises and projects\n- Milestones and checkpoints\n- Assessment methods",
    variables: ["topic", "duration", "level", "hours"],
    icon: "📚",
  },
  {
    id: "t5",
    name: "Product Description",
    description: "Write compelling product descriptions",
    category: "E-Commerce",
    template:
      "Write a compelling product description for {{product}}. Key features include: {{features}}. Target audience: {{audience}}. Include:\n- An attention-grabbing headline\n- Benefit-focused description (not just features)\n- Emotional triggers\n- Technical specifications\n- SEO-optimized keywords",
    variables: ["product", "features", "audience"],
    icon: "🛍️",
  },
  {
    id: "t6",
    name: "Meeting Agenda",
    description: "Create a structured meeting agenda",
    category: "Business",
    template:
      "Create a meeting agenda for a {{type}} meeting about {{topic}}. Duration: {{duration}}. Attendees include: {{attendees}}. Include:\n- Clear objectives\n- Time allocation per topic\n- Discussion points\n- Decision items\n- Action items section\n- Next steps",
    variables: ["type", "topic", "duration", "attendees"],
    icon: "📋",
  },
  {
    id: "t7",
    name: "Social Media Content",
    description: "Generate social media posts for multiple platforms",
    category: "Marketing",
    template:
      "Create social media content about {{topic}} for {{platforms}}. Brand voice: {{voice}}. Goal: {{goal}}. For each platform, include:\n- Platform-optimized post text\n- Relevant hashtags\n- Best posting time suggestion\n- Engagement hooks\n- Image/visual suggestions",
    variables: ["topic", "platforms", "voice", "goal"],
    icon: "📱",
  },
  {
    id: "t8",
    name: "Bug Report Analyzer",
    description: "Analyze and troubleshoot bug reports",
    category: "Development",
    template:
      "Analyze this bug report and help troubleshoot:\n\n**Environment**: {{environment}}\n**Steps to Reproduce**: {{steps}}\n**Expected**: {{expected}}\n**Actual**: {{actual}}\n\nProvide:\n1. Possible root causes (ranked by likelihood)\n2. Debugging steps\n3. Potential fixes with code examples\n4. Prevention strategies",
    variables: ["environment", "steps", "expected", "actual"],
    icon: "🐛",
  },
  {
    id: "t9",
    name: "Data Analysis Prompt",
    description: "Analyze data and generate insights",
    category: "Analytics",
    template:
      "Analyze the following {{dataType}} data and provide insights:\n\n{{data}}\n\nFocus on:\n1. Key trends and patterns\n2. Anomalies or outliers\n3. Actionable recommendations\n4. Visualizations suggestions\n5. Statistical significance\n\nPresent findings in a clear, executive-summary format.",
    variables: ["dataType", "data"],
    icon: "📊",
  },
  {
    id: "t10",
    name: "Creative Story",
    description: "Generate creative fiction or narratives",
    category: "Creative",
    template:
      "Write a {{genre}} story about {{premise}}. Main character: {{character}}. Setting: {{setting}}. Include:\n- A compelling opening hook\n- Rising tension and conflict\n- Rich sensory details\n- Meaningful dialogue\n- A satisfying resolution\n\nTarget length: {{length}} words. Writing style: {{style}}.",
    variables: ["genre", "premise", "character", "setting", "length", "style"],
    icon: "✨",
  },
  {
    id: "t11",
    name: "API Documentation",
    description: "Generate comprehensive API documentation",
    category: "Development",
    template:
      "Write comprehensive API documentation for the {{name}} endpoint:\n\n- **Method**: {{method}}\n- **URL**: {{url}}\n- **Description**: {{description}}\n\nInclude:\n1. Request parameters (path, query, body)\n2. Request/response examples\n3. Error codes and handling\n4. Rate limiting info\n5. Authentication requirements\n6. Code examples in {{languages}}",
    variables: ["name", "method", "url", "description", "languages"],
    icon: "📡",
  },
  {
    id: "t12",
    name: "Resume Bullet Points",
    description: "Transform job duties into impactful bullet points",
    category: "Career",
    template:
      "Transform these job duties into impactful resume bullet points:\n\nRole: {{role}} at {{company}}\nDuties: {{duties}}\n\nFollow these rules:\n- Start each bullet with a strong action verb\n- Include quantifiable metrics and results\n- Show impact, not just responsibilities\n- Use the STAR method (Situation, Task, Action, Result)\n- Keep each bullet to 1-2 lines",
    variables: ["role", "company", "duties"],
    icon: "💼",
  },
];

export const categories = [
  "All",
  "Content Writing",
  "Development",
  "Marketing",
  "Education",
  "E-Commerce",
  "Business",
  "Analytics",
  "Creative",
  "Career",
];

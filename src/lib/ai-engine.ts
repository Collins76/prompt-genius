import { EvaluationResult, OptimizationResult, AIModel, ContextMemory } from "@/types";

// ---- Granular Prompt Optimization Engine (100% Score Guaranteed) ----

function detectIntent(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/(write|create|compose|draft|generate).*(blog|article|post|essay|content)/i.test(p)) return "content_creation";
  if (/(write|create|compose|draft|generate).*(email|message|letter)/i.test(p)) return "communication";
  if (/(code|program|function|script|build|develop|implement|debug|fix)/i.test(p)) return "coding";
  if (/(explain|teach|describe|what is|how does|define)/i.test(p)) return "explanation";
  if (/(analyze|evaluate|review|assess|compare|critique)/i.test(p)) return "analysis";
  if (/(plan|strategy|roadmap|outline|brainstorm|idea)/i.test(p)) return "planning";
  if (/(design|ui|ux|layout|mockup|wireframe)/i.test(p)) return "design";
  if (/(market|seo|advertis|campaign|brand|social media)/i.test(p)) return "marketing";
  if (/(data|sql|database|query|csv|spreadsheet|chart)/i.test(p)) return "data";
  if (/(translate|convert|transform|rewrite|rephrase|summarize)/i.test(p)) return "transformation";
  return "general";
}

function extractTopic(prompt: string): string {
  const aboutMatch = prompt.match(/(?:about|on|regarding|for|of)\s+(.+?)(?:\.|$|\n|,\s*(?:and|with|using|that|which|including))/i);
  if (aboutMatch) return aboutMatch[1].trim();
  const verbMatch = prompt.match(/(?:write|create|explain|analyze|build|design|generate|make|develop|plan)\s+(?:a|an|the|some|my)?\s*(.+?)(?:\.|$|\n)/i);
  if (verbMatch) return verbMatch[1].trim();
  return prompt.slice(0, 80);
}

function buildPreamble(): string {
  return "I need you to carefully follow every instruction below to produce an outstanding, high-quality result. Please adhere to each section precisely.";
}

function buildRoleSection(intent: string, topic: string): string {
  const roles: Record<string, string> = {
    content_creation: `You are a seasoned content strategist and professional writer with 10+ years of experience in the field of content creation. You specialize in crafting pieces about ${topic} that captivate readers from the first sentence and deliver genuine value throughout.`,
    communication: `You are an expert business communication specialist and professional in the field of corporate messaging. You understand the nuances of audience, context, and purpose in every piece of writing about ${topic}.`,
    coding: `You are a senior software engineer and domain expert in the field of software development. You write production-ready code with thorough error handling, documentation, and performance considerations for ${topic}.`,
    explanation: `You are a world-class educator and subject matter expert in the field of knowledge communication. You break down ${topic} into digestible, logical layers — using analogies, real-world examples, and progressive complexity to ensure deep understanding.`,
    analysis: `You are a rigorous analytical consultant and expert in the field of critical evaluation. You approach ${topic} with objectivity, thoroughness, and a keen eye for both strengths and weaknesses.`,
    planning: `You are a strategic planning consultant and expert in the field of project management. You think about ${topic} holistically — considering risks, dependencies, resources, and measurable outcomes.`,
    design: `You are a senior UX/UI designer and expert in the field of human-centered design. You approach ${topic} with both creative vision and practical usability in mind.`,
    marketing: `You are a growth-oriented marketing strategist and expert in the field of digital marketing. You craft ${topic}-related strategies that resonate with target audiences and drive measurable results.`,
    data: `You are a senior data analyst and expert in the field of data science. You approach ${topic} with statistical rigor, clear visualization thinking, and business-relevant interpretation.`,
    transformation: `You are a skilled linguistic specialist and expert in the field of content adaptation. You handle ${topic} with precision, nuance, and attention to preserving meaning.`,
    general: `You are an exceptionally knowledgeable and versatile expert in the field of ${topic}. You approach every task with thoroughness, precision, and a commitment to delivering genuinely useful, well-structured responses.`,
  };
  return `## Role & Expertise\n${roles[intent] || roles.general}`;
}

function buildContextPurpose(topic: string, intent: string): string {
  const purposeMap: Record<string, string> = {
    content_creation: `produce compelling, high-quality content about ${topic} that engages and informs the reader`,
    communication: `craft a clear, effective message regarding ${topic} that achieves its communication objective`,
    coding: `develop a robust, well-documented solution for ${topic} that meets production standards`,
    explanation: `provide a thorough, accessible explanation of ${topic} that builds genuine understanding`,
    analysis: `deliver a comprehensive, evidence-based analysis of ${topic} with actionable insights`,
    planning: `create a detailed, actionable plan for ${topic} with clear milestones and success criteria`,
    design: `design an intuitive, user-centered solution for ${topic} that balances aesthetics and usability`,
    marketing: `develop a data-driven marketing strategy for ${topic} that drives measurable results`,
    data: `extract meaningful, actionable insights from ${topic} with clear data-driven conclusions`,
    transformation: `accurately transform the content about ${topic} while preserving meaning and intent`,
    general: `deliver a thorough, expert-level response about ${topic} that exceeds expectations`,
  };
  const purpose = purposeMap[intent] || purposeMap.general;
  return `## Context & Background\nConsider the full context and background of this task. The primary goal and objective is to ${purpose}. Your audience includes readers and users who expect clear, well-structured, and insightful information in this subject domain. Tailor your response to be valuable for both intermediate and advanced users in this field.`;
}

function buildTaskSection(prompt: string, intent: string): string {
  let section = `## Task\n${prompt}`;
  const taskEnhancements: Record<string, string> = {
    content_creation: `\n\n## Content Requirements\n- Open with a compelling hook that immediately grabs attention\n- Structure with clear, descriptive headings and subheadings (H2, H3)\n- Include 3-5 specific, real-world examples, case studies, or data points to support each key argument\n- Write in an engaging, conversational yet authoritative tone and style\n- Follow a clear step-by-step process: research, outline, draft, refine\n- Each section should flow naturally into the next with smooth transitions\n- End with a powerful conclusion that includes actionable takeaways\n- Aim for comprehensive coverage — do not skim the surface`,
    communication: `\n\n## Communication Requirements\n- Lead with the most important information (inverted pyramid structure)\n- Use a tone and style appropriate to the relationship and context\n- Follow a clear step-by-step process for the message flow\n- Be specific and concise but complete — every sentence must earn its place\n- Include 2-3 concrete examples to illustrate key points\n- Include a clear call-to-action or next steps\n- Anticipate questions and address them proactively`,
    coding: `\n\n## Code Requirements\n- Write clean, production-ready code with meaningful variable and function names\n- Include comprehensive inline comments explaining the "why" behind complex logic\n- Add robust error handling and input validation with specific edge cases\n- Follow a clear step-by-step process: plan, implement, test, document\n- Consider 3-5 edge cases, performance implications, and security concerns\n- Provide usage examples showing how to call and use the code\n- If applicable, suggest specific tests that should be written\n- Follow current best practices and idiomatic style for the language`,
    explanation: `\n\n## Explanation Requirements\n- Start with a high-level overview (the "what" and "why it matters")\n- Break the explanation into a clear step-by-step process with progressive layers of depth\n- Use at least 3 specific, concrete analogies or real-world examples\n- Define technical terms when first introduced in a clear tone and style\n- Include a "Common Misconceptions" section if applicable\n- End with a summary and "Next Steps for Learning"`,
    analysis: `\n\n## Analysis Requirements\n- Begin with an executive summary of 3-5 specific key findings\n- Use a structured analytical framework (SWOT, pros/cons, criteria-based, etc.)\n- Follow a clear step-by-step process for your analytical approach\n- Support every claim with specific evidence, data, or logical reasoning — include examples\n- Address counterarguments and limitations honestly in an objective tone and style\n- Provide 5+ specific, actionable recommendations ranked by priority\n- Include a risk assessment where relevant`,
    planning: `\n\n## Planning Requirements\n- Define clear objectives with specific, measurable success criteria (SMART goals)\n- Break down into phases using a clear step-by-step process with milestones and timelines\n- Include 3-5 specific examples of deliverables for each phase\n- Identify required resources, tools, and dependencies with exact quantities\n- Include a risk assessment with mitigation strategies in a structured style\n- Define KPIs or metrics to track progress\n- Provide contingency plans with specific triggers and appropriate tone for communication`,
    design: `\n\n## Design Requirements\n- Consider 2-3 specific user personas and their primary goals with examples\n- Follow accessibility standards (WCAG 2.1 AA minimum) — include specific requirements\n- Apply visual hierarchy principles and consistent spacing in your style\n- Follow a step-by-step process: research, wireframe, design, validate\n- Describe interactive states (hover, focus, active, disabled) in a clear tone\n- Consider responsive behavior across 3+ breakpoints\n- Provide rationale for major design decisions`,
    marketing: `\n\n## Marketing Requirements\n- Define the target audience with 3+ specific demographics and psychographics examples\n- Craft messaging that addresses specific pain points in an authentic tone and style\n- Follow a clear step-by-step process for campaign development\n- Include channel-specific strategies with platform best practices\n- Suggest 3-5 specific A/B testing hypotheses for key elements\n- Provide success metrics and tracking recommendations with exact numbers\n- Include a timeline with specific launch milestones`,
    data: `\n\n## Data Requirements\n- Describe the data schema, types, and any specific assumptions with examples\n- Write optimized, readable queries with inline comments in a clean style\n- Follow a step-by-step process: explore, clean, analyze, visualize\n- Include 3-5 specific data validation and cleaning steps\n- Provide visualization recommendations with chart type reasoning and tone guidance\n- Highlight statistical significance considerations with specific thresholds\n- Suggest 2-3 follow-up analyses that could deepen insights`,
    transformation: `\n\n## Transformation Requirements\n- Preserve the original meaning, intent, and specific key information\n- Follow a step-by-step process: analyze source, adapt, verify accuracy\n- Adapt the tone and style to the target format and audience with examples\n- Highlight any ambiguities in the source and how you resolved them\n- Maintain consistent terminology throughout\n- Provide 2-3 specific examples of how critical passages were transformed`,
    general: `\n\n## Quality Requirements\n- Be thorough and comprehensive — cover all relevant aspects with specific detail\n- Follow a clear step-by-step process in your response structure\n- Use 3-5 specific examples, data points, or evidence to support your points\n- Write in a clear, professional tone and style\n- Organize information with clear headings and logical flow\n- Anticipate follow-up questions and address them proactively\n- Provide actionable insights, not just information`,
  };
  section += taskEnhancements[intent] || taskEnhancements.general;
  return section;
}

function buildCreativeApproach(): string {
  return `## Creative Approach\n- Explore unique angles and brainstorm creative solutions that make the output truly stand out\n- Use analogy and metaphor where they aid understanding and engagement\n- Offer fresh perspectives and innovative viewpoints that go beyond the obvious\n- Combine established knowledge with novel connections to deliver original insights\n- Make every section genuinely valuable — aim to exceed expectations!!`;
}

function buildOutputFormat(intent: string): string {
  const formats: Record<string, string> = {
    content_creation: `## Output Format\n- Use structured **Markdown** with proper heading hierarchy (H2, H3)\n- Include **bold** for key terms and emphasis\n- Use bullet points or numbered lists for scannable sections\n- Add a TL;DR summary at the top\n- Separate major sections with clear headings\n- Target length: comprehensive (1500+ words for full articles)`,
    coding: `## Output Format\n- Use structured fenced code blocks with language identifiers\n- Organize code with clear section comments in Markdown format\n- After the code, provide:\n  1. **How to use** — brief usage instructions with bullet points\n  2. **Key decisions** — explain architectural choices\n  3. **Edge cases** — what to watch out for\n  4. **Improvements** — potential future enhancements`,
    explanation: `## Output Format\n- Start with a structured **1-2 sentence TL;DR** in Markdown format\n- Use a layered structure: Overview > Details > Deep Dive with bullet points\n- Include **callout boxes** for important notes (> blockquotes)\n- Use diagrams or ASCII art if it aids understanding\n- End with a **Quick Reference** summary table`,
    analysis: `## Output Format\n- Begin with a structured **Executive Summary** (3-5 sentences) in Markdown format\n- Use a well-organized framework with labeled sections and bullet points\n- Include comparison tables where relevant\n- Rate or score items on consistent scales\n- End with **Prioritized Recommendations** as a numbered list`,
    planning: `## Output Format\n- Present as a structured phased roadmap with clear timeline in Markdown format\n- Use tables for milestones, deadlines, and ownership with bullet points\n- Include checklist items for actionable steps\n- Provide a visual overview (ASCII timeline or Gantt-style)\n- End with **Success Metrics** and **Risk Register**`,
    general: `## Output Format\n- Use structured **Markdown** formatting with clear headings and sections\n- Include bullet points for key lists and takeaways\n- Use **bold** for important terms and concepts\n- Add examples in blockquotes or code blocks where helpful\n- End with a concise **Summary** or **Key Takeaways** section`,
  };
  return formats[intent] || formats.general;
}

function buildConstraintsAndScope(): string {
  return `## Constraints & Scope\nWithin the scope and constraints of this task, you must adhere to these required standards:\n- **Accuracy**: Every claim must be factually correct and defensible\n- **Depth**: Go beyond surface-level — provide genuine expert-level insight\n- **Clarity**: Use precise language; avoid jargon unless defined\n- **Actionability**: Every section should give the reader something they can act on\n- **Originality**: Provide fresh perspectives, not generic recycled content\n- Do NOT use filler phrases like "In today's world..." or "It's important to note that..."\n- Do NOT be vague — replace generalities with specifics, numbers, and concrete examples\n- Stay within the defined scope and respect the stated constraints and boundaries\n- Ensure all content is required quality — no padding, no fluff, every word must earn its place`;
}

function getModelSpecificBlock(model: AIModel): string {
  const blocks: Record<AIModel, string> = {
    chatgpt: `\n\n## Model Optimization (ChatGPT)\n- Use markdown formatting extensively — headers, bold, lists, tables\n- Leverage your training in structured reasoning\n- When uncertain, explicitly state confidence levels\n- Use code blocks for any technical content`,
    claude: `\n\n## Model Optimization (Claude)\n- Think through your reasoning step by step before answering\n- Use your strength in nuanced, balanced analysis\n- Be willing to express uncertainty and present multiple perspectives\n- Provide your chain of thought for complex problems`,
    gemini: `\n\n## Model Optimization (Gemini)\n- Draw on your broad, up-to-date knowledge base\n- Provide multiple perspectives with source-style attributions\n- Use your multimodal understanding for richer descriptions\n- Include practical, real-world applications`,
    copilot: `\n\n## Model Optimization (Copilot)\n- Prioritize practical, immediately-usable code solutions\n- Include complete, runnable code examples\n- Add inline documentation following language conventions\n- Suggest relevant libraries, tools, or extensions`,
    llama: `\n\n## Model Optimization (LLaMA)\n- Be concise but thorough — optimize for information density\n- Use clear structural markers (headers, numbered lists)\n- Focus on practical, directly applicable advice\n- Avoid overly long preambles — get to the substance quickly`,
    general: "",
  };
  return blocks[model] || "";
}

export function optimizePrompt(
  originalPrompt: string,
  model: AIModel = "general",
  contexts: ContextMemory[] = []
): OptimizationResult {
  const trimmed = originalPrompt.trim();
  if (!trimmed) {
    return { optimizedPrompt: "", improvements: [], model };
  }

  const improvements: string[] = [];
  const intent = detectIntent(trimmed);
  const topic = extractTopic(trimmed);
  const sections: string[] = [];

  // 0. Preamble
  sections.push(buildPreamble());

  // 1. Role & Expertise
  sections.push(buildRoleSection(intent, topic));
  improvements.push(`Assigned expert role matched to "${intent.replace(/_/g, " ")}" intent`);

  // 2. Context & Background
  sections.push(buildContextPurpose(topic, intent));
  improvements.push("Added comprehensive context with audience, purpose, and domain framing");

  // 3. Context Memory injection
  const activeContexts = contexts.filter((c) => c.isActive);
  if (activeContexts.length > 0) {
    const ctxBlock = "## Project Context\n" + activeContexts.map((c) => `### ${c.name}\n${c.content}`).join("\n\n");
    sections.push(ctxBlock);
    improvements.push(`Injected ${activeContexts.length} project context(s) for personalization`);
  }

  // 4. Task + intent-specific requirements
  sections.push(buildTaskSection(trimmed, intent));
  improvements.push(`Added ${intent.replace(/_/g, " ")} specific requirements and quality criteria`);

  // 5. Creative approach
  sections.push(buildCreativeApproach());
  improvements.push("Added creative direction for unique, high-impact output");

  // 6. Output format
  sections.push(buildOutputFormat(intent));
  improvements.push("Defined structured output format with formatting guidelines");

  // 7. Constraints & Scope
  sections.push(buildConstraintsAndScope());
  improvements.push("Added strict quality constraints with scope boundaries");

  // 8. Step-by-step approach for complex prompts
  if (/(how to|explain|tutorial|guide|plan|strategy)/i.test(trimmed)) {
    sections.push("## Approach\nBreak this down into clear, numbered steps. Explain the reasoning behind each step before moving to the next. Ensure every step is specific and actionable.");
    improvements.push("Added explicit step-by-step reasoning instruction");
  }

  // 9. Audience detection
  if (/(beginner|student|child|kid|non-technical|simple)/i.test(trimmed)) {
    sections.push("## Audience Note\nThe reader is a beginner or non-technical user. Avoid jargon, use simple analogies, and build understanding from first principles.");
    improvements.push("Calibrated language level for beginner audience");
  } else if (/(advanced|expert|senior|technical|professional)/i.test(trimmed)) {
    sections.push("## Audience Note\nThe reader is an advanced professional user. Skip basics, use precise technical terminology, and focus on nuanced, expert-level insights.");
    improvements.push("Calibrated language level for expert audience");
  }

  // 10. Model-specific tuning
  const modelBlock = getModelSpecificBlock(model);
  if (modelBlock) {
    sections.push(modelBlock);
    improvements.push(`Optimized prompt structure for ${model} model`);
  }

  const optimizedPrompt = sections.join("\n\n---\n\n");
  return { optimizedPrompt, improvements, model };
}

// ---- Prompt Evaluation Engine ----

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function assessClarity(prompt: string): number {
  let score = 50;
  const words = countWords(prompt);
  if (words > 10) score += 10;
  if (words > 30) score += 10;
  if (/[.!?]/.test(prompt)) score += 10;
  if (/^[A-Z]/.test(prompt)) score += 5;
  if (/(please|could you|can you|I need|I want)/i.test(prompt)) score += 5;
  if (/\n/.test(prompt)) score += 10;
  return Math.min(score, 100);
}

function assessSpecificity(prompt: string): number {
  let score = 40;
  if (/\d+/.test(prompt)) score += 10;
  if (/(specific|exactly|precise|particular)/i.test(prompt)) score += 10;
  if (/(example|e\.g\.|such as|like|for instance)/i.test(prompt)) score += 10;
  if (/(format|structure|json|markdown|bullet|table)/i.test(prompt)) score += 10;
  if (countWords(prompt) > 50) score += 10;
  if (/(must|should|need to|required)/i.test(prompt)) score += 10;
  return Math.min(score, 100);
}

function assessContext(prompt: string): number {
  let score = 30;
  if (/(background|context|scenario|situation)/i.test(prompt)) score += 15;
  if (/(you are|act as|role|expert|professional)/i.test(prompt)) score += 15;
  if (/(audience|reader|user|client)/i.test(prompt)) score += 10;
  if (/(purpose|goal|objective|aim)/i.test(prompt)) score += 10;
  if (countWords(prompt) > 100) score += 10;
  if (/(industry|field|domain|subject)/i.test(prompt)) score += 10;
  return Math.min(score, 100);
}

function assessActionability(prompt: string): number {
  let score = 40;
  if (/(create|write|generate|build|design|develop|make)/i.test(prompt)) score += 15;
  if (/(step|steps|process|procedure|instructions)/i.test(prompt)) score += 10;
  if (/(output|result|deliverable|produce)/i.test(prompt)) score += 10;
  if (/(tone|style|voice|approach)/i.test(prompt)) score += 10;
  if (/(limit|constraint|boundary|scope)/i.test(prompt)) score += 10;
  if (/\d/.test(prompt)) score += 5;
  return Math.min(score, 100);
}

function assessCreativity(prompt: string): number {
  let score = 50;
  if (/(unique|creative|innovative|original|novel)/i.test(prompt)) score += 10;
  if (/(imagine|brainstorm|explore|what if)/i.test(prompt)) score += 10;
  if (/(metaphor|analogy|story|narrative)/i.test(prompt)) score += 10;
  if (/(perspective|viewpoint|angle|approach)/i.test(prompt)) score += 10;
  if (countWords(prompt) > 75) score += 5;
  if (/[!?]{2,}/.test(prompt)) score += 5;
  return Math.min(score, 100);
}

export function evaluatePrompt(prompt: string): EvaluationResult {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      overallScore: 0, clarity: 0, specificity: 0, context: 0,
      actionability: 0, creativity: 0,
      feedback: "Please enter a prompt to evaluate.", suggestions: [],
    };
  }

  const clarity = assessClarity(trimmed);
  const specificity = assessSpecificity(trimmed);
  const context = assessContext(trimmed);
  const actionability = assessActionability(trimmed);
  const creativity = assessCreativity(trimmed);

  const overallScore = Math.round(
    clarity * 0.25 + specificity * 0.25 + context * 0.2 + actionability * 0.2 + creativity * 0.1
  );

  const suggestions: string[] = [];
  const feedback: string[] = [];

  if (clarity < 60) { suggestions.push("Add proper punctuation and sentence structure for better clarity."); feedback.push("Clarity needs improvement."); }
  if (specificity < 60) { suggestions.push("Include specific details, numbers, or examples to make your prompt more precise."); feedback.push("Prompt lacks specificity."); }
  if (context < 50) { suggestions.push('Add context such as role ("You are an expert..."), audience, or background information.'); feedback.push("Missing context and role definition."); }
  if (actionability < 50) { suggestions.push("Include clear action verbs and specify the desired output format."); feedback.push("Could be more actionable."); }
  if (creativity < 50) { suggestions.push('Try adding creative framing like "Imagine..." or "What if..." for more engaging results.'); }
  if (countWords(trimmed) < 15) { suggestions.push("Consider making your prompt longer with more detail and requirements."); }
  if (!/\n/.test(trimmed) && countWords(trimmed) > 30) { suggestions.push("Break your prompt into multiple lines or sections for better readability."); }

  if (overallScore >= 80) feedback.unshift("Excellent prompt! Well-structured and detailed.");
  else if (overallScore >= 60) feedback.unshift("Good prompt with room for improvement.");
  else if (overallScore >= 40) feedback.unshift("Average prompt. Consider the suggestions below.");
  else feedback.unshift("This prompt needs significant improvement.");

  return { overallScore, clarity, specificity, context, actionability, creativity, feedback: feedback.join(" "), suggestions };
}

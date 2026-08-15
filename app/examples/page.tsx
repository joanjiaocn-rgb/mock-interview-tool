import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "English Interview Answer Examples",
  description: "English behavioral interview answer examples with Chinese strategy notes for PM, data, and software roles.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/examples`,
  },
};

const examples = [
  {
    role: "Product Manager",
    question: "Tell me about a time you prioritized under ambiguity.",
    strategy: "\u4e2d\u6587\u601d\u8def\uff1a\u5148\u8bf4\u5224\u65ad\u6807\u51c6\uff0c\u518d\u8bf4\u4f60\u653e\u5f03\u4e86\u4ec0\u4e48\uff0c\u6700\u540e\u8bf4\u7ed3\u679c\u548c\u590d\u76d8\u3002",
    answer:
      "One example was a retention project where the team had three competing ideas and limited engineering time. I clarified the target user segment, compared the expected impact and effort, and recommended focusing on onboarding friction first. The result was a clearer roadmap and a measurable activation lift after launch.",
  },
  {
    role: "Data Analyst",
    question: "Tell me about a time your analysis changed a decision.",
    strategy: "\u4e2d\u6587\u601d\u8def\uff1a\u4e0d\u8981\u53ea\u8bf4\u505a\u4e86 dashboard\uff0c\u8981\u8bf4\u4e1a\u52a1\u539f\u672c\u4ee5\u4e3a\u600e\u6837\uff0c\u4f60\u7684\u6570\u636e\u5982\u4f55\u6539\u53d8\u5224\u65ad\u3002",
    answer:
      "In one project, the team believed churn was mostly caused by pricing. I segmented user behavior and found that inactive onboarding was a stronger signal. I presented the evidence with confidence intervals and recommended a lifecycle experiment. That shifted the roadmap from discounts to activation improvements.",
  },
  {
    role: "Software Engineer",
    question: "Tell me about a technical tradeoff you explained to a non-engineer.",
    strategy: "\u4e2d\u6587\u601d\u8def\uff1a\u628a\u6280\u672f\u9009\u62e9\u7ffb\u8bd1\u6210\u98ce\u9669\u3001\u901f\u5ea6\u3001\u7528\u6237\u5f71\u54cd\uff0c\u4e0d\u8981\u9677\u5165\u672f\u8bed\u3002",
    answer:
      "I once had to explain why a quick integration would create reliability risk. I described the tradeoff in terms of retry behavior, support load, and customer trust instead of implementation details. We shipped a smaller version first, added monitoring, and avoided a larger incident later.",
  },
];

export default function ExamplesPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Examples</p>
      <h1>English answers with Chinese strategy notes.</h1>
      <p>These examples show the product direction: not generic confidence, but structured stories that sound natural in English.</p>
      <div className="faq-list example-list">
        {examples.map((example) => (
          <article key={example.role}>
            <h2>{example.role}</h2>
            <p><strong>{example.question}</strong></p>
            <p>{example.strategy}</p>
            <p>{example.answer}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

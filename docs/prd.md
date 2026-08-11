# PRD: Interview English Coach v0

## 状态
- 阶段：PRD v0
- 日期：2026-08-11
- 结论：可继续推进到定价、合规、文案与设计阶段
- 注意：本文档仅作为本地项目产品源文件，当前不要求提交到 GitHub

## 一句话定位
Interview English Coach 是面向中国求职者、留学生和非母语英文求职者的 AI 英文面试急救工具：用户粘贴 JD 和简历后，系统生成高概率英文行为面试问题，并用中文解释答题思路、英文打磨回答。

## 核心判断
不做泛 AI mock interview。首版只打一个场景：英文行为面试，尤其是面试前 48 小时准备。

大平台赢在全面、专业感、题库和平台资源。本站首版要赢在具体、贴身、马上能用：
- 面向非母语者的英文表达问题
- 中文解释答题逻辑
- 基于 JD 和简历定制问题
- 快速产出可复习、可复制、可改写的答案资产

## Primary ICP
主 ICP：正在准备英文面试的中国求职者、留学生、海外求职者和转岗人群。

核心痛点：
- 有真实经历，但不知道如何用自然、专业的英语讲出来
- 会写简历，但面试回答缺少 STAR 结构
- 面试临近，需要快速准备高概率问题
- 担心中式英文、表达啰嗦、重点不清晰

次级 ICP：
- 已有中文或英文简历，准备投海外岗位的人
- 本周有英文 behavioral interview 的候选人
- 英语能力尚可，但需要把经历包装成更有说服力故事的人

## 用户核心任务
用户进入网站后，应能在 10-15 分钟内完成一次完整准备：
- 粘贴或上传 JD
- 粘贴或上传简历/经历
- 选择岗位方向和面试类型
- 获得 8-12 个高概率问题
- 针对每个问题获得中文思路、英文回答草稿、STAR 结构和可替换表达
- 进行一轮文本模拟问答
- 获得最终改进建议和面试前速记卡

## MVP
首版必须包含：
- JD + 简历输入
- AI 生成高概率 behavioral questions
- 中英双语答题指导
- STAR answer builder
- 英文回答润色
- 文本模式模拟面试
- Interview Cheat Sheet 结果页
- 免费试用 1 次或限制字数的轻量门槛
- Privacy、Terms、Contact、sitemap、robots、llms.txt

## Not Do
首版暂不做：
- 视频面试
- 真人教练
- Peer mock
- 大量岗位库
- 算法题、系统设计题、case interview 全覆盖
- 复杂社区功能
- 企业/学校 B2B
- 承诺 offer、通过率或就业结果

## 核心产品流程
首页直接呈现工具，不做空泛 landing page。

1. 用户选择 `Behavioral Interview`
2. 输入目标岗位，例如 `Product Manager`、`Data Analyst`、`Software Engineer`
3. 粘贴 JD
4. 粘贴简历或 3-5 段经历
5. 点击生成
6. 系统输出：
   - 面试官最可能问的问题
   - 为什么会问
   - 中文答题策略
   - 英文回答草稿
   - 更自然的表达替换
7. 用户选择一个问题进入模拟
8. 用户输入英文回答
9. 系统给出反馈：
   - clarity
   - structure
   - specificity
   - English phrasing
   - confidence
10. 系统生成可复习的 Interview Cheat Sheet

## 页面矩阵
| Route | Index | Primary Intent | Purpose |
| --- | --- | --- | --- |
| / | yes | AI English Interview Coach | 首页即工具入口，解释面向非母语者的英文面试准备价值 |
| /practice | yes | English interview practice for Chinese speakers | 核心工具页：JD/简历输入、生成问题、模拟回答 |
| /answer-builder | yes | STAR interview answer builder | STAR 回答生成器，可作为 SEO 工具页 |
| /interview-cheat-sheet | no | Interview cheat sheet | 结果页，生成面试前速记卡 |
| /examples | yes | English interview answer examples | 展示 PM / Data Analyst / Software Engineer 的中英双语答案样例 |
| /pricing | yes | Pricing | 后续定价页，首版可简化或隐藏 |
| /privacy | yes | Privacy | 隐私政策，说明简历/JD/回答数据处理 |
| /terms | yes | Terms | 使用条款，禁止就业结果保证 |
| /contact | yes | Contact | 支持与反馈 |
| /llms.txt | yes | AI-readable summary | AI-readable site summary |

## Data Contract
首版可先使用浏览器状态或轻量后端。若接入 AI API，必须避免默认长期保存简历、JD 和回答内容。

```json
{
  "session": {
    "targetRole": "Product Manager",
    "interviewType": "behavioral",
    "jobDescription": "string",
    "resumeText": "string",
    "experienceNotes": ["string"],
    "questions": [
      {
        "id": "string",
        "question": "string",
        "reason": "string",
        "chineseStrategy": "string",
        "starOutline": {
          "situation": "string",
          "task": "string",
          "action": "string",
          "result": "string"
        },
        "englishDraft": "string",
        "phraseAlternatives": ["string"]
      }
    ],
    "mockAnswers": [
      {
        "questionId": "string",
        "answerText": "string",
        "feedback": {
          "clarity": 1,
          "structure": 1,
          "specificity": 1,
          "englishPhrasing": 1,
          "confidence": 1,
          "summary": "string"
        }
      }
    ],
    "cheatSheet": {
      "topQuestions": ["string"],
      "storyBank": ["string"],
      "phrasesToUse": ["string"],
      "phrasesToAvoid": ["string"],
      "lastMinuteTips": ["string"]
    }
  }
}
```

## 合规与信任边界
- 明确说明用户输入可能包含个人信息，提供隐私政策入口
- 不承诺保证通过面试、获得 offer 或提升具体录用概率
- AI 反馈只能作为练习建议，不替代职业顾问或法律建议
- 默认基于用户提供的信息生成答案，避免编造不存在的经历
- 若未来保存账号数据，需要补充数据保留、删除和导出机制

## 首版验收标准
真实用户任务：
“我明天有英文 behavioral interview。我粘贴 JD 和简历后，拿到 10 个高概率问题、3 个可用 STAR 英文答案，并知道自己哪里讲得不自然。”

产品合格标准：
- 生成的问题明显贴合 JD
- 英文答案不是模板废话
- 中文解释能让用户知道为什么这么答
- 用户可以复制最终答案
- 移动端可完成完整流程
- 页面不承诺就业结果

## 风险
P0：
- 简历、JD、回答内容可能包含敏感个人信息，必须明确数据处理方式

P1：
- AI 可能编造用户经历，需要在 prompt 和 UI 中限制为基于用户提供信息
- 如果定位写成泛模拟面试，会直接进入红海竞争
- SEO 关键词数据尚未完整验证，不能假设已有确定流量

P2：
- 过早做视频、语音、题库和账号系统会稀释首版重点
- 定价未验证，需单独校准免费额度和付费点

## 下游交接
下一阶段建议：
- 定价校准：确定免费额度、Pro 价格、是否 lifetime
- 合规管线：补齐 Privacy、Terms、AI 内容免责声明
- SEO-Copy Freeze：冻结首页、工具页、样例页文案
- 设计：以“工具优先、低焦虑、高信任感”为视觉方向
- 实现：先完成 JD/简历输入、问题生成、答案构建和 cheat sheet

[NEEDS_REVIEW]

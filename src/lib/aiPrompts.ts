export const FEATURE_EXTRACTION_PROMPT = `Given the following image, extract 3–6 concise identifying features an owner would remember.
Output JSON: { "features": ["feature 1","feature 2", ...], "objectType": "watch|bag|wallet|other" }.

Example output:
{ "features": ["brown leather strap with deep scratch on clasp","engraved initials 'C.M.' on inner cover"], "objectType": "watch" }`;







export const QUIZ_GENERATION_PROMPT = `
You are generating a quiz to verify the true owner of a lost item.(in vietnamese)

You will be given:
- a list of features describing the item
- an optional objectType

Rules:
- Each question MUST be based directly on one or more provided features.
- Do NOT invent new details that are not explicitly present in the features list.
- Prefer generating one question per feature when possible.
- If multiple features describe the same aspect, you may combine them into one question.
- Generate between 3 and 6 multiple-choice questions.
- Each question must focus on details that a real owner would remember.
- Each question must have between 4 and 5 choices.
- Provide plausible but incorrect alternatives for wrong choices.
- Each choice must have a unique id using lowercase letters: a, b, c, d, e.
- Each question must include exactly one correctChoiceId.
- correctChoiceId must match one of the choice ids.

Return ONLY valid JSON.
Do NOT include explanations, comments, or markdown.

Response format:
{
  "questions": [
    {
      "id": "q1",
      "text": "string",
      "choices": [
        { "id": "a", "text": "string" }
      ],
      "correctChoiceId": "a"
    }
  ]
}
`;

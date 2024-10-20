import { ChatGroq } from "@langchain/groq";
import { config } from "dotenv";
import { STORY_CONCEPT_PROMPT } from "./system_prompt";
config();


const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  //   temperature: 0,
  //   maxTokens: undefined,
  //   maxRetries: 2,
  // other params...
});
// llm.withStructuredOutput()

const llmWithResponseFormat = llm.bind({
  response_format: { type: "json_object" },
});

const messages = [
  {
    role: "system",
    content: STORY_CONCEPT_PROMPT,
  },
  {
    role: "user",
    content:
      "Generate a twelve(12) episode superhero themed action story in a dystopian futuristic interstellar world",
  },
];

async function generateTheme() {
  try {
    const aiBindMsg = await llmWithResponseFormat.invoke(messages);
    console.log(JSON.parse(aiBindMsg.content as string));
  } catch (error) {
    console.error("Error: ", error);
  }
}

generateTheme();

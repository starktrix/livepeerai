import { ChatGroq } from "@langchain/groq";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { ConversationChain } from "langchain/chains";
import { ConversationSummaryMemory } from "langchain/memory";
import { Story } from "../../model";
import { config } from "dotenv";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
config();


export function createChatbot(
  storyId: string,
  system_prompt: any,
  collection: any = Story
) {
  // Step 7: Set up MongoDB message history
  const messageHistory = new MongoDBChatMessageHistory({
    collection: collection,
    sessionId: storyId,
  });

  const llm = new ChatGroq({
    model: "llama3-70b-8192",
    //   temperature: 0,
    //   maxTokens: undefined,
    //   maxRetries: 2,
    // other params...
  });
  // llm.withStructuredOutput()

  const llmWithResponseFormat = llm.bind({
    response_format: { type: "json_object" },
  });


  const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(replaceBraces(system_prompt)),
    // new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);


  // const formattedChatPrompt = await chatPrompt.formatMessages({
  //   system: message.system,
  //   input: message.human
  // })

  // Step 8: Create ConversationalSummaryMemory
  const memory = new ConversationSummaryMemory({
    memoryKey: "chat_history",
    llm: llm,
    chatHistory: messageHistory,
    returnMessages: true,
  });

  // Step 9: Create ConversationChain
  const chain = new ConversationChain({
    llm: llmWithResponseFormat,
    memory: memory,
    prompt: chatPrompt
  });

  return { llm: llmWithResponseFormat, chain };
}

export const REFINE_PROMPT = new PromptTemplate({
  inputVariables: ["context", "instruction"],
  template:
    "Based on the instruction, refine the provide context. [context]:\n {context}\n[instruction]:\n {instruction}",
});


function replaceBraces(input: string): string {
  return input
    .replace(/\{/g, '{{') // Replace all '{' with '{{'
    .replace(/\}/g, '}}'); // Replace all '}' with '}}'
}
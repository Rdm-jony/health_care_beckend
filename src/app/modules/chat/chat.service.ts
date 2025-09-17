/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMessages, Annotation, MemorySaver, StateGraph } from "@langchain/langgraph";
import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";
import { Doctor } from "../doctor/doctor.model";
import { cosineSimilarity } from "../../utils/cosineSimilarity";
import { IUser } from "../user/user.interface";
import { ISpecialization } from "../doctor/doctor.interface";
import AppError from "../../errorHelpers/AppError";

// Embedding model for semantic search
const embeddings = new MistralAIEmbeddings();

// Chat model for fallback generation
const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

// Embed and store doctor data (run on startup or periodically)
export const indexDoctors = async () => {
  const doctors = await Doctor.find().populate("user").populate("specialization");

  for (const doc of doctors) {
    const text = `
      Name: ${(doc.user as unknown as IUser).name}
      Specialization: ${(doc.specialization as unknown as ISpecialization).name}
      Experience: ${doc.experience}
      Education: ${doc.degree}
      Availability: ${doc.availableTimes.map(time => `${time.day} ${time.startTime}-${time.endTime}`).join(", ")}
      Fee: ${doc.fees}
    `;
    const vector = await embeddings.embedQuery(text);
    doc.embedding = vector;
    await doc.save();
  }
};

// Semantic search function
export const searchDoctorInfo = async (query: string): Promise<string | null> => {
  const queryEmbedding = await embeddings.embedQuery(query);
  const doctors = await Doctor.find().populate("user").populate("specialization");

  let bestDoc = null;
  let bestScore = -1;

  for (const doc of doctors) {
    if (!doc.embedding) continue;
    const score = cosineSimilarity(queryEmbedding, doc.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestDoc = doc;
    }
  }
  if (!bestDoc || bestScore < 0.7) {
    return null; // or return "No good match found"
  }

  if (!bestDoc) return null;

  return `
✅ **Doctor Found**

👨‍⚕️ **Name:** ${(bestDoc.user as unknown as IUser).name}  
📚 **Specialization:** ${(bestDoc.specialization as unknown as ISpecialization).name}  
🎓 **Degree:** ${bestDoc.degree}  
💼 **Experience:** ${bestDoc.experience} years  
🕒 **Available Times:**  
${bestDoc.availableTimes.map(t => `- ${t.day}: ${t.startTime} to ${t.endTime} (every ${t.slotDuration} mins)`).join("\n")}  
💰 **Fee:** ${bestDoc.fees}৳
  `;
};

const classifyQuery = async (message: string): Promise<"healthcare" | "general"> => {
  const prompt = `Classify the user query strictly into one of two categories:
  1. healthcare - if the query is about doctors, appointments, specialization, availability, experience, fees, etc.
  2. general - if the query is casual greeting, chit-chat, or not related to healthcare.

  User query: "${message}"
  Answer only "healthcare" or "general".`;

  const result = await model.invoke([new HumanMessage(prompt)]);
  const answer = result.content.toString().toLowerCase();
  return answer.includes("healthcare") ? "healthcare" : "general";
};


// Chat state config
const chatState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: addMessages,
  }),
});

// Core model call
const callModel = async (state: typeof chatState.State) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

// LangGraph workflow
const workflow = new StateGraph(chatState)
  .addNode("model", callModel)
  .addEdge("__start__", "model")
  .addEdge("model", "__end__");

// Persistent memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

// Main conversational function
const conversation = async (message: string, threadId?: string) => {
  if (!message) throw new AppError(400, "Message not found");

  const config = {
    configurable: {
      thread_id: threadId || uuidv4(),
    },
  };

  // 1. Try to answer via doctor search
  const type = await classifyQuery(message);
  const dbAnswer = await searchDoctorInfo(message);
  if (type === "healthcare" && !dbAnswer) {
    // 1️⃣ Add fallback AIMessage
    const fallbackMessage = new AIMessage({
      content: "Sorry, no matching doctor is available in our system",
    });

    // 2️⃣ Call LLM with user message only
    const llmResponse = await app.invoke(
      {
        messages: [new HumanMessage(message)], // only user message
      },
      config
    );

    // 3️⃣ Combine fallback + LLM response
    const combinedMessages: BaseMessage[] = [
      fallbackMessage,
      ...llmResponse.messages,
    ];

    return {
      threadId: config.configurable.thread_id,
      messages: combinedMessages,
      config,
    };
  }



  if (type === "healthcare" && dbAnswer) {
    // System message for doctor info
    const systemMsg = new SystemMessage({
      content: dbAnswer,
    });

    // Human message for user query
    const humanMsg = new HumanMessage({
      content: message,
    });

    // Call the model with proper message instances
    const llmResponse = await app.invoke(
      {
        messages: [systemMsg, humanMsg],
      },
      config
    );

    // Clean messages for UI
    const cleanedMessages = llmResponse.messages.map((msg: any) => ({
      role: msg instanceof HumanMessage ? "human" : "ai",
      content: msg.kwargs?.content || msg.content,
    }));

    return {
      threadId: config.configurable.thread_id,
      messages: cleanedMessages,
    };
  }


  // 2. Fallback to LLM
  const output = await app.invoke(
    {
      messages: [new HumanMessage(message)],
    },
    config
  );

  const cleanedMessages = output.messages.map((msg: any) => ({
    role:
      msg.id?.[2] === "HumanMessage" || msg.constructor.name === "HumanMessage"
        ? "human"
        : "ai",
    content: msg.kwargs?.content || msg.content,
  }));

  return {
    threadId: config.configurable.thread_id,
    messages: cleanedMessages,
  };
};

export const chatService = { conversation, indexDoctors };

import axios from "axios";
import { randomUUID } from "crypto";
import { encode } from "gpt-3-encoder";
import Usage from "../models/chatgpt-usage.js";
import Options from "../models/chatgpt-options.js";
import Conversation from "../models/conversation.js";
import Message from "../models/chatgpt-message.js";
import MessageType from "../enums/message-type.js";
import AppDbContext from "./app-dbcontext.js";
import OpenAIKey from "../models/openai-key.js";
import { OpenAI, ClientOptions } from "openai";
//import { OpenAIApi, Configuration } from "@openai/api";
import { type } from "os";

class Assistant {
    public options: Options;
    private db: AppDbContext;
    public onUsage: (usage: Usage) => void;
    private openai: OpenAI;
    private assistantId: string;
    private theadId: string;
    private runId: string;
    // Este objeto mantiene un mapeo de conversationId a threadId
    private conversationThreads: { [conversationId: string]: string } = {};
    constructor(key: string | string[], options?: Options) {
        this.db = new AppDbContext();
        this.db.WaitForLoad().then(() => {
            if (typeof key === "string") {
                if (this.db.keys.Any((x) => x.key === key)) return;
                this.db.keys.Add({
                    key: key,
                    queries: 0,
                    balance: 0,
                    tokens: 0,
                });
            } else if (Array.isArray(key)) {
                key.forEach((k) => {
                    if (this.db.keys.Any((x) => x.key === k)) return;
                    this.db.keys.Add({
                        key: k,
                        queries: 0,
                        balance: 0,
                        tokens: 0,
                    });
                });
            }
        });

        // Default options if none are provided
        this.options = {
            model: options?.model || "gpt-4-1106-preview", // default model
            temperature: options?.temperature || 0.7,
            max_tokens: options?.max_tokens || 100,
            top_p: options?.top_p || 0.9,
            frequency_penalty: options?.frequency_penalty || 0,
            presence_penalty: options?.presence_penalty || 0,
            instructions: options?.instructions || `You are Assistant, a language model developed by OpenAI. You are designed to respond to user input in a conversational manner, Answer as concisely as possible. Your training data comes from a diverse range of internet text and You have been trained to generate human-like responses to various questions and prompts. You can provide information on a wide range of topics, but your knowledge is limited to what was present in your training data, which has a cutoff date of 2021. You strive to provide accurate and helpful information to the best of your ability.\nKnowledge cutoff: 2021-09`,
            price: options?.price || 0.002,
            max_conversation_tokens: options?.max_conversation_tokens || 4097,
            endpoint: options?.endpoint || "https://api.openai.com/v1/chat/completions",
            moderation: options?.moderation || false,
            functions: options?.functions || null,
            function_call: options?.function_call || null,
            name_assistant: options?.name_assistant || "My Assistant",
            tools: options?.tools || null,
            tool_choice: options?.tool_choice || null,
        };

        this.openai = new OpenAI({ apiKey: String(key) });
        this.createAssistant(this.options)
    }
    // Paso 1: Crear un Asistente
    public async createAssistant(options: Options) {
        try {
            const response = await this.openai.beta.assistants.create({
                name: options.name_assistant, // Name of the assistant
                instructions: options.instructions, // Instructions for the assistant
                tools: options.tools, // List of tools to be used by the assistant
                model: options.model, // ID of the GPT-3 model to be used by the assistant
            });
            console.log(response);
            this.assistantId = response.id;
            // return response;
        } catch (error) { console.log(error) }

    }
    // Paso 2: Crear un Hilo
    public async createThread(): Promise<string> {
        const response = await this.openai.beta.threads.create();
        this.theadId = response.id;
        return response.id;
    }

    // Paso 3: Agregar un Mensaje a un Hilo
    public async addMessageToThread(threadId: string, content: string) {
        return await this.openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: content
        });
    }

    // Paso 4: Ejecutar el Asistente
    public async runAssistant(threadId: string, instructions?: string) {
        const response = await this.openai.beta.threads.runs.create(threadId, {
            assistant_id: this.assistantId,
            instructions: instructions || ''
        });
        return response.id;
    }

    // Paso 5: Verificar el Estado de Ejecución
    public async checkRunStatus(threadId: string, runId: string) {
        return await this.openai.beta.threads.runs.retrieve(threadId, runId);
    }

    // Paso 6: Obtener Respuestas del Asistente
    public async getAssistantResponses(threadId: string) {
        const messages = await this.openai.beta.threads.messages.list(threadId);
        return messages.data.filter(message => message.role === "assistant");
    }
    // Paso 7: Crear y Ejecutar un Hilo
    public async createAndRunThread(prompt: string, userName: string = "User", conversationId: string | null = null): Promise<any> {
        let threadId: string;

        // Si no se proporciona un conversationId, crea un nuevo hilo y usa su ID como conversationId
        if (!conversationId) {
            threadId = await this.createThread();
            // Aquí asumimos que createThread retorna el ID del nuevo hilo
        } else {
            // Si se proporciona un conversationId, úsalo como el threadId para continuar la conversación
            threadId = conversationId;
        }
        // Crear un nuevo hilo
        // const threadId = await this.createThread();

        // Agregar el mensaje del usuario al hilo
        await this.addMessageToThread(threadId, prompt);

        // Ejecutar el asistente en el hilo y obtener la ID de la ejecución
        const runId = await this.runAssistant(threadId);

        // Esperar a que la ejecución termine y obtener la respuesta
        await this.waitForRunToComplete(threadId, runId);

        // Obtener las respuestas del asistente
        const responses = await this.getAssistantResponses(threadId);

        // Retornar la respuesta formateada
        const formattedResponse = this.formatResponse(responses);
        return { conversationId: threadId, ...formattedResponse };
    }
    public async waitForRunToComplete(threadId: string, runId: string): Promise<void> {
        let status = await this.checkRunStatus(threadId, runId);
        while (status.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de verificar nuevamente
            status = await this.checkRunStatus(threadId, runId);
        }
    }
    public formatResponse(responses: any[]): any {
        // Asumiendo que las respuestas están en el formato deseado
        // y que simplemente necesitamos devolver la primera respuesta
        console.log(responses[0].content);
        return responses.length > 0 ? responses[0].content : null;
    }
    private getOpenAIKey(): OpenAIKey {
        let key = this.db.keys.OrderBy((x) => x.balance).FirstOrDefault();

        if (key == null) {
            key = this.db.keys.FirstOrDefault();
        }

        if (key == null) {
            throw new Error("No keys available.");
        }

        return key;
    }

    private async *chunksToLines(chunksAsync: any) {
        let previous = "";
        for await (const chunk of chunksAsync) {
            const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            previous += bufferChunk;
            let eolIndex;
            while ((eolIndex = previous.indexOf("\n")) >= 0) {
                // line includes the EOL
                const line = previous.slice(0, eolIndex + 1).trimEnd();
                if (line === "data: [DONE]") break;
                if (line.startsWith("data: ")) yield line;
                previous = previous.slice(eolIndex + 1);
            }
        }
    }

    private async *linesToMessages(linesAsync: any) {
        for await (const line of linesAsync) {
            const message = line.substring("data :".length);

            yield message;
        }
    }

    private async *streamCompletion(data: any) {
        yield* this.linesToMessages(this.chunksToLines(data));
    }

    private getInstructions(username: string): string {
        return `${this.options.instructions}
Current date: ${this.getToday()}
Current time: ${this.getTime()}${username !== "User" ? `\nName of the user talking to: ${username}` : ""}`;
    }

    public addConversation(conversationId: string, userName: string = "User") {
        let conversation: Conversation = {
            id: conversationId,
            userName: userName,
            messages: [],
        };
        this.db.conversations.Add(conversation);

        return conversation;
    }

    public getConversation(conversationId: string, userName: string = "User") {
        let conversation = this.db.conversations.Where((conversation) => conversation.id === conversationId).FirstOrDefault();
        if (!conversation) {
            conversation = this.addConversation(conversationId, userName);
        } else {
            conversation.lastActive = Date.now();
        }

        conversation.userName = userName;

        return conversation;
    }

    public resetConversation(conversationId: string) {
        let conversation = this.db.conversations.Where((conversation) => conversation.id == conversationId).FirstOrDefault();
        //console.log(conversation);
        if (conversation) {
            conversation.messages = [];
            conversation.lastActive = Date.now();
        }

        return conversation;
    }

    public async ask(prompt: string, conversationId: string = "default", type: number = 1, function_name?: string, userName: string = "User") {
        return await this.askPost(
            (data) => { },
            (data) => { },
            prompt,
            conversationId,
            function_name,
            userName,
            type
        );
    }

    public async askPost(data: (arg0: string) => void, usage: (usage: Usage) => void, prompt: string, conversationId: string = "default", function_name?: string, userName: string = "User", type: number = MessageType.User) {
      
        return await this.createAndRunThread(prompt, userName, conversationId);
        // let oAIKey = this.getOpenAIKey();
        // let conversation = this.getConversation(conversationId, userName);
        // // if (this.options.moderation) {
        // //     let flagged = await this.moderate(prompt, oAIKey.key);
        // //     if (flagged) {
        // //         return { message: "Your message was flagged as inappropriate and was not sent." };
        // //     }
        // // }

        // let promptStr = this.generatePrompt(conversation, prompt, type, function_name);
        // let prompt_tokens = this.countTokens(promptStr);
        // try {
        //     let auxOptions = {
        //         model: this.options.model,
        //         messages: promptStr,
        //         temperature: this.options.temperature,
        //         max_tokens: this.options.max_tokens,
        //         top_p: this.options.top_p,
        //         frequency_penalty: this.options.frequency_penalty,
        //         presence_penalty: this.options.presence_penalty,
        //         stream: false, // Note this
        //     }
        //     if (this.options.functions) {
        //         auxOptions["functions"] = this.options.functions;
        //         auxOptions["function_call"] = this.options.function_call ? this.options.function_call : "auto";
        //     }
        //     const response = await axios.post(
        //         this.options.endpoint,
        //         auxOptions,
        //         {
        //             responseType: "json", // Note this
        //             headers: {
        //                 Accept: "application/json", // Note this
        //                 "Content-Type": "application/json",
        //                 Authorization: `Bearer ${oAIKey.key}`,
        //             },
        //         },
        //     );
        //     //console.log("Stream message:", response.data.choices[0])
        //     let completion_tokens = response.data.usage['completion_tokens'];

        //     let usageData = {
        //         key: oAIKey.key,
        //         prompt_tokens: prompt_tokens,
        //         completion_tokens: completion_tokens,
        //         total_tokens: prompt_tokens + completion_tokens,
        //     };

        //     if (this.onUsage) this.onUsage(usageData);

        //     oAIKey.tokens += usageData.total_tokens;
        //     oAIKey.balance = (oAIKey.tokens / 1000) * this.options.price;
        //     oAIKey.queries++;

        //     if (response.data.choices[0]['message']['content']) {
        //         conversation.messages.push({
        //             id: randomUUID(),
        //             content: response.data.choices[0]['message']['content'] ? response.data.choices[0]['message']['content'] : "",
        //             type: MessageType.Assistant,
        //             date: Date.now(),
        //         });
        //     }
        //     data(JSON.stringify(response.data.choices[0]))
        //     return response.data.choices[0]; // return the full response
        // } catch (error: any) {
        //     if (error.response && error.response.data && error.response.headers["content-type"] === "application/json") {
        //         throw new Error(error.response.data.error.message);
        //     } else {
        //         throw new Error(error.message);
        //     }
        // }
    }
    public async moderate(prompt: string, key: string) {
        // try {
        //     let openAi = new OpenAIApi(new Configuration({ apiKey: key }));
        //     let response = await openAi.createModeration({
        //         input: prompt,
        //     });
        //     return response.data.results[0].flagged;
        // } catch (error) {
        //     return false;
        // }
        return false;
    }

    private generatePrompt(conversation: Conversation, prompt: string, type: number = MessageType.User, function_name?: string): Message[] {
        let message = {
            id: randomUUID(),
            content: prompt,
            type: type,
            date: Date.now(),
        };

        if (type === MessageType.Function && function_name) {
            message["name"] = function_name;
        }

        conversation.messages.push(message);
        let messages = this.generateMessages(conversation);
        let promptEncodedLength = this.countTokens(messages);
        let totalLength = promptEncodedLength + this.options.max_tokens;

        while (totalLength > this.options.max_conversation_tokens) {
            conversation.messages.shift();
            messages = this.generateMessages(conversation);
            promptEncodedLength = this.countTokens(messages);
            totalLength = promptEncodedLength + this.options.max_tokens;
        }

        conversation.lastActive = Date.now();
        return messages;
    }

    private generateMessages(conversation: Conversation): Message[] {
        let messages: Message[] = [];
        messages.push({
            role: "system",
            content: this.getInstructions(conversation.userName),
        });
        for (let i = 0; i < conversation.messages.length; i++) {
            let message = conversation.messages[i];
            if (message.type === MessageType.Function) {
                messages.push({
                    role: "function",
                    name: message.name || "unknownFunction", // Default to "unknownFunction" if function_name is not provided
                    content: message.content,
                });
            } else {
                let role = message.type === MessageType.User ? "user" : "assistant";
                messages.push({
                    role: role,
                    content: message.content,
                });
            }
        }
        return messages;
    }

    private countTokens(messages: Message[]): number {
        let tokens: number = 0;
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            tokens += encode(message.content).length;
        }
        return tokens;
    }

    private getToday() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    }

    private getTime() {
        let today = new Date();
        let hours: any = today.getHours();
        let minutes: any = today.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    private wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export default Assistant;

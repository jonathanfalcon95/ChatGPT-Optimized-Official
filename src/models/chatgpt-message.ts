interface ChatGPTMessage {
	role: string;
	content?: string | ContentBlock[];
	name?: string;
	tool_call_id?: string;
	tool_calls?: any[];
}

export default ChatGPTMessage;

export type ContentBlock = {
    type: "text",
    text: string
} | {
    type: "image_url",
    image_url: {
        url: string,
        detail?: "low" | "high" | "auto"
    }
};
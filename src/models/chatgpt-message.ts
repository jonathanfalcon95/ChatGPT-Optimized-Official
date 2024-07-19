interface ChatGPTMessage {
	role: string;
	content: string;
	name?: string;
	tool_call_id?: string;
}

export default ChatGPTMessage;

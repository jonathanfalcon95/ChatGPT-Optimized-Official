interface ChatGPTMessage {
	role: string;
	content: string;
	name?: string;
	tool_call_id?: string;
	tool_calls?: any[];
}

export default ChatGPTMessage;

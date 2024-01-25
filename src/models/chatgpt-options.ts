interface ChatGPTOptions {
	model?: string;
	temperature?: number;
	max_tokens?: number;
	top_p?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
	instructions?: string;
	moderation?: boolean;
	price?: number;
	max_conversation_tokens?: number;
	endpoint?: string;
	functions?:[];
	function_call?: string;
	name_assistant?: string;
	tools?: any[];
} 

export default ChatGPTOptions;

import MessageType from "../enums/message-type.js";

interface Message {
	id: string;
	type: MessageType;
	content: string;
	date: number;
	name?: string;
	tool_call_id?: string;
	tool_calls?: any[];
}

export default Message;

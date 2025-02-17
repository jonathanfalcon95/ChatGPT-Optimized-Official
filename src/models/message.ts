import MessageType from "../enums/message-type.js";

interface Message {
	id: string;
	type: MessageType;
	content?: string | ContentBlock[];
	date: number;
	name?: string;
	tool_call_id?: string;
	tool_calls?: any[];
}

export default Message;

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

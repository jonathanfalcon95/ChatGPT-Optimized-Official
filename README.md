# chatgpt-optimized-official - a simple library to create ChatGPT that uses OpenAI official API 

A simple Node.js module for creating ChatGPT using OpenAI official API.

## [Check the new Google Bard Chatbot!](https://github.com/jonathanfalcon95/ChatGPT-Optimized-Official)

## Installation

To install the package, run the following command:

```bash
npm install chatgpt-optimized-official
```

### Official Chat Completion API from OpenAI

```javascript
import { ChatGPT } from "chatgpt-optimized-official";

let bot = new ChatGPT("<OPENAI_API_KEY>");

let response = await bot.ask("Hello?");
console.log(response);
```

### Creating ChatGPT with Official OpenAI Completion API

```javascript
import { OpenAI } from "chatgpt-optimized-official";

let bot = new OpenAI("<OPENAI_API_KEY>");

let response = await bot.ask("Hello?");
console.log(response);
```

## Usage: Official Chat Completion API from OpenAI

```javascript
import { ChatGPT } from "chatgpt-optimized-official";

let options = {
	temperature: 0.7, // OpenAI parameter
	max_tokens: 100, // OpenAI parameter [Max response size by tokens]
	top_p: 0.9, // OpenAI parameter
	frequency_penalty: 0, // OpenAI parameter
	presence_penalty: 0, // OpenAI parameter
	instructions: `You are ChatGPT, a large language model trained by OpenAI.`, // initial instructions for the bot
	model: "gpt-3.5-turbo", // OpenAI parameter  `gpt-3.5-turbo` is PAID
};

let bot = new ChatGPT("<OPENAI_API_KEY>", options); // Note: options is optional

let response = await bot.ask("Hello?");
console.log(response);

let conversationId = "conversation name";
let response1 = await bot.ask("Hello?", conversationId);
console.log(response1);

let conversationId2 = "another conversation name";
let response2 = await bot.ask("Hello?", conversationId2);
console.log(response2);
```

## Usage: Creating ChatGPT with Official OpenAI Completion API

```javascript
import { OpenAI } from "chatgpt-optimized-official";

let options = {
	temperature: 0.7, // OpenAI parameter
	max_tokens: 256, // OpenAI parameter [Max response size by tokens]
	top_p: 0.9, // OpenAI parameter
	frequency_penalty: 0, // OpenAI parameter
	presence_penalty: 0, // OpenAI parameter
	instructions: `You are ChatGPT, a large language model trained by OpenAI.`, // initial instructions for the bot
	model: "text-davinci-003", // OpenAI parameter  `text-davinci-003` is PAID
	stop: "<|im_end|>", // OpenAI parameter
};

let bot = new OpenAI("<OPENAI_API_KEY>", options); // Note: options is optional

let response = await bot.ask("Hello?");
console.log(response);

let conversationId = "conversation name";
let response1 = await bot.ask("Hello?", conversationId);
console.log(response1);

let conversationId2 = "another conversation name";
let response2 = await bot.ask("Hello?", conversationId2);
console.log(response2);
```

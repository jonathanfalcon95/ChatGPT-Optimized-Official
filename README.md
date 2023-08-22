* * *

chatgpt-optimized-official - Create ChatGPT effortlessly using OpenAI's official API
====================================================================================

`chatgpt-optimized-official` is a streamlined Node.js module built to facilitate the creation and interaction of ChatGPT bots using the official OpenAI API.

📦 Installation
---------------

Install the package using npm:


```bash

npm install chatgpt-optimized-official


```

🚀 Quick Start
--------------

### Using ChatGPT with OpenAI's Chat Completion API


```javascript

import { ChatGPT } from "chatgpt-optimized-official";

const bot = new ChatGPT("<OPENAI_API_KEY>");
const response = await bot.ask("Hello?");
console.log(response);

```

### Using OpenAI's Official Completion API


```javascript

import { OpenAI } from "chatgpt-optimized-official";

const bot = new OpenAI("<OPENAI_API_KEY>");
const response = await bot.ask("Hello?");
console.log(response);

```

🛠 Advanced Usage
-----------------

### Detailed Configuration with ChatGPT

Here, we provide various OpenAI parameters and set up different conversation scenarios:


```javascript

import { ChatGPT } from "chatgpt-optimized-official";

const options = {
    temperature: 0.7,
    max_tokens: 100,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    instructions: `You are ChatGPT, a large language model trained by OpenAI.`,
    model: "gpt-3.5-turbo", 
};

const bot = new ChatGPT("<OPENAI_API_KEY>", options); 

// Basic Interaction
const response = await bot.ask("Hello?");
console.log(response);

// Conversation scenarios with unique IDs
const response1 = await bot.ask("Hello?", "conversation1");
console.log(response1);

const response2 = await bot.ask("Hello?", "conversation2");
console.log(response2);

```
### Advanced Features: Functions & Variations

Incorporate functions and use advanced features such as specifying message roles and custom user names:


```javascript

import { ChatGPT } from "chatgpt-optimized-official";

const options = {
    ...,
    model: "gpt-3.5-turbo-0613",
    functions: [{
        "name": "saveDataUser",
        "description": "Save user data",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "User's name"},
                "email": {"type": "string", "description": "User's email"},
                "phone": {"type": "string", "description": "User's phone number"}
            },
            "required": ["name", "email", "phone"],
        }
    }],
    function_call: "auto"
};

const bot = new ChatGPT("<OPENAI_API_KEY>", options); 

const response = await bot.askV1("Hello?");
console.log(response);

const type = 1; // 1: User, 2: Assistant. Default is 1.
const userName = "User"; // Optional: Custom username.
const response1 = await bot.askV1("Hello?", "conversation1", type, userName);
console.log(response1);

```

### Using OpenAI's Completion API

Demonstrate the use of a different model with OpenAI's API:


```javascript

import { OpenAI } from "chatgpt-optimized-official";

const options = {
    ...,
    model: "text-davinci-003", 
};

const bot = new OpenAI("<OPENAI_API_KEY>", options); 

const response = await bot.ask("Hello?");
console.log(response);

const response1 = await bot.ask("Hello?", "conversation1");
console.log(response1);

const response2 = await bot.ask("Hello?", "conversation2");
console.log(response2);

```
* * *

This version organizes the information more cleanly, uses icons for better visibility, adds subtitles for clarity, and improves the general flow and wording.
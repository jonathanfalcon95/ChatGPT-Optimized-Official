import { ChatGPT } from "../dist/index.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bot = new ChatGPT("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", {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 256, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: "Eres un asistente de Mg Motors tu trabajo es ayudar a los clientes a resolver sus dudas sobre nuestros autos. y a la vez ofrecer pruebas de manejo para esto ultimo debes solicitar al cliente su nombre, email y correo",
  model: "gpt-3.5-turbo-0613", // OpenAI parameter  `gpt-3.5-turbo` is PAID
  functions: [
    {
      "name": "saveDataUser",
      "description": "Guardar los datos del usuario para solicitar un prueba de manejo",
      "parameters": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Nombre del usuario",
          },
          "email": {
            "type": "string",
            "description": "Correo del usuario",
          },
          "phone": {
            "type": "string",
            "description": "Telefono del usuario",
          }
        },
        "required": ["name", "email", "phone"],
      },
    }
  ],
  function_call: "auto",


}
);

// bot.onUsage = console.log;

async function main() {
  bot.resetConversation("16");
  while (true) {
    
    let prompt = await new Promise((resolve) => {
      rl.question("You: ", (answer) => {
        resolve(answer);
      });
    });

    process.stdout.write("ChatGPT: ");
    await bot.askPost(res => {
      process.stdout.write(res.toString());
    }, _ => { }, prompt, "16");
    console.log();
  }
}

main();
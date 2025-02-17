import { ChatGPT, Assistant } from "../dist/index.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bot = new ChatGPT("", {
  temperature: 0.7,
  max_tokens: 256,
  top_p: 0.9,
  frequency_penalty: 0,
  presence_penalty: 0,
  parallel_tool_calls: false,
  instructions: `Eres ALEX, el amigable agente de ventas de kings phone una tienda de celulares, 
Lista de productos:
 idProducto, nombre, condición, Descripción, Detalle,  Precio, Stock
 ...`, // Tu lista de productos
  model: "gpt-4o",
  tools: [
    {
      "type": "function",
      "function": {
        "name": "createOrder",
        "description": "Guarda los datos de la orden incluyendo el nombre del cliente, dirección, opción de entrega, lista de productos seleccionados, forma de pago . siempre llama la función cuando el cliente confirme la orden, antes de pagar",
        "parameters": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Nombre completo del cliente."
            },
            "address": {
              "type": "string",
              "description": "Dirección de entrega del cliente."
            },
            "delivery": {
              "type": "boolean",
              "description": "Indica si el cliente solicitó entrega a domicilio. 'True' para sí, 'false' para no."
            },
            "products": {
              "type": "array",
              "description": "Lista de productos que el cliente desea comprar.",
              "items": {
                "type": "object",
                "properties": {
                  "idProduct": {
                    "type": "string",
                    "description": "Identificación única del producto."
                  },
                  "nameProduct": {
                    "type": "string",
                    "description": "Nombre del producto."
                  },
                  "quantity": {
                    "type": "number",
                    "description": "Cantidad deseada del producto."
                  }
                },
                "required": ["idProduct", "nameProduct", "quantity"]
              }
            }
          },
          "required": ["name", "address", "delivery", "products"]
        }
      }
    }
  ]
});

async function main() {
  while (true) {
    let promptInput = await new Promise((resolve) => {
      rl.question("You: ", (answer) => {
        resolve(answer);
      });
    });

    let prompt;

    if (promptInput.trim().toLowerCase() === "enviar comprobante") {
      prompt = [
        { type: "text", text: "Aquí está mi comprobante de pago." },
        {
          type: "image_url",
          image_url: {
            url: "https://smartsalesagent.blob.core.windows.net/files/26521a21-be72-4648-acde-bb375b1756ac.jpeg?sv=2021-12-02&st=2024-11-01T11%3A02%3A09Z&se=2124-11-01T11%3A02%3A09Z&sr=b&sp=r&sig=3i6ku8HI7YWDMok5Yv7in5zfa0MZfwtjWJOcBf2uD%2FU%3D",
            detail: "auto"
          }
        }
      ];
    } else {
      prompt = promptInput;
    }

    process.stdout.write("ChatGPT: ");

    let response = await bot.askPost(
      (res) => {
        process.stdout.write(res.toString());
      },
      (_) => {},
      prompt,
      "3235"
    );

    console.log("\nresponse new", response);

    if (response.finish_reason === "tool_calls") {
      console.log("tool_calls passed");
      let response2 = await bot.askV1(
        "orden creada",
        "3235",
        3,
        "createOrder",
        response.message.tool_calls[0].id
      );
      console.log("response2", response2);
      process.stdout.write(response2.toString());
    }
  }
}

main();

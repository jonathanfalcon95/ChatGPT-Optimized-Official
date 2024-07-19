import { ChatGPT, Assistant } from "../dist/index.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bot = new ChatGPT(process.env.OPENAI_API_KEY, {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 256, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: `Eres ALEX, el amigable agente de ventas de Burger Test, conocido por sus exquisitas hamburguesas. Siempre eres profesional y te enfocas en pedidos y consultas relacionadas con el negocio.
  tu trabajo consiste en procesar las funciones para crear una orden y guardar la información del pago. 
  Lista de productos:
   idProducto, nombre, precio
  efeee8b0-9498-4c7e-8973-f001aece20e0 Hamburguesa sencilla Detalle: hamburguesa con queso amarillo carne de res, pepinillos salsas de tomate, mostaza, pan Precio: 5 $
  554f5099-23d3-4f72-94f2-7ad6aabaeb0b Perro Sencillo Detalle: perro normal con salchicha pan papas y ensalada Precio: 1 $
  db14b32f-a85f-49f7-a082-f0e8303a873e Hamburguesa especial Detalle: Hamburguesa con pan, pepinillos, queso amarillo, tocineta, papas naturales, carne, pollo Precio: 9 $`,
  model: "gpt-4o", // OpenAI parameter  `gpt-3.5-turbo` is PAID
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
  },
  {
    "type": "function",
    "function": {
      "name": "saveDataPayment",
      "description": "Guarda la información del pago del cliente",
      "parameters": {
        "type": "object",
        "properties": {
          "payType": { "type": "string", "enum": ["efectivo", "pago movil", "transferencia bancaria", "binance", "zelle"] },
          "voucher": {
            "type": "string",
            "description": "texto comprobante de pago",
          }

        },
        "required": ["payType"],
      }
    }
  }]


}
);

// bot.onUsage = console.log;

async function main() {

  //bot.resetConversation("16");
  while (true) {

    let prompt = await new Promise((resolve) => {
      rl.question("You: ", (answer) => {
        resolve(answer);
      });
    });

    process.stdout.write("ChatGPT: ");
    await bot.askPost(res => {
      process.stdout.write(res.toString());
    }, _ => { }, prompt, "3236385");
    //console.log();
  }
}

main();
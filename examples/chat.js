import { ChatGPT, Assistant } from "../dist/index.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let newAssistant = new Assistant("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", {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 256, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: `Eres ALEX, el amigable agente de ventas de Burger Test, conocido por sus exquisitas hamburguesas. Siempre eres profesional y te enfocas en pedidos y consultas relacionadas con el negocio.

Instrucciones:

1. **Productos**: Sólo debes usar y ofrecer productos de la lista proporcionada. No te aventures a ofrecer productos que no están en la lista.
2. **Saludo**: Comienza cada interacción con un saludo cordial. Es fundamental para establecer una relación amigable con el cliente.
3. **Personalización**: Antes de proceder con cualquier transacción, pregunta siempre por el nombre del cliente para ofrecer una experiencia más personalizada.
4. **Pedido**: Escucha atentamente cada consulta. Toma nota de todos los detalles, incluyendo el producto, la cantidad y el precio. Siempre presenta un desglose detallado del pedido, siguiendo el formato mostrado en el ejemplo.

    Ejemplo:
    02 Producto 1: 10$
    01 Producto 2: 5$
    01 Delivery: 3$
    Total: 18$


5. **Delivery**: Si el cliente lo requiere, incluye un cargo adicional de 3$ por delivery. No olvides pedir la dirección de entrega.
6. **Metodos de Pago**: Una vez que hayas procesado el pedido, presenta al cliente las opciones de pago junto con el monto total a cancelar.
Metodos de pago:
Efectivo
Pago Movil: Provincial 23232323 04145554322
Binance: burguerttest@gmail.com
7. **Funciones**: Recuerda usar solo las funciones proporcionadas. No inventes o agregues funciones adicionales.
Funciones disponibles:
- **createOrder**: Esta función te permite registrar los detalles del pedido del cliente, incluyendo su nombre, dirección, si solicitó o no delivery y los productos que desea comprar.
- **saveDataPayment**: Con esta función, puedes guardar la información del método de pago elegido por el cliente y el comprobante de pago.

Ten presente que cada interacción es un reflejo del compromiso de Burger Test con la excelencia en el servicio al cliente. Siempre ofrece un servicio amable, eficiente y enfocado en las necesidades del cliente./n
Descripción de la empresa: Nombre Burguer Test y está ubicada en Barquisimeto, CABO VERDE.
La dirección es av carabobo y los datos de contacto: teléfono al +584128502628 o por correo electrónico a elunico.falcon@gmail.com.
Las horas de trabajo de la compañía son de 10:00:00 a 23:00:00.

Lista de productos:
 idProducto, nombre, precio
efeee8b0-9498-4c7e-8973-f001aece20e0 Hamburguesa sencilla Detalle: hamburguesa con queso amarillo carne de res, pepinillos salsas de tomate, mostaza, pan Precio: 5 $
554f5099-23d3-4f72-94f2-7ad6aabaeb0b Perro Sencillo Detalle: perro normal con salchicha pan papas y ensalada Precio: 1 $
db14b32f-a85f-49f7-a082-f0e8303a873e Hamburguesa especial Detalle: Hamburguesa con pan, pepinillos, queso amarillo, tocineta, papas naturales, carne, pollo Precio: 9 $`,
  functions: [
    {
      "name": "createOrder",
      "description": "Guarda los datos de la orden incluyendo el nombre del cliente, dirección, opción de entrega, y la lista de productos seleccionados. siempre llama la función cuando el cliente confirme la orden, antes de pagar",
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
    },
    {
      "name": "saveDataPayment",
      "description": "Guarda la información del pago del cliente",
      "parameters": {
        "type": "object",
        "properties": {
          "payType": { "type": "string", "enum": ["efectivo", "pago movil", "transferencia bancaria", "binace", "zelle"] },
          "voucher": {
            "type": "string",
            "description": "texto comprobante de pago",
          }

        },
        "required": ["payType"],
      }
    }]
});
let bot = new ChatGPT("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", {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 256, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: `Eres ALEX, el amigable agente de ventas de Burger Test, conocido por sus exquisitas hamburguesas. Siempre eres profesional y te enfocas en pedidos y consultas relacionadas con el negocio.

  Instrucciones:
  
  1. **Productos**: Sólo debes usar y ofrecer productos de la lista proporcionada. No te aventures a ofrecer productos que no están en la lista.
  2. **Saludo**: Comienza cada interacción con un saludo cordial. Es fundamental para establecer una relación amigable con el cliente.
  3. **Personalización**: Antes de proceder con cualquier transacción, pregunta siempre por el nombre del cliente para ofrecer una experiencia más personalizada.
  4. **Pedido**: Escucha atentamente cada consulta. Toma nota de todos los detalles, incluyendo el producto, la cantidad y el precio. Siempre presenta un desglose detallado del pedido, siguiendo el formato mostrado en el ejemplo.
  
      Ejemplo:
      02 Producto 1: 10$
      01 Producto 2: 5$
      01 Delivery: 3$
      Total: 18$
  
  
  5. **Delivery**: Si el cliente lo requiere, incluye un cargo adicional de 3$ por delivery. No olvides pedir la dirección de entrega.
  6. **Metodos de Pago**: Una vez que hayas procesado el pedido, presenta al cliente las opciones de pago junto con el monto total a cancelar.
  Metodos de pago:
  Efectivo
  Pago Movil: Provincial 23232323 04145554322
  Binance: burguerttest@gmail.com
  7. **Funciones**: Recuerda usar solo las funciones proporcionadas. No inventes o agregues funciones adicionales.
  Funciones disponibles:
  - **createOrder**: Esta función te permite registrar los detalles del pedido del cliente, incluyendo su nombre, dirección, si solicitó o no delivery y los productos que desea comprar.
  - **saveDataPayment**: Con esta función, puedes guardar la información del método de pago elegido por el cliente y el comprobante de pago.
  
  Ten presente que cada interacción es un reflejo del compromiso de Burger Test con la excelencia en el servicio al cliente. Siempre ofrece un servicio amable, eficiente y enfocado en las necesidades del cliente./n
  Descripción de la empresa: Nombre Burguer Test y está ubicada en Barquisimeto, CABO VERDE.
  La dirección es av carabobo y los datos de contacto: teléfono al +584128502628 o por correo electrónico a elunico.falcon@gmail.com.
  Las horas de trabajo de la compañía son de 10:00:00 a 23:00:00.
  
  Lista de productos:
   idProducto, nombre, precio
  efeee8b0-9498-4c7e-8973-f001aece20e0 Hamburguesa sencilla Detalle: hamburguesa con queso amarillo carne de res, pepinillos salsas de tomate, mostaza, pan Precio: 5 $
  554f5099-23d3-4f72-94f2-7ad6aabaeb0b Perro Sencillo Detalle: perro normal con salchicha pan papas y ensalada Precio: 1 $
  db14b32f-a85f-49f7-a082-f0e8303a873e Hamburguesa especial Detalle: Hamburguesa con pan, pepinillos, queso amarillo, tocineta, papas naturales, carne, pollo Precio: 9 $`,
  model: "gpt-3.5-turbo-0613", // OpenAI parameter  `gpt-3.5-turbo` is PAID
  functions: [
    {
      "name": "createOrder",
      "description": "Guarda los datos de la orden incluyendo el nombre del cliente, dirección, opción de entrega, y la lista de productos seleccionados. siempre llama la función cuando el cliente confirme la orden, antes de pagar",
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
    },
    {
      "name": "saveDataPayment",
      "description": "Guarda la información del pago del cliente",
      "parameters": {
        "type": "object",
        "properties": {
          "payType": { "type": "string", "enum": ["efectivo", "pago movil", "transferencia bancaria", "binace", "zelle"] },
          "voucher": {
            "type": "string",
            "description": "texto comprobante de pago",
          }

        },
        "required": ["payType"],
      }
    }
  ],
  function_call: "auto",


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
    }, _ => { }, prompt, "32");
    console.log();
  }
}

main();
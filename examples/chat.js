import { ChatGPT } from "../dist/index.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bot = new ChatGPT("", {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 256, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: `You are a virtual assistant of the Development Finance Corporation which is the only Development Bank of Belize. you work Your job is to support: MARY JANE IS A 30 YEARS OLD HOME OWNER WITH $112,000 LOAN FOR 20 YEARS. THE INTEREST RATE IS 7.5%. SHE IS IN THE 72 MONTH YEAR OF HER LOAN. HER ANNUAL INCOME IS $ 30,000
  HIS LOAN STARTED ON JULY 1ST 2015.
  HIS DUE DATE FOR PAYMENT IS THE 1ST DAY OF EACH MONTH.
  PHONE: + 5016105615
  This beautiful 3-bedroom, 1 bath Concrete Starter-Home measures 31.6 ft. by 23.6 ft. (746 Sq. Ft.) it is with Timber and Zinc Roofing and the base can be Strip or Pile Footing Foundation enabling construction in soft ground areas of Belize. It has a spacious open Living, Dining, and Kitchen open-floor concept. Each room comes with storage closet spaces and 2 porch areas that step up into the home which is elevated off the ground.
  LOAN CONDITIONS
  For all Belizeans and Residents.
  For Home Construction, Home Purchase, Land Purchase, Home Improvement, and Expansion.
  Get More! – Eligible for up to 45% of your income
  As low as 7.5% PLUS Interest is on reducing balance for the life of the loan.
  FREE Property Valuation! (Saves you $1000+)
  Up to 20 Years Loan Repayment Term
  Affordable 2 & 3 bedroom building plans
  Here's a breakdown of the payment run:
  Loan amount: $112,000
  Interest rate: 7.5% per year
  Loan term: 20 years (240 months)
  After performing the calculation, the monthly payment for a $112,000 loan with a 7.5% interest rate over 20 years (240 months) is approximately $884.18.
  Here's a breakdown of the payment schedule:
      
  Month1 Payment $877.75 from which $359.14 is principal and $518.61 is interest, the remaining balance is $111,640.86
  Month 2	Payment	$877.75	from which $360.06	is principal and 	$517.69	is interest, the remaining balance is 	$111,280.80
  Month 3	Payment	$877.75	from which 	$360.99	is principal and 	$516.76	is interest, the remaining balance is 	$110,919.81
  Month 4Payment	$877.75	from which 	$361.91	is principal and 	$515.84	is interest, the remaining balance is 	$110,557.90
  Month	5	Payment	$877.75	from which 	$362.84	is principal and 	$514.91	is interest, the remaining balance is 	$110,195.06
  Month	6	Payment	$877.75	from which 	$363.76	is principal and 	$513.99	is interest, the remaining balance is 	$109,831.30
  Month	7 Payment	$877.75	from which 	$364.69	is principal and 	$513.06	is interest, the remaining balance is 	$109,466.61
  Month	8 Payment	$877.75	from which 	$365.61	is principal and 	$512.14	is interest, the remaining balance is 	$109,101.00
  Month	9	Payment	$877.75	from which 	$366.54	is principal and 	$511.21	is interest, the remaining balance is 	$108,734.46
  Month	10	Payment	$877.75	from which 	$367.47	is principal and 	$510.28	is interest, the remaining balance is 	$108,366.99
  Month	11	Payment	$877.75	from which 	$368.40	is principal and 	$509.35	is interest, the remaining balance is 	$107,998.59
  Month	12	Payment	$877.75	from which 	$369.33	is principal and 	$508.42	is interest, the remaining balance is 	$107,629.26
  Month	13	Payment	$877.75	from which 	$370.26	is principal and 	$507.49	is interest, the remaining balance is 	$107,258.00
  Month	14	Payment	$877.75	from which 	$371.20	is principal and 	$506.55	is interest, the remaining balance is 	$106,886.80
  Month	15	Payment	$877.75	from which 	$372.13	is principal and 	$505.62	is interest, the remaining balance is 	$106,513.67
  Month	16	Payment	$877.75	from which 	$373.07	is principal and 	$504.68	is interest, the remaining balance is 	$106,139.60
  Month	17	Payment	$877.75	from which 	$374.00	is principal and 	$503.75	is interest, the remaining balance is 	$105,764.60
  Month	18	Payment	$877.75	from which 	$374.94	is principal and 	$502.81	is interest, the remaining balance is 	$105,388.66
  Month	19	Payment	$877.75	from which 	$375.88	is principal and 	$501.87	is interest, the remaining balance is 	$105,011.78
  Month	20	Payment	$877.75	from which 	$376.82	is principal and 	$500.93	is interest, the remaining balance is 	$104,633.96
  Month	21	Payment	$877.75	from which 	$377.76	is principal and 	$499.99	is interest, the remaining balance is 	$104,255.20
  Month	22	Payment	$877.75	from which 	$378.71	is principal and 	$499.04	is interest, the remaining balance is 	$103,875.49
  Month	23	Payment	$877.75	from which 	$379.65	is principal and 	$498.10	is interest, the remaining balance is 	$103,494.84
  Month	24	Payment	$877.75	from which 	$380.60	is principal and 	$497.15	is interest, the remaining balance is 	$103,113.24`,
  model: "gpt-3.5-turbo-16k", // OpenAI parameter  `gpt-3.5-turbo` is PAID
  // functions: [
  //   {
  //     "name": "saveDataUser",
  //     "description": "Guardar los datos del usuario para solicitar un prueba de manejo",
  //     "parameters": {
  //       "type": "object",
  //       "properties": {
  //         "name": {
  //           "type": "string",
  //           "description": "Nombre del usuario",
  //         },
  //         "email": {
  //           "type": "string",
  //           "description": "Correo del usuario",
  //         },
  //         "phone": {
  //           "type": "string",
  //           "description": "Telefono del usuario",
  //         }
  //       },
  //       "required": ["name", "email", "phone"],
  //     },
  //   }
  // ],
  // function_call: "auto",


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
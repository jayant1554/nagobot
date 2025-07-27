import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const groqApiKey = Deno.env.get('GROQ_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Extract price from text (supporting both $ and ₹) - improved logic from Streamlit
function extractPriceFromText(text: string): number | null {
  // First try to match ₹ prices (3-5 digits as in Streamlit)
  const rupeeMatch = text.match(/₹\s?(\d{3,5})/);
  if (rupeeMatch) {
    return parseInt(rupeeMatch[1]);
  }
  
  // Fallback to $ prices with decimal support
  const dollarMatch = text.match(/\$\s?(\d+(?:\.\d{2})?)/);
  if (dollarMatch) {
    return parseFloat(dollarMatch[1]);
  }
  
  return null;
}

// Check if user agreed - enhanced logic from Streamlit
function userAgreed(userInput: string): boolean {
  const keywords = ["deal", "i agree", "okay", "ok", "done", "confirm", "sure", "accept", "yes"];
  return keywords.some(keyword => userInput.toLowerCase().includes(keyword));
}

// Check if user is asking for a discount
function isAskingForDiscount(userInput: string): boolean {
  const discountKeywords = [
    "discount", "cheaper", "lower price", "best price", "deal", 
    "reduce", "less", "better offer", "negotiate", "can you do better",
    "what's your best", "lowest", "bargain"
  ];
  return discountKeywords.some(keyword => userInput.toLowerCase().includes(keyword));
}

// Calculate appropriate offer based on negotiation round
function calculateOffer(originalPrice: number, minPrice: number, negotiationRound: number, userOfferedPrice?: number): number {
  // If user offered a specific price, try to meet somewhere in the middle
  if (userOfferedPrice && userOfferedPrice >= minPrice) {
    return Math.max(userOfferedPrice, minPrice);
  }
  
  // Progressive discount strategy
  let discountPercentage: number;
  switch (negotiationRound) {
    case 1: // First discount: 5-8%
      discountPercentage = 0.07;
      break;
    case 2: // Second discount: 10-12%
      discountPercentage = 0.11;
      break;
    case 3: // Third discount: 15-18%
      discountPercentage = 0.16;
      break;
    default: // Final discounts: closer to minimum
      discountPercentage = 0.20;
      break;
  }
  
  const calculatedPrice = originalPrice * (1 - discountPercentage);
  return Math.max(calculatedPrice, minPrice);
}

// Generate LLM response using Groq
async function generateLlmResponse(
  userInput: string,
  productName: string,
  originalPrice: number,
  minPrice: number,
  inventory: number,
  lastOffer: number | null,
  negotiationRound: number
): Promise<string> {
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const isFirstMessage = !lastOffer;
  const askingForDiscount = isAskingForDiscount(userInput);
  
  // Extract user's offered price if any
  const userOfferedPrice = extractPriceFromText(userInput);
  
  let shouldOfferPrice = false;
  let suggestedPrice = originalPrice;
  
  if (isFirstMessage && !askingForDiscount) {
    // First message and not asking for discount - just introduce the product
    shouldOfferPrice = false;
  } else if (askingForDiscount || userOfferedPrice) {
    // User is asking for discount or made an offer
    shouldOfferPrice = true;
    suggestedPrice = calculateOffer(originalPrice, minPrice, negotiationRound, userOfferedPrice || undefined);
  } else if (lastOffer) {
    // Continue with last offer
    shouldOfferPrice = true;
    suggestedPrice = lastOffer;
  }

  const lastOfferNote = lastOffer ? `\nYou previously offered $${lastOffer}.\n` : "";
  const priceInstruction = shouldOfferPrice 
    ? `You should offer a price of $${suggestedPrice.toFixed(2)} in your response.`
    : `Do NOT offer any discount or mention pricing unless the customer specifically asks for a better price.`;

  const prompt = `
You are a polite and persuasive chatbot for an eCommerce platform helping users negotiate product prices.

Product: ${productName}
Original Price: $${originalPrice}
Inventory left: ${inventory}
${lastOfferNote}

Customer said: "${userInput}"

${priceInstruction}

Rules:
1. Do NOT mention or reveal the minimum price of $${minPrice}.
2. Start with the original price of $${originalPrice} and only offer discounts when asked.
3. Always try to earn the customer's trust and provide a friendly experience.
4. BE polite and professional and try to earn the customer's trust.
5. Try to earn maximum profit for the company.
6. Do NOT go below $${minPrice} under any circumstance.
7. Don't mention the minimum price.
8. Don't increase the price once you have given it.
9. If the customer has agreed (e.g., "ok", "deal", "I agree"), respond warmly and stop negotiating.
10. If the user's offered price is higher than the min price, accept it without further discounting.
11. Be professional and ensure the tone remains helpful and sales-friendly.
12. Always thank the customer for their interest.
13. ${shouldOfferPrice ? `Include the price $${suggestedPrice.toFixed(2)} in your response.` : 'Focus on product features and benefits, not pricing.'}

Reply appropriately based on the customer's message.
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-saba-24b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, negotiationId, productId } = await req.json();

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Product not found');
    }

    // Get negotiation details
    const { data: negotiation, error: negotiationError } = await supabase
      .from('negotiations')
      .select('*')
      .eq('id', negotiationId)
      .single();

    if (negotiationError || !negotiation) {
      throw new Error('Negotiation not found');
    }

    // Check if user agreed to the last offer
    if (userAgreed(userMessage) && negotiation.current_offer) {
      // Generate order ID
      const orderId = crypto.randomUUID().slice(0, 8);
      
      // Update negotiation as accepted
      await supabase
        .from('negotiations')
        .update({ 
          status: 'accepted',
          final_price: negotiation.current_offer
        })
        .eq('id', negotiationId);

      const confirmMessage = `✅ Your order for **${product.name}** has been confirmed!\n💰 Final Price: $${negotiation.current_offer.toFixed(2)}\n🧾 Order ID: \`${orderId}\`\n\nThank you for your business!`;
      
      return new Response(JSON.stringify({ 
        message: confirmMessage,
        accepted: true,
        finalPrice: negotiation.current_offer,
        orderId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Count negotiation rounds (count previous chat messages from user)
    const { data: chatHistory, error: chatError } = await supabase
      .from('chat_messages')
      .select('sender')
      .eq('negotiation_id', negotiationId)
      .eq('sender', 'user')
      .order('created_at', { ascending: true });

    const negotiationRound = (chatHistory?.length || 0) + 1;

    // Generate LLM response
    const botResponse = await generateLlmResponse(
      userMessage,
      product.name,
      product.base_price,
      product.min_price,
      product.stock || 10,
      negotiation.current_offer,
      negotiationRound
    );

    // Extract price from bot response
    const offeredPrice = extractPriceFromText(botResponse);
    
    // Make sure the offered price doesn't go below minimum
    const finalOfferedPrice = offeredPrice && offeredPrice >= product.min_price 
      ? offeredPrice 
      : product.min_price;

    return new Response(JSON.stringify({ 
      message: botResponse,
      offerAmount: finalOfferedPrice,
      accepted: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in negotiate-price function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm having trouble processing your request right now. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
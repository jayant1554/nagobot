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

// Extract price from text - enhanced to catch more formats
function extractPriceFromText(text: string): number | null {
  console.log('Extracting price from text:', text);
  
  // Try various price patterns
  const patterns = [
    /\$\s?(\d+(?:\.\d{2})?)/,           // $100 or $100.50
    /₹\s?(\d{3,5})/,                    // ₹1000
    /(\d+(?:\.\d{2})?)\s*(?:dollars?|bucks?)/i,  // 100 dollars
    /can\s+u\s+do\s+\$?(\d+)/i,        // "can u do $600"
    /how\s+about\s+\$?(\d+)/i,         // "how about $500"
    /(\d+)\s*(?:is\s+my\s+budget|budget)/i  // "500 is my budget"
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const price = parseFloat(match[1]);
      console.log('Found price:', price);
      return price;
    }
  }
  
  console.log('No price found in text');
  return null;
}

// Check if user agreed - enhanced logic but more specific
function userAgreed(userInput: string): boolean {
  const input = userInput.toLowerCase().trim();
  
  // Only consider these as agreement if they're not part of a negotiation
  const exactAgreements = ["deal", "i agree", "okay deal", "ok deal", "done", "confirm", "accept", "yes deal"];
  
  // Don't treat questions or offers as agreements
  if (input.includes('?') || input.includes('can you') || input.includes('how about') || 
      input.includes('what if') || input.includes('$') || input.includes('price')) {
    return false;
  }
  
  return exactAgreements.some(keyword => input.includes(keyword));
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

// Calculate appropriate offer based on negotiation round and current offer
function calculateOffer(originalPrice: number, minPrice: number, negotiationRound: number, currentOffer: number | null, userOfferedPrice?: number): number {
  console.log('calculateOffer inputs:', { originalPrice, minPrice, negotiationRound, currentOffer, userOfferedPrice });
  
  // Start with a baseline - if no current offer, start with a discount from original
  let basePrice = currentOffer;
  if (!basePrice) {
    // First offer should be discounted from original price (10-15% discount)
    basePrice = originalPrice * 0.85; // Start with 15% discount
  }
  
  // If user offered a specific price, counter with something between their offer and current price
  if (userOfferedPrice && userOfferedPrice >= minPrice) {
    if (userOfferedPrice >= basePrice) {
      // User offered more than our current offer - accept it!
      const finalPrice = Math.max(userOfferedPrice, minPrice);
      console.log('User offered higher price, accepting:', finalPrice);
      return Math.round(finalPrice * 100) / 100;
    } else {
      // User offered less - counter with something between their offer and our current price
      const gap = basePrice - userOfferedPrice;
      const counterOffer = Math.max(
        minPrice,
        userOfferedPrice + (gap * 0.3) // Meet them 70% of the way
      );
      console.log('Countering user offer:', counterOffer);
      return Math.round(counterOffer * 100) / 100;
    }
  }
  
  // Progressive discount strategy for general negotiations
  let discountPercentage: number;
  switch (negotiationRound) {
    case 1: // First interaction - 10-15% discount from original
      discountPercentage = 0.12;
      basePrice = originalPrice;
      break;
    case 2: // Second round - additional 3-5% discount
      discountPercentage = 0.04;
      break;
    case 3: // Third round - additional 2-3% discount
      discountPercentage = 0.025;
      break;
    default: // Final rounds - small 1-2% discounts
      discountPercentage = 0.015;
      break;
  }
  
  const discountedPrice = basePrice * (1 - discountPercentage);
  const finalPrice = Math.max(discountedPrice, minPrice);
  
  console.log('Calculated offer:', finalPrice);
  return Math.round(finalPrice * 100) / 100;
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

  const isFirstMessage = negotiationRound === 1;
  const askingForDiscount = isAskingForDiscount(userInput);
  
  // Extract user's offered price if any
  const userOfferedPrice = extractPriceFromText(userInput);
  console.log('User offered price:', userOfferedPrice);
  
  let shouldOfferPrice = false;
  let suggestedPrice = originalPrice;
  
  // ALWAYS offer a counter-price if user makes an offer or asks for pricing
  if (userOfferedPrice || askingForDiscount || 
      userInput.toLowerCase().includes('price') || 
      userInput.toLowerCase().includes('cost') ||
      userInput.toLowerCase().includes('buy') ||
      userInput.toLowerCase().includes('purchase') ||
      userInput.toLowerCase().includes('deal')) {
    shouldOfferPrice = true;
    suggestedPrice = calculateOffer(originalPrice, minPrice, negotiationRound, lastOffer, userOfferedPrice || undefined);
    console.log('Will offer price:', suggestedPrice);
  } else {
    // For general inquiries, still be helpful but don't offer discounts immediately
    shouldOfferPrice = false;
    console.log('Not offering price for general inquiry');
  }

  const lastOfferNote = lastOffer ? `\nYou previously offered $${lastOffer}.\n` : "";
  const priceInstruction = shouldOfferPrice 
    ? `You should offer a price of $${suggestedPrice.toFixed(2)} in your response.`
    : `Be helpful about the product features. Only mention pricing if the customer specifically asks about deals or pricing.`;

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
      model: 'llama3-8b-8192',
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
    console.log('Processing negotiation request:', { userMessage, negotiationId, productId });

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
    console.log('Checking if user agreed. Message:', userMessage);
    console.log('Current offer:', negotiation.current_offer);
    
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
    console.log('Fetching chat history for negotiation:', negotiationId);
    const { data: chatHistory, error: chatError } = await supabase
      .from('chat_messages')
      .select('sender')
      .eq('negotiation_id', negotiationId)
      .eq('sender', 'user')
      .order('created_at', { ascending: true });

    if (chatError) {
      console.error('Error fetching chat history:', chatError);
    }

    const negotiationRound = chatError ? 1 : (chatHistory?.length || 0) + 1;
    console.log('Negotiation round:', negotiationRound);

    // Generate LLM response
    console.log('Generating LLM response with params:', {
      userMessage,
      productName: product.name,
      basePrice: product.base_price,
      minPrice: product.min_price,
      stock: product.stock,
      currentOffer: negotiation.current_offer,
      negotiationRound
    });
    
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
    console.log('Bot response:', botResponse);
    console.log('Extracted price from bot response:', offeredPrice);
    
    // Validate the offered price and ensure it follows our rules
    let finalOfferedPrice = null;
    if (offeredPrice && offeredPrice >= product.min_price) {
      finalOfferedPrice = Math.max(offeredPrice, product.min_price);
      // Round to 2 decimal places
      finalOfferedPrice = Math.round(finalOfferedPrice * 100) / 100;
      console.log('Final offered price after validation:', finalOfferedPrice);
    } else {
      console.log('No valid price found in bot response, price was:', offeredPrice);
    }

    // Update negotiation current_offer if we have a new offer
    if (finalOfferedPrice && finalOfferedPrice !== negotiation.current_offer) {
      await supabase
        .from('negotiations')
        .update({ current_offer: finalOfferedPrice })
        .eq('id', negotiationId);
    }

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
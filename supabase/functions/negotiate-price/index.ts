import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const groqApiKey = Deno.env.get('GROQ_API_KEY');

if (!supabaseUrl || !supabaseServiceKey || !groqApiKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// -------------------- Helper Functions --------------------

// Extract price mentioned in user text
function extractPriceFromText(text) {
  const patterns = [
    /(?:offer|can do|price of|give you)\s*\$(\d+(?:\.\d{2})?)/i,
    /(?:special deal|discount price|final price)\s*:?\s*\$(\d+(?:\.\d{2})?)/i,
    /(?:just|only)\s*\$(\d+(?:\.\d{2})?)/i,
    /\$(\d+(?:\.\d{2})?)\s*(?:for you|today|special)/i,
    /(?:reduce to|bring it down to|make it)\s*\$(\d+(?:\.\d{2})?)/i,
    /(\d+)\s*(?:bucks|usd|dollars?)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

// Detect user agreement
function userAgreed(userInput) {
  const input = userInput.toLowerCase().trim();
  const exactAgreements = [
    "deal", "i agree", "okay deal", "ok deal", "done",
    "confirm", "accept", "yes deal", "agreed", "sounds good",
    "i'll take it", "perfect", "let's do it", "works for me",
    "that's fine", "okay then", "alright"
  ];
  const agreementWithPrice = /(?:yes|ok|deal|agree|works).*(?:\$\d+|\d+\s*dollars?|\d+\s*bucks)/i;
  if (agreementWithPrice.test(input)) return true;
  if (input.includes('?')) return false;
  return exactAgreements.some(keyword => input.includes(keyword));
}

// Detect discount intent
function isAskingForDiscount(userInput) {
  const discountKeywords = [
    "discount", "cheaper", "lower price", "best price", "deal",
    "reduce", "less", "better offer", "negotiate", "can you do better",
    "what's your best", "lowest", "bargain", "can u do"
  ];
  return discountKeywords.some(keyword => userInput.toLowerCase().includes(keyword));
}

// Detect greetings / general questions
function isGreetingOrGeneralQuestion(userInput) {
  const input = userInput.toLowerCase().trim();
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "what's up", "howdy", "greetings", "sup"];
  const generalQuestions = [
    "what is this", "tell me about", "what does it do", "how does it work",
    "what are the features", "specifications", "specs", "details", "info",
    "about this product", "description", "what's included", "warranty",
    "shipping", "delivery", "colors available", "size", "weight"
  ];
  if (greetings.some(greeting => input === greeting || input.startsWith(greeting))) return true;
  if (generalQuestions.some(question => input.includes(question))) return true;
  if (input.length <= 10 && !input.includes('price') && !input.includes('cost') && !input.includes('buy')) return true;
  return false;
}

// -------------------- PROFIT-Optimized Offer --------------------
function calculateOffer(originalPrice, minPrice, negotiationRound, currentOffer, userOfferedPrice, inventory) {
  console.log('calculateOffer inputs:', {
    originalPrice, minPrice, negotiationRound, currentOffer, userOfferedPrice, inventory
  });

  // Handle explicit user offer
  if (userOfferedPrice && userOfferedPrice >= minPrice) {
    const currentPrice = currentOffer || originalPrice;
    if (userOfferedPrice >= currentPrice * 0.9) {
      return Math.max(userOfferedPrice, minPrice); // Accept close-enough offers
    } else {
      const gap = currentPrice - userOfferedPrice;
      const counterOffer = Math.max(minPrice, userOfferedPrice + gap * 0.5);
      return Math.round(counterOffer * 100) / 100;
    }
  }

  // Progressive discounting
  let discountPercentage = 0;
  let basePrice = currentOffer || originalPrice;

  if (inventory <= 5) {
    discountPercentage = 0.01; // Very little discount if stock is scarce
  } else if (inventory > 50) {
    discountPercentage = 0.05; // More aggressive if stock is high
  } else {
    switch (negotiationRound) {
      case 1:
        discountPercentage = 0.00; // No discount first round
        basePrice = originalPrice;
        break;
      case 2:
        discountPercentage = 0.03;
        break;
      case 3:
        discountPercentage = 0.025;
        break;
      default:
        discountPercentage = 0.02;
        break;
    }
  }

  const discountedPrice = basePrice * (1 - discountPercentage);
  const finalPrice = Math.max(discountedPrice, minPrice);
  return Math.round(finalPrice * 100) / 100;
}

// -------------------- LLM Response Generator --------------------
async function generateLlmResponse(userInput, productName, originalPrice, minPrice, inventory, lastOffer, negotiationRound, calculatedPrice = null) {
  const isGreeting = isGreetingOrGeneralQuestion(userInput);
  const userOfferedPrice = extractUserOffer(userInput);
  let shouldOfferPrice = false;
  let offerPrice = originalPrice;

  if (!isGreeting && (
      userOfferedPrice ||
      isAskingForDiscount(userInput) ||
      userInput.toLowerCase().includes('buy') ||
      userInput.toLowerCase().includes('purchase') ||
      userInput.toLowerCase().includes('how much') ||
      userInput.toLowerCase().includes('what does it cost') ||
      userInput.toLowerCase().includes('price') ||
      userInput.toLowerCase().includes('deal')
    )) {
    shouldOfferPrice = true;
    offerPrice = calculatedPrice || calculateOffer(originalPrice, minPrice, negotiationRound, lastOffer, userOfferedPrice, inventory);
  }

  const lastOfferNote = lastOffer ? `Your previous offer was $${lastOffer}.` : "";

  const prompt = `You are a professional sales negotiator for an eCommerce platform.

Product: ${productName}
Original Price: $${originalPrice}
Inventory: ${inventory} units
${lastOfferNote}

Customer message: "${userInput}"

RULES:
${shouldOfferPrice ? 
  `- Always mention the original price ($${originalPrice}) FIRST, then your special offer.
   - You MUST offer exactly $${offerPrice.toFixed(2)} in your response.
   - Example phrasing: "This usually goes for $${originalPrice}, but I can offer it to you today for $${offerPrice.toFixed(2)}."
   - Be persuasive: focus on value, features, and urgency (if stock is low).
   - Do not mention the minimum price.` :
  `- Do NOT offer discounts yet.
   - If asked about price, mention the original price: $${originalPrice}.
   - Be friendly, highlight features and benefits, answer questions.
   - Avoid revealing negotiation strategy or min price.`}

Keep the response under 150 words, professional but warm. Use emojis sparingly.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Extract numeric offers from user text
function extractUserOffer(userInput) {
  const patterns = [
    /(?:can u do|can you do|how about|what about)\s*\$?(\d+(?:\.\d{2})?)/i,
    /(?:i can do|my budget is|i have)\s*\$?(\d+(?:\.\d{2})?)/i,
    /\$(\d+(?:\.\d{2})?)\s*(?:is my max|is all i have|budget)/i,
    /(\d+)\s*(?:bucks|usd|dollars?)/i
  ];
  for (const pattern of patterns) {
    const match = userInput.match(pattern);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

// -------------------- Main Handler --------------------
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { userMessage, negotiationId, productId } = await req.json();
    if (!userMessage || !negotiationId || !productId) throw new Error('Missing required parameters');

    const [productResult, negotiationResult] = await Promise.all([
      supabase.from('products').select('*').eq('id', productId).single(),
      supabase.from('negotiations').select('*').eq('id', negotiationId).single()
    ]);

    if (productResult.error || !productResult.data) throw new Error('Product not found');
    if (negotiationResult.error || !negotiationResult.data) throw new Error('Negotiation not found');

    const product = productResult.data;
    const negotiation = negotiationResult.data;

    // Agreement check
    if (userAgreed(userMessage) && negotiation.current_offer) {
      const orderId = crypto.randomUUID().slice(0, 8);
      await supabase.from('negotiations').update({
        status: 'accepted',
        final_price: negotiation.current_offer
      }).eq('id', negotiationId);
      await supabase.from('chat_messages').insert({ negotiation_id: negotiationId, sender: 'user', message: userMessage });
      const confirmMessage = `🎉 Excellent! Your order for **${product.name}** is confirmed!\n\n💰 Final Price: $${negotiation.current_offer.toFixed(2)}\n🆔 Order ID: \`${orderId}\`\n\nThank you for choosing our platform!`;
      return new Response(JSON.stringify({ message: confirmMessage, accepted: true, finalPrice: negotiation.current_offer, orderId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Count rounds (user messages)
    const { data: chatHistory } = await supabase.from('chat_messages')
      .select('sender').eq('negotiation_id', negotiationId).eq('sender', 'user').order('created_at', { ascending: true });
    const negotiationRound = (chatHistory?.length || 0) + 1;

    // Should we make an offer?
    const isGreeting = isGreetingOrGeneralQuestion(userMessage);
    const shouldMakeOffer = !isGreeting && (
      isAskingForDiscount(userMessage) ||
      userMessage.toLowerCase().includes('buy') ||
      userMessage.toLowerCase().includes('purchase') ||
      userMessage.toLowerCase().includes('how much') ||
      userMessage.toLowerCase().includes('what does it cost') ||
      userMessage.toLowerCase().includes('price') ||
      userMessage.toLowerCase().includes('deal') ||
      extractUserOffer(userMessage) !== null
    );

    let calculatedOffer = null;
    if (shouldMakeOffer) {
      const userOffer = extractUserOffer(userMessage);
      calculatedOffer = calculateOffer(product.base_price, product.min_price, negotiationRound, negotiation.current_offer, userOffer, product.stock || 10);
    }

    const botResponse = await generateLlmResponse(userMessage, product.name, product.base_price, product.min_price, product.stock || 10, negotiation.current_offer, negotiationRound, calculatedOffer);

    let finalOfferedPrice = null;
    if (calculatedOffer && calculatedOffer >= product.min_price) {
      finalOfferedPrice = calculatedOffer;
      await supabase.from('negotiations').update({ current_offer: finalOfferedPrice }).eq('id', negotiationId);
    }

    await Promise.all([
      supabase.from('chat_messages').insert({ negotiation_id: negotiationId, sender: 'user', message: userMessage }),
      supabase.from('chat_messages').insert({ negotiation_id: negotiationId, sender: 'bot', message: botResponse })
    ]);

    return new Response(JSON.stringify({ message: botResponse, offerAmount: finalOfferedPrice, accepted: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in negotiate-price function:', error);
    return new Response(JSON.stringify({ error: error.message, message: "I'm having trouble processing your request. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'GET') {
    // WhatsApp webhook verification
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    
    if (mode === 'subscribe' && token === 'makola_verify_token') {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('WhatsApp webhook payload:', JSON.stringify(body, null, 2));

      // Process incoming messages
      if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
        const messages = body.entry[0].changes[0].value.messages;
        const contacts = body.entry[0].changes[0].value.contacts || [];
        
        for (const message of messages) {
          await processMessage(message, contacts[0]);
        }
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('Error', { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
});

async function processMessage(message: any, contact: any) {
  const whatsappNumber = message.from;
  const messageText = message.text?.body || '';
  const messageType = message.type;

  // Get or create session
  let { data: session } = await supabase
    .from('whatsapp_sessions')
    .select('*')
    .eq('whatsapp_number', whatsappNumber)
    .single();

  if (!session) {
    // Create new session
    const { data: newSession } = await supabase
      .from('whatsapp_sessions')
      .insert({ whatsapp_number: whatsappNumber })
      .select()
      .single();
    session = newSession;
  }

  // Update last activity
  await supabase
    .from('whatsapp_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('id', session.id);

  // Route message based on content
  if (messageText.toLowerCase().includes('sell') || messageText.toLowerCase().includes('product')) {
    await handleProductUpload(message, session);
  } else if (messageText.toLowerCase().includes('job') || messageText.toLowerCase().includes('delivery')) {
    await handleRiderCommand(message, session);
  } else {
    await sendWelcomeMessage(whatsappNumber);
  }
}

async function handleProductUpload(message: any, session: any) {
  const whatsappNumber = message.from;
  const messageText = message.text?.body || '';
  const images = message.image ? [message.image.id] : [];

  // Find seller by WhatsApp number
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('whatsapp', whatsappNumber)
    .single();

  if (!seller) {
    await sendMessage(whatsappNumber, 
      "❌ You need to register as a seller first. Visit our website to create an account.");
    return;
  }

  // Parse product details from message
  const parsed = parseProductMessage(messageText);

  // Create upload record
  const { error } = await supabase
    .from('whatsapp_uploads')
    .insert({
      seller_id: seller.id,
      whatsapp_number: whatsappNumber,
      message_text: messageText,
      images: images,
      parsed_title: parsed.title,
      parsed_price: parsed.price,
      parsed_description: parsed.description,
      parsed_category: parsed.category
    });

  if (error) {
    console.error('Failed to create upload:', error);
    await sendMessage(whatsappNumber, "❌ Failed to process your product. Please try again.");
    return;
  }

  await sendMessage(whatsappNumber, 
    `✅ Product received! 
📝 Title: ${parsed.title || 'Not specified'}
💰 Price: ${parsed.price ? `GHS ${parsed.price}` : 'Not specified'}
📋 Description: ${parsed.description || 'Not specified'}

Your product will be reviewed and published shortly. You can manage it from your seller dashboard.`);
}

async function handleRiderCommand(message: any, session: any) {
  const whatsappNumber = message.from;
  const messageText = message.text?.body || '';

  // Find rider by WhatsApp number
  const { data: rider } = await supabase
    .from('riders')
    .select('*')
    .eq('whatsapp', whatsappNumber)
    .single();

  if (!rider) {
    await sendMessage(whatsappNumber, 
      "❌ You need to register as a rider first. Visit our website to create an account.");
    return;
  }

  // Parse command
  const command = messageText.toLowerCase().trim();

  if (command.includes('jobs') || command.includes('available')) {
    await sendAvailableJobs(whatsappNumber, rider.id);
  } else if (command.includes('accept')) {
    const jobId = extractJobId(messageText);
    if (jobId) {
      await acceptJob(whatsappNumber, rider.id, jobId);
    } else {
      await sendMessage(whatsappNumber, "❌ Please specify job ID: 'accept job123'");
    }
  } else if (command.includes('status')) {
    await sendRiderStatus(whatsappNumber, rider.id);
  } else {
    await sendRiderHelp(whatsappNumber);
  }
}

function parseProductMessage(text: string) {
  const lines = text.split('\n').map(line => line.trim());
  let title = '';
  let price = 0;
  let description = '';
  let category = 'General';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('title:') || lower.includes('name:')) {
      title = line.split(':')[1]?.trim() || '';
    } else if (lower.includes('price:') || lower.includes('cost:')) {
      const priceMatch = line.match(/(\d+(?:\.\d{2})?)/);
      price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    } else if (lower.includes('description:') || lower.includes('details:')) {
      description = line.split(':')[1]?.trim() || '';
    } else if (lower.includes('category:')) {
      category = line.split(':')[1]?.trim() || 'General';
    }
  }

  // If no structured format, try to extract from free text
  if (!title && !price) {
    title = lines[0] || 'Untitled Product';
    const priceMatch = text.match(/(?:ghs?|₵)\s*(\d+(?:\.\d{2})?)/i);
    price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    description = lines.slice(1).join(' ').substring(0, 500);
  }

  return { title, price, description, category };
}

function extractJobId(text: string): string | null {
  const match = text.match(/job\s*([a-f0-9-]+)/i);
  return match ? match[1] : null;
}

async function sendAvailableJobs(whatsappNumber: string, riderId: string) {
  const { data: jobs } = await supabase
    .from('delivery_jobs')
    .select('*')
    .eq('status', 'requested')
    .is('rider_id', null)
    .limit(5);

  if (!jobs || jobs.length === 0) {
    await sendMessage(whatsappNumber, "📦 No jobs available right now. Check back later!");
    return;
  }

  let message = "📦 *Available Jobs:*\n\n";
  for (const job of jobs) {
    message += `🆔 Job: ${job.id.substring(0, 8)}\n`;
    message += `📍 Pickup: ${job.pickup_location}\n`;
    message += `🎯 Dropoff: ${job.dropoff_location}\n`;
    message += `💰 Fee: GHS ${job.quoted_fee}\n`;
    message += `⏰ ${new Date(job.created_at).toLocaleString()}\n\n`;
  }
  
  message += "To accept a job, reply: *accept job[ID]*\nExample: accept job12345678";
  
  await sendMessage(whatsappNumber, message);
}

async function acceptJob(whatsappNumber: string, riderId: string, jobId: string) {
  const { data: job, error } = await supabase
    .from('delivery_jobs')
    .update({
      rider_id: riderId,
      status: 'accepted',
      accepted_at: new Date().toISOString()
    })
    .eq('id', jobId)
    .eq('status', 'requested')
    .select()
    .single();

  if (error || !job) {
    await sendMessage(whatsappNumber, "❌ Job not available or already taken.");
    return;
  }

  await sendMessage(whatsappNumber, 
    `✅ Job accepted! 🎉
    
📦 Job: ${job.id.substring(0, 8)}
📍 Pickup: ${job.pickup_location}
🎯 Dropoff: ${job.dropoff_location}
💰 Fee: GHS ${job.quoted_fee}

Next steps:
1. Contact seller for pickup details
2. Reply 'picked up job${job.id.substring(0, 8)}' when collected
3. Reply 'delivered job${job.id.substring(0, 8)}' when delivered`);
}

async function sendRiderStatus(whatsappNumber: string, riderId: string) {
  const { data: activeJobs } = await supabase
    .from('delivery_jobs')
    .select('*')
    .eq('rider_id', riderId)
    .in('status', ['accepted', 'picked_up']);

  if (!activeJobs || activeJobs.length === 0) {
    await sendMessage(whatsappNumber, "📊 No active jobs. Reply 'jobs' to see available deliveries.");
    return;
  }

  let message = "📊 *Your Active Jobs:*\n\n";
  for (const job of activeJobs) {
    message += `🆔 Job: ${job.id.substring(0, 8)}\n`;
    message += `📍 ${job.pickup_location} → ${job.dropoff_location}\n`;
    message += `💰 GHS ${job.quoted_fee}\n`;
    message += `📋 Status: ${job.status.toUpperCase()}\n\n`;
  }
  
  await sendMessage(whatsappNumber, message);
}

async function sendRiderHelp(whatsappNumber: string) {
  const message = `🚴 *Rider Commands:*

📦 *jobs* - View available deliveries
📊 *status* - Check your active jobs  
✅ *accept job[ID]* - Accept a delivery
📦 *picked up job[ID]* - Mark as picked up
🎯 *delivered job[ID]* - Mark as delivered

Example: accept job12345678`;
  
  await sendMessage(whatsappNumber, message);
}

async function sendWelcomeMessage(whatsappNumber: string) {
  const message = `👋 Welcome to Makola Online!

🛍️ *For Sellers:* Send product photos with details to list items
🚴 *For Riders:* Reply 'jobs' to see available deliveries
📱 Visit our website to create an account

How can I help you today?`;
  
  await sendMessage(whatsappNumber, message);
}

async function sendMessage(to: string, text: string) {
  // This would integrate with WhatsApp Business API
  // For now, we'll log the message
  console.log(`Sending to ${to}: ${text}`);
  
  // In production, you would make an API call to WhatsApp Business API
  // const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     messaging_product: 'whatsapp',
  //     to: to,
  //     text: { body: text }
  //   })
  // });
}
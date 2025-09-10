-- WhatsApp product uploads table
CREATE TABLE IF NOT EXISTS whatsapp_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  whatsapp_number VARCHAR(20) NOT NULL,
  message_text TEXT,
  images TEXT[] DEFAULT '{}',
  parsed_title VARCHAR(255),
  parsed_price DECIMAL(10,2),
  parsed_description TEXT,
  parsed_category VARCHAR(100) DEFAULT 'General',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp rider commands table
CREATE TABLE IF NOT EXISTS whatsapp_rider_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  whatsapp_number VARCHAR(20) NOT NULL,
  command TEXT NOT NULL,
  job_id UUID REFERENCES delivery_jobs(id) ON DELETE CASCADE,
  response_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp bot sessions table (for conversation state)
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number VARCHAR(20) NOT NULL UNIQUE,
  user_type VARCHAR(20) CHECK (user_type IN ('seller', 'rider', 'buyer')),
  user_id UUID,
  session_state JSONB DEFAULT '{}',
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_uploads_seller_id ON whatsapp_uploads(seller_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_uploads_status ON whatsapp_uploads(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_rider_commands_rider_id ON whatsapp_rider_commands(rider_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_number ON whatsapp_sessions(whatsapp_number);

-- RLS policies
ALTER TABLE whatsapp_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_rider_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Sellers can only see their own uploads
CREATE POLICY "Sellers can view own uploads" ON whatsapp_uploads
  FOR SELECT USING (seller_id = auth.uid());

-- Riders can only see their own commands
CREATE POLICY "Riders can view own commands" ON whatsapp_rider_commands
  FOR SELECT USING (rider_id = auth.uid());

-- Admin can see all WhatsApp data
CREATE POLICY "Admins can view all whatsapp data" ON whatsapp_uploads
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can view all rider commands" ON whatsapp_rider_commands
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can view all sessions" ON whatsapp_sessions
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
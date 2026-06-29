-- Enable uuid-ossp extension if not already enabled (required for uuid_generate_v4)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the custom ENUM for lead status
CREATE TYPE lead_status AS ENUM (
  'AWAITING_CALL',
  'CALL_IN_PROGRESS',
  'ANALYSIS_COMPLETE',
  'MOCK_CRM_SYNCED',
  'HUMAN_ESCALATION_REQUIRED'
);

-- Create the leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  industry_id TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  project_scope TEXT,
  material_preference TEXT,
  appointment_timestamp TIMESTAMPTZ,
  current_status lead_status NOT NULL DEFAULT 'AWAITING_CALL'
);

-- Create the call_telemetry table
CREATE TABLE call_telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  vapi_call_id TEXT NOT NULL,
  live_transcript TEXT,
  raw_payload JSONB
);

-- Turn on Realtime replication for both tables
-- We drop the publication if it exists to avoid errors, then recreate it.
-- Supabase manages the 'supabase_realtime' publication. We just need to add tables to it.
-- Usually it's better to alter the existing publication.
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE call_telemetry;

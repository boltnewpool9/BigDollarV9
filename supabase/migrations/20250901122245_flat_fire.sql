/*
  # Create winners table

  1. New Tables
    - `winners`
      - `id` (uuid, primary key)
      - `guide_id` (integer, references guide data)
      - `name` (text, winner's name)
      - `supervisor` (text, supervisor name)
      - `department` (text, department name)
      - `nps` (numeric, NPS score)
      - `nrpc` (numeric, NRPC score)
      - `refund_percent` (numeric, refund percentage)
      - `total_tickets` (integer, total tickets in raffle)
      - `won_at` (timestamptz, when they won)
      - `created_at` (timestamptz, record creation time)

  2. Security
    - Enable RLS on `winners` table
    - Add policy for public read access (anyone can view winners)
    - Add policy for authenticated users to insert new winners
*/

CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id INT NOT NULL,
  name TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  department TEXT NOT NULL,
  nps NUMERIC NOT NULL,
  nrpc NUMERIC NOT NULL,
  refund_percent NUMERIC NOT NULL,
  total_tickets INT NOT NULL,
  won_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.winners
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.winners
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
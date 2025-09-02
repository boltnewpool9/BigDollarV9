/*
  # Fix winners table RLS policy

  1. Security Changes
    - Drop the existing restrictive INSERT policy
    - Create a new INSERT policy that allows public access for inserting winners
    - Keep the existing SELECT policy for reading winners

  This allows the raffle application to save winners without requiring user authentication,
  which is appropriate for a public raffle system.
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON winners;

-- Create a new INSERT policy that allows public access
CREATE POLICY "Enable insert access for all users"
  ON winners
  FOR INSERT
  TO public
  WITH CHECK (true);
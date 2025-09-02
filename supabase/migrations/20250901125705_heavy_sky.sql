/*
  # Fix Winners Table Policies

  1. Security Updates
    - Update DELETE policy to allow public access for purging functionality
    - Ensure UPDATE policy exists for potential future needs
    - Maintain existing SELECT and INSERT policies

  2. Changes
    - Add comprehensive DELETE policy for public access
    - Add UPDATE policy for completeness
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.winners;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.winners;

-- Create comprehensive policies
CREATE POLICY "Enable delete access for all users"
  ON public.winners
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Enable update access for all users"
  ON public.winners
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
-- Guestbook table (public-readable)
CREATE TABLE public.guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 280),
  emoji text CHECK (char_length(emoji) <= 8),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook"
  ON public.guestbook_entries FOR SELECT
  USING (true);

CREATE POLICY "Anyone can post to guestbook"
  ON public.guestbook_entries FOR INSERT
  WITH CHECK (true);

-- Feedback table (write-only from website)
CREATE TABLE public.feedback_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
  category text CHECK (category IN ('bug', 'idea', 'compliment', 'other')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.feedback_submissions FOR INSERT
  WITH CHECK (true);

-- Index for guestbook ordering
CREATE INDEX idx_guestbook_created_at ON public.guestbook_entries (created_at DESC);
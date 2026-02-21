-- Store Discord thread channel ID per permohonan (thread name = kode_kjsb)
ALTER TABLE permohonan ADD COLUMN IF NOT EXISTS discord_thread_id TEXT;

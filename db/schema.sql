-- WEBSPECIE
-- PostgreSQL 14+
--
-- Staff roles
--   admin  Creates staff, changes roles, and can also upload species.
--   media  Uploads a species portrait to Cloudinary and the written record
--          that belongs with it. Media cannot insert, update, or delete users.
--
-- The image file is not stored in Postgres. Cloudinary keeps the file.
-- species.cloudinary_public_id is used to replace or delete it.
-- species.cloudinary_secure_url is the URL the field guide displays.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE staff_role AS ENUM ('admin', 'media');

CREATE TYPE species_category AS ENUM (
  'Mammals',
  'Insects',
  'Reptiles',
  'Birds',
  'Plants',
  'Other'
);

CREATE TYPE conservation_status AS ENUM (
  'Least concern',
  'Vulnerable',
  'Endangered'
);

CREATE TYPE status_tone AS ENUM ('safe', 'watch');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 80),
  email text NOT NULL CHECK (
    email = lower(email)
    AND char_length(email) <= 120
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  -- scrypt hash and salt from lib/server/passwords.ts. Never store the password.
  password_hash text NOT NULL CHECK (char_length(password_hash) >= 32),
  password_salt text NOT NULL CHECK (char_length(password_salt) >= 16),
  role staff_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_key ON users (email);

CREATE TABLE species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 80),
  scientific_name text NOT NULL CHECK (char_length(btrim(scientific_name)) BETWEEN 2 AND 120),
  category species_category NOT NULL,
  region text NOT NULL CHECK (char_length(btrim(region)) BETWEEN 2 AND 120),
  status conservation_status NOT NULL,
  status_tone status_tone NOT NULL,
  introduction text NOT NULL CHECK (char_length(btrim(introduction)) BETWEEN 10 AND 1200),
  habitat text NOT NULL CHECK (char_length(btrim(habitat)) BETWEEN 2 AND 160),
  diet text NOT NULL CHECK (char_length(btrim(diet)) BETWEEN 2 AND 160),
  wild_population text NOT NULL CHECK (char_length(btrim(wild_population)) BETWEEN 2 AND 160),
  field_note text NOT NULL CHECK (char_length(btrim(field_note)) BETWEEN 2 AND 600),
  fact_1 text NOT NULL CHECK (char_length(btrim(fact_1)) BETWEEN 2 AND 160),
  fact_2 text NOT NULL CHECK (char_length(btrim(fact_2)) BETWEEN 2 AND 160),
  fact_3 text NOT NULL CHECK (char_length(btrim(fact_3)) BETWEEN 2 AND 160),
  image_alt text NOT NULL CHECK (char_length(btrim(image_alt)) BETWEEN 2 AND 200),
  -- Cloudinary asset. Folder convention: webspecie/species
  cloudinary_public_id text NOT NULL CHECK (char_length(btrim(cloudinary_public_id)) BETWEEN 1 AND 255),
  cloudinary_secure_url text NOT NULL CHECK (cloudinary_secure_url ~* '^https://'),
  image_width integer NOT NULL CHECK (image_width > 0),
  image_height integer NOT NULL CHECK (image_height > 0),
  image_format text NOT NULL CHECK (image_format IN ('jpg', 'jpeg', 'png', 'webp')),
  created_by uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  updated_by uuid REFERENCES users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX species_created_by_idx ON species (created_by);
CREATE INDEX species_category_idx ON species (category);
CREATE INDEX species_name_idx ON species (lower(name));
CREATE INDEX species_scientific_name_idx ON species (lower(scientific_name));

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Least concern is "safe". Vulnerable and Endangered are "watch".
CREATE OR REPLACE FUNCTION set_species_status_tone()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.status_tone := CASE
    WHEN NEW.status = 'Least concern' THEN 'safe'::status_tone
    ELSE 'watch'::status_tone
  END;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER species_set_status_tone
BEFORE INSERT OR UPDATE ON species
FOR EACH ROW
EXECUTE FUNCTION set_species_status_tone();

-- Matches the staff rule that the last administrator cannot be removed or demoted.
CREATE OR REPLACE FUNCTION protect_last_admin()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  remaining_admins integer;
BEGIN
  IF OLD.role = 'admin' AND (TG_OP = 'DELETE' OR NEW.role IS DISTINCT FROM 'admin') THEN
    SELECT count(*) INTO remaining_admins
    FROM users
    WHERE role = 'admin' AND id <> OLD.id;

    IF remaining_admins = 0 THEN
      RAISE EXCEPTION 'The last administrator cannot be removed or given another role';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER users_protect_last_admin
BEFORE UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION protect_last_admin();

COMMENT ON TABLE users IS
  'Staff accounts. Only an administrator may insert, update, or delete rows.';

COMMENT ON COLUMN users.role IS
  'admin manages users and species. media uploads species images and information only.';

COMMENT ON TABLE species IS
  'One field-guide record. The portrait is a Cloudinary image. Administrators and media managers may insert, update, and delete rows.';

COMMENT ON COLUMN species.cloudinary_public_id IS
  'Cloudinary public_id, used when a media manager replaces or deletes the portrait.';

COMMENT ON COLUMN species.cloudinary_secure_url IS
  'Cloudinary secure_url shown in the field guide.';

-- Read model for the public guide. Image points at Cloudinary.
CREATE VIEW species_catalog AS
SELECT
  id,
  name,
  scientific_name AS scientific,
  category::text AS category,
  region,
  cloudinary_secure_url AS image,
  image_width,
  image_height,
  image_alt,
  status::text AS status,
  status_tone::text AS status_tone,
  introduction,
  habitat,
  diet,
  wild_population,
  ARRAY[fact_1, fact_2, fact_3] AS facts,
  field_note,
  created_at
FROM species;

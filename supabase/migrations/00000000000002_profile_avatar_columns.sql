-- Adds profile-picture fields to the existing profiles table.
-- avatar_type: 'photo' | 'emoji' | 'flag'
-- avatar_value: public photo URL, an emoji character, or a country code (for flag)

alter table profiles add column if not exists avatar_type text;
alter table profiles add column if not exists avatar_value text;

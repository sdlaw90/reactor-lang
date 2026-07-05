-- Adds skill-level (CEFR-based) tracking per (user, track):
-- skill_level: 'none' | 'beginner' | 'intermediate' | 'expert' | 'native'
-- level_correct_count / level_total_count: rolling accuracy AT THE CURRENT
-- skill level, reset to 0 whenever the level changes — used to suggest
-- advancing to the next tier once accuracy is consistently high.

alter table progress add column if not exists skill_level text not null default 'none';
alter table progress add column if not exists level_correct_count int not null default 0;
alter table progress add column if not exists level_total_count int not null default 0;

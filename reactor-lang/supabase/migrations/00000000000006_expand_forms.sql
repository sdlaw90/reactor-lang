-- Expands both beta_applications and feedback_submissions to capture the
-- fuller question set from the original Google Forms design (uploaded
-- create_squirrelingo_forms.gs) instead of the pared-down version shipped
-- initially. Key/commonly-filtered fields get real columns; the long tail
-- of granular questions lives in a "details" jsonb column so no answer gets
-- lost, without a 20-column migration.

alter table beta_applications add column if not exists native_language text;
alter table beta_applications add column if not exists current_level text;
alter table beta_applications add column if not exists details jsonb;
-- details holds: age_range, devices[], browser, dialect_preference,
-- apps_used[], biggest_frustration, practice_frequency, session_length_pref,
-- appeal_score, focus_difficulty, time_commitment, prior_beta_experience,
-- bug_report_comfort, open_to_call, anything_else

alter table feedback_submissions add column if not exists sessions_completed text;
alter table feedback_submissions add column if not exists continued_use_likelihood int;
alter table feedback_submissions add column if not exists recommend_likelihood int;
alter table feedback_submissions add column if not exists details jsonb;
-- details holds: device_browser, signup_ease, confusion_at_start,
-- understood_scoring, categories_used[], favorite_category_why,
-- difficulty_feel, combo_satisfaction, session_length_feel,
-- phonetics_helpfulness, progress_tracking_feedback, bugs_encountered,
-- bug_description, speed_rating, visual_issues, one_thing_to_fix,
-- daily_use_feature, disappear_feeling, anything_else

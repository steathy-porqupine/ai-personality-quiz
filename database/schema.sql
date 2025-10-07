-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    stage1_answers JSONB,
    stage2_answers JSONB,
    personality_scores JSONB,
    tool_scores JSONB,
    validation_feedback JSONB,
    demographics JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_submitted_at ON quiz_results(submitted_at);
CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON quiz_results(email);

-- Create analytics view for easy reporting
CREATE OR REPLACE VIEW quiz_analytics AS
SELECT 
    DATE(submitted_at) as submission_date,
    COUNT(*) as total_submissions,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as submissions_with_email,
    COUNT(CASE WHEN stage2_answers IS NOT NULL THEN 1 END) as completed_stage2,
    COUNT(CASE WHEN validation_feedback->>'stage1' = 'yes' THEN 1 END) as stage1_satisfied,
    COUNT(CASE WHEN validation_feedback->>'stage2' = 'yes' THEN 1 END) as stage2_satisfied,
    COUNT(CASE WHEN demographics->>'age' IS NOT NULL THEN 1 END) as provided_age,
    COUNT(CASE WHEN demographics->>'location' IS NOT NULL THEN 1 END) as provided_location,
    COUNT(CASE WHEN demographics->>'experience' IS NOT NULL THEN 1 END) as provided_experience
FROM quiz_results 
GROUP BY DATE(submitted_at)
ORDER BY submission_date DESC;

-- Create personality distribution view
CREATE OR REPLACE VIEW personality_distribution AS
SELECT 
    personality_scores->'top3'->0->>'name' as top_match,
    COUNT(*) as frequency,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM quiz_results 
WHERE personality_scores IS NOT NULL 
    AND personality_scores->'top3'->0->>'name' IS NOT NULL
GROUP BY personality_scores->'top3'->0->>'name'
ORDER BY frequency DESC;



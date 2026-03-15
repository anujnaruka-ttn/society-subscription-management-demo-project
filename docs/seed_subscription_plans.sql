-- Seed initial subscription plans
INSERT INTO subscription_plans (flat_type, monthly_rate, effective_from)
VALUES 
    ('1BHK', 10000.00, CURRENT_DATE),
    ('2BHK', 20000.00, CURRENT_DATE),
    ('3BHK', 60000.00, CURRENT_DATE),
    ('4BHK', 80000.00, CURRENT_DATE);

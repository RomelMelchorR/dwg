CREATE TABLE IF NOT EXISTS plan_zones (
  plan_id VARCHAR(255) PRIMARY KEY,
  zones_json JSON NOT NULL
);

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table with buffer zones
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    client_contact_name TEXT,
    client_phone TEXT,
    client_email TEXT,
    total_sq_ft INTEGER NOT NULL,
    boundary_polygon GEOMETRY(Polygon, 4326),
    water_buffer_polygon GEOMETRY(Polygon, 4326),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance logs with mandatory fields
CREATE TABLE compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) NOT NULL,
    tech_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    epa_reg_number TEXT NOT NULL,
    lbs_applied FLOAT NOT NULL,
    calculated_n_rate FLOAT NOT NULL,
    wind_speed_mph FLOAT NOT NULL,
    rain_forecast_24h FLOAT NOT NULL,
    gps_location GEOMETRY(Point, 4326) NOT NULL,
    gps_timestamp TIMESTAMPTZ NOT NULL,
    compliance_status TEXT CHECK (compliance_status IN ('PASSED', 'BLOCKED', 'WARNING')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT n_rate_check CHECK (calculated_n_rate <= 0.7),
    CONSTRAINT wind_speed_not_null CHECK (wind_speed_mph IS NOT NULL),
    CONSTRAINT n_rate_not_null CHECK (calculated_n_rate IS NOT NULL),
    CONSTRAINT gps_not_null CHECK (gps_location IS NOT NULL)
);

-- Pesticide/Fertilizer registry
CREATE TABLE pesticide_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT NOT NULL,
    epa_reg_no TEXT NOT NULL UNIQUE,
    nitrogen_percent FLOAT,
    active_ingredient TEXT,
    rei_hours INTEGER DEFAULT 4,
    signal_word TEXT CHECK (signal_word IN ('Caution', 'Warning', 'Danger')),
    target_pests TEXT[]
);

-- GIBMP Quiz bank
CREATE TABLE gibmp_quiz (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    choices TEXT[] NOT NULL,
    correct_index INTEGER NOT NULL,
    points_value INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true
);

-- Crew rewards
CREATE TABLE crew_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tech_name TEXT NOT NULL UNIQUE,
    pro_points INTEGER DEFAULT 0,
    favorite_reward TEXT,
    last_quiz_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment calibration
CREATE TABLE equipment_calibration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_id TEXT NOT NULL,
    spreader_model TEXT NOT NULL,
    last_calibrated_date DATE NOT NULL,
    ounces_per_100ft FLOAT NOT NULL,
    swath_width_feet FLOAT NOT NULL,
    tech_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert GIBMP quiz questions
INSERT INTO gibmp_quiz (question, choices, correct_index, points_value) VALUES
('What is the minimum "No-Mow/No-Spray" buffer zone around a Florida water body?',
ARRAY['5 Feet', '10 Feet', '15 Feet', '20 Feet'], 1, 10),
('If the forecast calls for 2+ inches of rain in 24 hours, can you apply Nitrogen?',
ARRAY['Yes', 'No'], 1, 10),
('When using a broadcast spreader near a sidewalk, what is required?',
ARRAY['A Deflector Shield', 'A lower spreader setting', 'A higher spreader setting', 'No special requirement'], 0, 10),
('What is the "Signal Word" for a product that is the MOST toxic?',
ARRAY['Caution', 'Warning', 'Danger', 'Poison'], 2, 10),
('If you spill a granular fertilizer on a driveway, what do you do?',
ARRAY['Hose it into the street', 'Sweep it back into turf', 'Leave it for rain to wash away', 'Cover with soil'], 1, 10),
('What is the maximum "Quick Release" Nitrogen allowed per 1,000 sq ft?',
ARRAY['0.5 lbs', '0.7 lbs', '1.0 lbs', '1.5 lbs'], 1, 10),
('True or False: You should always wear long sleeves/pants when handling "CAUTION" labels.',
ARRAY['True', 'False'], 0, 10),
('What does "REI" stand for on a chemical label?',
ARRAY['Rapid Entry Interval', 'Restricted Entry Interval', 'Required Equipment Instruction', 'Regulatory Enforcement Item'], 1, 10),
('Why do we use "Slow-Release" Nitrogen in the Florida summer?',
ARRAY['It is cheaper', 'It feeds the plant longer', 'It is less likely to leach', 'It works faster'], 1, 10),
('If you see a "Point Source" of pollution, what is your duty?',
ARRAY['Ignore it', 'Contain and Report', 'Wait for supervisor', 'Cover it up'], 1, 10);

-- Calculate distance to water buffer in feet
CREATE OR REPLACE FUNCTION distance_to_buffer(
    prop_id UUID,
    user_lat FLOAT,
    user_lon FLOAT
) RETURNS FLOAT AS $$
DECLARE
    user_geom GEOMETRY;
    buffer_geom GEOMETRY;
    distance_meters FLOAT;
BEGIN
    SELECT water_buffer_polygon INTO buffer_geom
    FROM properties WHERE id = prop_id;
    
    IF buffer_geom IS NULL THEN
        RETURN 9999; -- No buffer, return safe distance
    END IF;
    
    user_geom := ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326);
    distance_meters := ST_Distance(user_geom::geography, buffer_geom::geography);
    
    RETURN distance_meters * 3.28084; -- Convert to feet
END;
$$ LANGUAGE plpgsql;

-- Check if within buffer violation (10ft)
CREATE OR REPLACE FUNCTION is_buffer_violation(
    prop_id UUID,
    user_lat FLOAT,
    user_lon FLOAT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN distance_to_buffer(prop_id, user_lat, user_lon) <= 10.0;
END;
$$ LANGUAGE plpgsql;

-- Award quiz points RPC
CREATE OR REPLACE FUNCTION award_quiz_points(
    p_tech_name TEXT,
    p_points INTEGER
) RETURNS VOID AS $$
BEGIN
    INSERT INTO crew_rewards (tech_name, pro_points, last_quiz_date)
    VALUES (p_tech_name, p_points, CURRENT_DATE)
    ON CONFLICT (tech_name)
    DO UPDATE SET
        pro_points = crew_rewards.pro_points + EXCLUDED.pro_points,
        last_quiz_date = EXCLUDED.last_quiz_date;
END;
$$ LANGUAGE plpgsql;

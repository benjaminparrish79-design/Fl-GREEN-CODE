# FGC - Florida Green Code Compliance Application

A comprehensive compliance and field management application for lawn care and landscaping professionals in Florida, designed to ensure adherence to environmental regulations and best practices.

## Project Overview

The FGC application helps technicians and field managers comply with Florida's environmental regulations, particularly the Florida Green Industries Best Management Practices (GIBMP) and nitrogen application limits. The system includes real-time weather monitoring, GPS-based buffer zone enforcement, offline-first capabilities, and comprehensive compliance logging.

## Features

- **Daily Safety Quiz**: Technicians must pass a daily GIBMP safety quiz before starting work, with points-based rewards system.
- **Nitrogen Calculator**: Real-time calculation and validation of nitrogen application rates with hard blocks for exceeding legal limits (0.7 lbs/1000 sq ft).
- **Water Buffer Zone Monitoring**: GPS-based real-time monitoring with haptic feedback when approaching protected water bodies (10-foot minimum buffer).
- **Weather-Based Compliance**: Integration with OpenWeather API to block applications during unsafe conditions (wind >15 mph or rain >2 inches in 24 hours).
- **Offline-First Architecture**: Job data is queued locally and synced when connectivity is restored.
- **SMS Notifications**: Clients receive REI (Restricted Entry Interval) alerts via Twilio.
- **Equipment Calibration Tracking**: Maintain records of spreader calibration and equipment settings.
- **Compliance Logging**: Comprehensive audit trail with GPS location, weather conditions, and nitrogen rates for every job.

## Tech Stack

### Frontend
- **React 18** with Vite for fast development and optimized builds
- **Supabase JavaScript Client** for real-time database interactions
- **CSS3** with responsive design for mobile-first development

### Backend
- **Supabase** for PostgreSQL database, authentication, and Edge Functions
- **PostGIS** for geospatial queries and buffer zone calculations
- **Deno** (via Supabase Edge Functions) for serverless backend logic

### External Services
- **OpenWeather API** for real-time weather data
- **Twilio** for SMS notifications
- **SendGrid** for email notifications
- **Stripe** for payment processing (future integration)

## Project Structure

```
Fl-GREEN-CODE/
├── src/
│   ├── components/
│   │   ├── ActiveJob.jsx              # Main job execution component
│   │   ├── BufferZoneAlert.jsx        # Water buffer zone alerts
│   │   ├── DailyKickoff.jsx           # Daily quiz component
│   │   └── NitrogenCalculator.jsx     # Nitrogen rate calculator
│   ├── hooks/
│   │   ├── useBufferWatch.js          # GPS monitoring hook
│   │   └── useOfflineSync.js          # Offline data sync hook
│   ├── utils/
│   │   └── supabaseClient.js          # Supabase client configuration
│   ├── App.jsx                        # Main application component
│   ├── App.css                        # Application styles
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles
├── supabase/
│   ├── functions/
│   │   ├── fgc-weather-handshake/
│   │   │   └── index.ts               # Weather validation & compliance logging
│   │   └── import_map.json            # Deno import map
│   ├── config.toml                    # Supabase project configuration
│   └── schema.sql                     # Database schema and functions
├── database/
│   └── schema.sql                     # PostgreSQL schema with PostGIS
├── .env                               # Environment variables (local)
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── index.html                         # HTML entry point
├── package.json                       # Node.js dependencies
├── vite.config.js                     # Vite configuration
└── README.md                          # This file
```

## Database Schema

### Core Tables

**properties**: Stores property information with geospatial data
- `id` (UUID): Primary key
- `name` (TEXT): Property name
- `client_contact_name`, `client_phone`, `client_email`: Client information
- `total_sq_ft` (INTEGER): Property size
- `boundary_polygon` (GEOMETRY): Property boundary (PostGIS)
- `water_buffer_polygon` (GEOMETRY): Protected water buffer zone
- `is_active` (BOOLEAN): Active status
- `created_at` (TIMESTAMPTZ): Creation timestamp

**compliance_logs**: Records every application with full compliance data
- `id` (UUID): Primary key
- `property_id` (UUID): Foreign key to properties
- `tech_name` (TEXT): Technician name
- `product_name`, `epa_reg_number`: Product information
- `lbs_applied` (FLOAT): Amount applied
- `calculated_n_rate` (FLOAT): Nitrogen rate (max 0.7 lbs/1000 sq ft)
- `wind_speed_mph`, `rain_forecast_24h`: Weather conditions
- `gps_location` (GEOMETRY): Application location (PostGIS Point)
- `gps_timestamp` (TIMESTAMPTZ): GPS timestamp
- `compliance_status` (TEXT): PASSED, BLOCKED, or WARNING
- `created_at` (TIMESTAMPTZ): Log timestamp

**crew_rewards**: Tracks technician quiz performance and rewards
- `id` (UUID): Primary key
- `tech_name` (TEXT): Unique technician identifier
- `pro_points` (INTEGER): Accumulated points
- `favorite_reward` (TEXT): Preferred reward
- `last_quiz_date` (DATE): Last quiz completion date
- `created_at` (TIMESTAMPTZ): Creation timestamp

**gibmp_quiz**: Quiz question bank
- `id` (UUID): Primary key
- `question` (TEXT): Quiz question
- `choices` (TEXT[]): Multiple choice options
- `correct_index` (INTEGER): Index of correct answer
- `points_value` (INTEGER): Points awarded for correct answer
- `is_active` (BOOLEAN): Active status

**pesticide_registry**: Product information and safety data
- `id` (UUID): Primary key
- `product_name` (TEXT): Product name
- `epa_reg_no` (TEXT): EPA registration number (unique)
- `nitrogen_percent` (FLOAT): Nitrogen content percentage
- `active_ingredient` (TEXT): Active ingredient
- `rei_hours` (INTEGER): Restricted Entry Interval in hours
- `signal_word` (TEXT): Toxicity level (Caution, Warning, Danger)
- `target_pests` (TEXT[]): Target pest list

**equipment_calibration**: Equipment maintenance and calibration records
- `id` (UUID): Primary key
- `truck_id` (TEXT): Vehicle identifier
- `spreader_model` (TEXT): Equipment model
- `last_calibrated_date` (DATE): Last calibration date
- `ounces_per_100ft` (FLOAT): Application rate
- `swath_width_feet` (FLOAT): Spreader width
- `tech_name` (TEXT): Technician name
- `created_at` (TIMESTAMPTZ): Record timestamp

### Database Functions

**distance_to_buffer(prop_id, user_lat, user_lon)**: Calculates distance to water buffer in feet

**is_buffer_violation(prop_id, user_lat, user_lon)**: Boolean check for 10-foot buffer violation

**award_quiz_points(p_tech_name, p_points)**: Awards points to technician, creating or updating crew_rewards record

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://sbbwirekjcbpbgwwmibo.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

For Supabase Edge Functions, set these secrets via the Supabase CLI:

```bash
supabase secrets set SUPABASE_URL=https://sbbwirekjcbpbgwwmibo.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
supabase secrets set OPENWEATHER_API_KEY=your_openweather_api_key_here
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid_here
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token_here
supabase secrets set TWILIO_PHONE_NUMBER=your_twilio_phone_here
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account and project
- OpenWeather API key
- Twilio account and credentials
- SendGrid API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/benjaminparrish79-design/Fl-GREEN-CODE.git
   cd Fl-GREEN-CODE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Deploy Supabase Edge Functions** (optional for local development)
   ```bash
   supabase functions deploy fgc-weather-handshake
   ```

### Database Setup

1. **Create Supabase project** at https://supabase.com
2. **Enable PostGIS extension** in your Supabase project
3. **Run the schema** from `database/schema.sql` in the Supabase SQL editor
4. **Configure Row Level Security (RLS)** policies as needed for your use case

## Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy
```

### Supabase Edge Functions Deployment

```bash
supabase functions deploy fgc-weather-handshake
```

## API Endpoints

### Supabase Edge Function: `fgc-weather-handshake`

**Endpoint**: `POST /functions/v1/fgc-weather-handshake`

**Request Body**:
```json
{
  "lat": 28.5383,
  "lon": -81.3792,
  "propertyId": "uuid-here",
  "techName": "John Doe",
  "jobData": {
    "productName": "Product Name",
    "epaRegNumber": "EPA-123456",
    "lbsApplied": 50,
    "nitrogenRate": 0.65,
    "gpsTimestamp": "2024-03-18T12:00:00Z"
  }
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "windSpeed": 8.5,
  "rain24hInches": 0.5,
  "smsSent": true
}
```

**Response (Blocked - 403)**:
```json
{
  "error": "VIOLATION: Wind 16.2mph, Rain 2.3in. Application BLOCKED.",
  "blocked": true,
  "windSpeed": 16.2,
  "rain24hInches": 2.3
}
```

## Security Considerations

1. **Never commit `.env` files** with real credentials to version control
2. **Use Supabase Service Role Key only in backend** (Edge Functions), never in client-side code
3. **Enable Row Level Security (RLS)** on all tables to enforce data access policies
4. **Rotate API keys regularly**, especially after sharing in development
5. **Use HTTPS** in production for all API communications
6. **Validate all user inputs** on both client and server side
7. **Implement rate limiting** on Edge Functions to prevent abuse

## Code Quality & Best Practices

- **Component-Based Architecture**: Modular React components for maintainability
- **Custom Hooks**: Reusable logic encapsulated in custom hooks (`useBufferWatch`, `useOfflineSync`)
- **Offline-First Design**: Local storage queue for resilience in poor connectivity
- **Real-Time Monitoring**: GPS polling every 3 seconds for critical safety features
- **Comprehensive Validation**: Multi-layer validation for nitrogen rates and buffer zones
- **Error Handling**: Graceful error handling with user-friendly feedback
- **Accessibility**: Semantic HTML and ARIA labels for screen reader support

## Troubleshooting

### Geolocation Permission Denied
- Ensure the app is served over HTTPS (required for geolocation)
- Check browser geolocation permissions for the domain

### Supabase Connection Issues
- Verify `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are correct
- Check Supabase project status in the dashboard
- Ensure RLS policies allow the anon key to access required tables

### Weather API Failures
- Verify `OPENWEATHER_API_KEY` is valid and has API calls remaining
- Check OpenWeather API status page
- Ensure the function has the correct environment variable set

### Offline Sync Not Working
- Check browser's localStorage is enabled
- Verify network connectivity restoration is detected
- Check browser console for sync errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Support

For issues, questions, or feature requests, please contact the development team or submit an issue on GitHub.

## Changelog

### v0.0.1 (Initial Release)
- Core compliance logging and validation
- Daily safety quiz system
- Real-time GPS buffer zone monitoring
- Weather-based application blocking
- Offline-first data synchronization
- SMS and email notifications
- Equipment calibration tracking

---

**Last Updated**: March 18, 2024  
**Maintained By**: FGC Development Team

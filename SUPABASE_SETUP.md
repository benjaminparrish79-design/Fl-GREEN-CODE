# Supabase Setup Guide

This guide provides detailed instructions for setting up your Supabase project for the FGC application.

## Prerequisites

- Supabase account (https://supabase.com)
- Supabase project created with project ID: `sbbwirekjcbpbgwwmibo`
- Access to Supabase dashboard

## Step 1: Enable Required Extensions

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and run the following SQL:

```sql
-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

4. Click **Run** to execute the query
5. Verify that both extensions are enabled in the **Extensions** section

## Step 2: Create Database Schema

1. In the **SQL Editor**, create a new query
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL editor
4. Click **Run** to execute all schema creation statements

This will create the following tables:
- `properties`
- `compliance_logs`
- `pesticide_registry`
- `gibmp_quiz`
- `crew_rewards`
- `equipment_calibration`

And the following functions:
- `distance_to_buffer()`
- `is_buffer_violation()`
- `award_quiz_points()`

## Step 3: Verify Schema Creation

1. Go to the **Table Editor** in Supabase
2. Verify that all tables are listed:
   - properties
   - compliance_logs
   - pesticide_registry
   - gibmp_quiz
   - crew_rewards
   - equipment_calibration

3. Click on each table to verify the columns are correct

## Step 4: Insert Initial Quiz Data

The quiz data is already included in the schema.sql file, but you can verify it:

1. Go to **Table Editor** and select the `gibmp_quiz` table
2. You should see 10 quiz questions with their answers
3. If the data is missing, run the INSERT statements from `database/schema.sql`

## Step 5: Configure API Keys

### 5.1 Get Your API Keys

1. Go to **Settings** > **API**
2. Note the following values:
   - **Project URL**: This is your `REACT_APP_SUPABASE_URL`
   - **Anon Key**: This is your `REACT_APP_SUPABASE_ANON_KEY`
   - **Service Role Key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 5.2 Update Environment Variables

1. Open the `.env` file in your project root
2. Update the following values:

```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 6: Set Up Row Level Security (RLS)

Row Level Security ensures that users can only access data they're authorized to see.

### 6.1 Enable RLS on Tables

1. Go to **Authentication** > **Policies**
2. For each table, click **Enable RLS**

### 6.2 Create RLS Policies

For a development environment, you can use permissive policies. For production, implement stricter policies.

**Example: Allow public read access to active properties**

```sql
CREATE POLICY "Allow public read access to active properties"
ON properties FOR SELECT
USING (is_active = true);
```

**Example: Allow authenticated users to insert compliance logs**

```sql
CREATE POLICY "Allow authenticated users to insert compliance logs"
ON compliance_logs FOR INSERT
WITH CHECK (true);
```

Run these policies in the SQL Editor.

## Step 7: Deploy Edge Functions

### 7.1 Using Supabase Dashboard

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **Create a new function**
3. Name it `fgc-weather-handshake`
4. Copy the contents of `supabase/functions/fgc-weather-handshake/index.ts`
5. Paste it into the function editor
6. Click **Deploy**

### 7.2 Set Function Secrets

After deploying the function:

1. Go to **Settings** > **Edge Functions**
2. Click on the `fgc-weather-handshake` function
3. Click **Secrets** and add the following environment variables:

| Secret Name | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key (from Step 5.1) |
| `OPENWEATHER_API_KEY` | Your OpenWeather API key |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number |
| `SENDGRID_API_KEY` | Your SendGrid API key |

4. Click **Save** for each secret

### 7.3 Test the Edge Function

1. Go to the function details page
2. Click **Invoke** to test the function
3. Use the following test payload:

```json
{
  "lat": 28.5383,
  "lon": -81.3792,
  "propertyId": "550e8400-e29b-41d4-a716-446655440000",
  "techName": "Test Technician",
  "jobData": {
    "productName": "Test Product",
    "epaRegNumber": "EPA-123456",
    "lbsApplied": 50,
    "nitrogenRate": 0.65,
    "gpsTimestamp": "2024-03-18T12:00:00Z"
  }
}
```

4. Verify that the function returns a success response

## Step 8: Configure CORS

To allow your frontend to communicate with Supabase:

1. Go to **Settings** > **API**
2. Scroll to **CORS Configuration**
3. Add your frontend domain(s):
   - For local development: `http://localhost:5173`
   - For production: `https://your-domain.com`

## Step 9: Set Up Authentication (Optional)

If you want to add user authentication:

1. Go to **Authentication** > **Providers**
2. Enable desired providers (Email, Google, GitHub, etc.)
3. Configure the provider settings
4. Update your application to use Supabase Auth

## Step 10: Configure Backups

1. Go to **Settings** > **Backups**
2. Enable **Automated Backups**
3. Set backup frequency (daily recommended)
4. Configure backup retention period

## Testing Your Setup

### Test 1: Database Connection

1. In your local development environment, run:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Verify that the properties list loads

### Test 2: Create Test Data

1. In Supabase **Table Editor**, go to the `properties` table
2. Click **Insert Row** and add a test property:
   - name: "Test Property"
   - client_contact_name: "John Doe"
   - client_phone: "+1234567890"
   - client_email: "john@example.com"
   - total_sq_ft: 5000
   - is_active: true

3. Refresh your application and verify the property appears

### Test 3: Quiz Functionality

1. In the application, complete the daily quiz
2. Verify that points are awarded in the `crew_rewards` table

### Test 4: Edge Function

1. Submit a job from the application
2. Check that a new record appears in the `compliance_logs` table

## Troubleshooting

### Issue: "CORS Error"
**Solution**: 
1. Go to **Settings** > **API** > **CORS Configuration**
2. Add your frontend domain
3. Restart your development server

### Issue: "Extension not found"
**Solution**:
1. Verify that PostGIS is enabled in the Extensions section
2. Re-run the CREATE EXTENSION commands

### Issue: "Function not found"
**Solution**:
1. Verify the function is deployed in the Edge Functions section
2. Check the function logs for errors

### Issue: "RLS Policy Error"
**Solution**:
1. Temporarily disable RLS for development
2. Create more permissive policies
3. Test with authenticated requests

### Issue: "Geolocation not working"
**Solution**:
1. Ensure your frontend is served over HTTPS (required for geolocation)
2. Check browser permissions for geolocation

## Security Best Practices

1. **Never commit secrets**: Keep `.env` files out of version control
2. **Use Service Role Key carefully**: Only use in backend/Edge Functions
3. **Enable RLS**: Always enable Row Level Security in production
4. **Rotate keys regularly**: Change API keys every 90 days
5. **Monitor usage**: Check Supabase logs for suspicious activity
6. **Use HTTPS**: Always use HTTPS in production
7. **Validate inputs**: Validate all user inputs on both client and server

## Next Steps

1. Deploy your Edge Functions to production
2. Configure your frontend environment variables
3. Deploy your frontend to Vercel or Netlify
4. Set up monitoring and error tracking
5. Configure automated backups
6. Implement additional security policies

## Support

For more information, visit:
- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
- FGC Project README: See README.md

---

**Last Updated**: March 18, 2024

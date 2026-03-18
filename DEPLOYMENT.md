# FGC Deployment Guide

This guide provides step-by-step instructions for deploying the FGC application to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables are configured in `.env`
- [ ] Supabase project is created and PostGIS extension is enabled
- [ ] Database schema has been applied to Supabase
- [ ] All API keys are valid and have appropriate permissions
- [ ] Edge Functions have been tested locally
- [ ] Code has been reviewed and tested
- [ ] Security audit has been completed
- [ ] Backup of production data is available

## Phase 1: Database Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Note your project URL and API keys
3. Wait for the project to be fully initialized

### 1.2 Enable PostGIS Extension

1. In Supabase dashboard, go to **SQL Editor**
2. Run the following command:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

### 1.3 Apply Database Schema

1. In Supabase **SQL Editor**, open the file `database/schema.sql`
2. Copy and paste the entire schema
3. Execute the SQL to create all tables and functions

### 1.4 Verify Database Setup

1. Check that all tables are created in the **Table Editor**
2. Verify that the PostGIS functions are available
3. Insert test data into the `gibmp_quiz` table

## Phase 2: Supabase Edge Functions Deployment

### 2.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 2.2 Configure Supabase CLI

```bash
supabase login
supabase link --project-ref sbbwirekjcbpbgwwmibo
```

### 2.3 Set Environment Secrets

```bash
supabase secrets set SUPABASE_URL=your_supabase_url_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
supabase secrets set OPENWEATHER_API_KEY=your_openweather_api_key_here
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid_here
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token_here
supabase secrets set TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here
```

### 2.4 Deploy Edge Functions

```bash
supabase functions deploy fgc-weather-handshake
```

### 2.5 Verify Deployment

1. Check the Supabase dashboard for the deployed function
2. Test the function with a sample request:
   ```bash
   curl -X POST https://sbbwirekjcbpbgwwmibo.supabase.co/functions/v1/fgc-weather-handshake \
     -H "Authorization: Bearer your_anon_key" \
     -H "Content-Type: application/json" \
     -d '{
       "lat": 28.5383,
       "lon": -81.3792,
       "propertyId": "test-uuid",
       "techName": "Test Tech",
       "jobData": {
         "productName": "Test Product",
         "epaRegNumber": "EPA-123456",
         "lbsApplied": 50,
         "nitrogenRate": 0.65,
         "gpsTimestamp": "2024-03-18T12:00:00Z"
       }
     }'
   ```

## Phase 3: Frontend Deployment

### Option A: Deploy to Vercel

#### 3A.1 Prepare for Deployment

```bash
npm install
npm run build
```

#### 3A.2 Create Vercel Account

1. Go to https://vercel.com and sign up
2. Connect your GitHub account

#### 3A.3 Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

#### 3A.4 Configure Environment Variables in Vercel

1. Go to your Vercel project settings
2. Add the following environment variables:
   - `REACT_APP_SUPABASE_URL=https://sbbwirekjcbpbgwwmibo.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here`
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here`

#### 3A.5 Trigger Deployment

```bash
vercel --prod
```

### Option B: Deploy to Netlify

#### 3B.1 Prepare for Deployment

```bash
npm install
npm run build
```

#### 3B.2 Create Netlify Account

1. Go to https://netlify.com and sign up
2. Connect your GitHub account

#### 3B.3 Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy
```

#### 3B.4 Configure Environment Variables

1. In Netlify dashboard, go to **Site Settings > Build & Deploy > Environment**
2. Add the following environment variables:
   - `REACT_APP_SUPABASE_URL=https://sbbwirekjcbpbgwwmibo.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here`
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here`

#### 3B.5 Trigger Production Deployment

```bash
netlify deploy --prod
```

### Option C: Deploy to Custom Server

#### 3C.1 Build the Application

```bash
npm install
npm run build
```

#### 3C.2 Upload to Server

```bash
scp -r dist/* user@your-server.com:/var/www/fgc/
```

#### 3C.3 Configure Web Server (Nginx Example)

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    root /var/www/fgc;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Phase 4: Post-Deployment Verification

### 4.1 Test Application Access

1. Navigate to your deployed application URL
2. Verify that the login page loads correctly
3. Test the daily quiz functionality
4. Verify geolocation permissions work

### 4.2 Test Database Connectivity

1. Create a test property in the database
2. Verify that the properties list loads in the application
3. Test the nitrogen calculator
4. Verify that compliance logs are recorded

### 4.3 Test Edge Functions

1. Submit a job from the application
2. Verify that the compliance log is created in the database
3. Check that SMS notifications are sent (if Twilio is configured)
4. Verify weather blocking works correctly

### 4.4 Test Offline Functionality

1. Disable network connectivity
2. Submit a job
3. Verify that the job is queued locally
4. Re-enable network and verify sync occurs

### 4.5 Monitor for Errors

1. Set up error tracking (e.g., Sentry, LogRocket)
2. Monitor application logs
3. Check Supabase logs for Edge Function errors
4. Review database query performance

## Phase 5: Security Hardening

### 5.1 Enable Row Level Security (RLS)

In Supabase SQL Editor, run:

```sql
-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gibmp_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesticide_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_calibration ENABLE ROW LEVEL SECURITY;

-- Create policies (example for properties table)
CREATE POLICY "Allow public read access to active properties"
ON properties FOR SELECT
USING (is_active = true);

CREATE POLICY "Allow authenticated users to insert compliance logs"
ON compliance_logs FOR INSERT
WITH CHECK (true);
```

### 5.2 Configure CORS

In Supabase dashboard, go to **API Settings** and configure CORS to allow only your domain:

```
https://your-domain.com
```

### 5.3 Set Up API Rate Limiting

Configure rate limiting on your Edge Functions to prevent abuse.

### 5.4 Enable HTTPS

Ensure all traffic is served over HTTPS. Most hosting platforms (Vercel, Netlify) handle this automatically.

### 5.5 Rotate API Keys

After deployment, rotate all API keys that were shared during development:

1. Generate new Twilio credentials
2. Generate new SendGrid API key
3. Generate new Stripe keys
4. Update Supabase service role key

## Phase 6: Monitoring & Maintenance

### 6.1 Set Up Monitoring

1. **Application Performance**: Use Vercel Analytics or similar
2. **Error Tracking**: Set up Sentry or LogRocket
3. **Database Monitoring**: Enable Supabase monitoring
4. **Uptime Monitoring**: Use Pingdom or similar

### 6.2 Regular Backups

1. Enable automatic backups in Supabase
2. Test backup restoration procedures
3. Store backups in a secure location

### 6.3 Update Dependencies

```bash
npm update
npm audit fix
```

### 6.4 Monitor Costs

1. Review Supabase usage and costs
2. Monitor API call volumes
3. Optimize queries if needed

## Rollback Procedure

If issues occur after deployment:

### 6.1 Vercel Rollback

1. Go to Vercel project dashboard
2. Click on **Deployments**
3. Select the previous working deployment
4. Click **Promote to Production**

### 6.2 Netlify Rollback

1. Go to Netlify site dashboard
2. Click on **Deploys**
3. Select the previous working deployment
4. Click **Publish Deploy**

### 6.3 Database Rollback

1. Use Supabase automated backups to restore previous state
2. Or manually restore from backup if available

## Troubleshooting Deployment Issues

### Issue: "CORS Error"
**Solution**: Check CORS configuration in Supabase API settings

### Issue: "Edge Function Timeout"
**Solution**: Increase timeout or optimize function code

### Issue: "Database Connection Failed"
**Solution**: Verify connection string and credentials

### Issue: "Geolocation Not Working"
**Solution**: Ensure HTTPS is enabled and user grants permission

### Issue: "SMS Not Sending"
**Solution**: Verify Twilio credentials and account balance

## Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Last Updated**: March 18, 2024  
**Version**: 1.0

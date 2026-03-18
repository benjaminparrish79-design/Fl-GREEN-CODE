import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { lat, lon, propertyId, techName, jobData } = await req.json();

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Fetch weather from OpenWeather 3.0
  const openWeatherKey = Deno.env.get('OPENWEATHER_API_KEY');
  const weatherUrl =
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=imperial`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) throw new Error('Weather fetch failed');

  const weatherData = await weatherRes.json();
  const windSpeed = weatherData.current.wind_speed;
  const rain24hMm = weatherData.daily?.[0]?.rain ?? 0;
  const rain24hInches = rain24hMm / 25.4;

  // 2. HARD BLOCK: Wind >15mph OR Rain >2"
  if (windSpeed > 15 || rain24hInches > 2.0) {
    return new Response(
      JSON.stringify({
        error: `VIOLATION: Wind ${windSpeed}mph, Rain ${rain24hInches.toFixed(1)}in. Application BLOCKED.`,
        blocked: true,
        windSpeed,
        rain24hInches
      }),
      { status: 403 }
    );
  }

  // 3. Get property client info
  const { data: property } = await supabase
    .from('properties')
    .select('client_phone, client_contact_name')
    .eq('id', propertyId)
    .single();

  // 4. Send Twilio SMS
  const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');
  const safeTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const message = `BGP Environmental service completed. Safe to enter at ${safeTime.toLocaleTimeString()}. REI: 4hrs.`;

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: property.client_phone,
        From: twilioFrom,
        Body: message,
      }),
    }
  );

  // 5. Insert compliance log
  const { error: insertError } = await supabase
    .from('compliance_logs')
    .insert({
      property_id: propertyId,
      tech_name: techName,
      product_name: jobData.productName,
      epa_reg_number: jobData.epaRegNumber,
      lbs_applied: jobData.lbsApplied,
      calculated_n_rate: jobData.nitrogenRate,
      wind_speed_mph: windSpeed,
      rain_forecast_24h: rain24hInches,
      gps_location: `POINT(${jobData.lon} ${jobData.lat})`,
      gps_timestamp: jobData.gpsTimestamp,
      compliance_status: 'PASSED'
    });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ success: true, windSpeed, rain24hInches, smsSent: true }),
    { status: 200 }
  );
});

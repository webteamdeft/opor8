# OPOR8 Setup Guide

## Quick Start

The application is now fully configured with Supabase and ready to use!

### 1. Start the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 2. Create Your First Account

1. Navigate to the auth page
2. Click "Join OPOR8" to create a new account
3. Enter your name, email, and password
4. Click "Sign Up Free"

### 3. Make Yourself an Admin (Optional)

After creating your account, you can upgrade yourself to admin:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run this query (replace with your email):
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

4. Refresh the app - you'll now have admin access!

## Application Features

### For Users

**Onboarding**
- Complete your business profile
- Set industry, company size, and document tone
- Upload company logo (optional)

**SOP Pack Builder**
- Select departments (Finance, HR, Operations, etc.)
- AI generates relevant SOP titles
- Customize with questionnaire

**Document Generation**
- Powered by Google Gemini AI
- Creates professional SOPs in seconds
- Markdown formatted content

**Library**
- View all your generated documents
- Filter by department
- Export functionality

**Support**
- Browse help articles
- Live chat with admin (real-time)
- Submit support tickets

### For Admins

**User Management**
- View all users
- Update user roles
- Toggle paid status
- Search and filter

**Payment Tracking**
- View paid users
- Export revenue data
- Monitor subscriptions

**Help Center CMS**
- Create and edit help articles
- Organize by category
- Publish to users instantly

**Support Dashboard**
- View all support tickets
- Live chat with users
- Respond in real-time
- Close/archive tickets

**Sample Documents**
- Manage sample SOPs
- Toggle visibility to users
- Quality control

## Database Structure

### Core Tables

1. **users** - User accounts with roles
2. **business_profiles** - Company information
3. **sop_packs** - Collections of SOPs
4. **sop_documents** - Individual SOP documents
5. **questionnaire_answers** - User customization data
6. **support_tickets** - Support requests
7. **help_articles** - Knowledge base
8. **chat_sessions** - Live chat conversations
9. **chat_messages** - Individual messages
10. **global_config** - System settings

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Admins have full access to all data
- Help articles are public to authenticated users
- Sample documents visible to all users

## AI Configuration

The app uses Google Gemini for SOP generation. To configure:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

3. Restart the dev server

## Environment Variables

Required variables (already configured in `.env`):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key (optional, for AI generation)
```

## Testing the Full Flow

1. **Sign Up** - Create a user account
2. **Onboarding** - Complete business profile
3. **Builder** - Select 2-3 departments
4. **Questionnaire** - Answer customization questions
5. **Generation** - Wait for AI to generate SOPs
6. **Library** - View your generated documents
7. **Support** - Test the help center and chat

## Admin Testing

1. Upgrade your account to admin (see step 3 above)
2. Visit `/admin/dashboard` for overview
3. Visit `/admin/users` to manage users
4. Visit `/admin/support` for live chat
5. Visit `/admin/help-center` to manage articles

## Common Issues

### "User not found" on login
- Make sure you've signed up first
- Check Supabase dashboard to verify user was created

### No documents in library
- Complete the full flow: Builder → Questionnaire → Generation
- Check console for errors during generation
- Verify Gemini API key is set (if using AI generation)

### Can't access admin pages
- Verify your role is set to 'admin' in database
- Refresh the page after updating role

### Chat not updating
- Chat refreshes every 3 seconds
- Check browser console for errors
- Verify Supabase connection

## Production Deployment

### Before deploying:

1. **Set up production Supabase project**
   - Create new project at supabase.com
   - Update `.env` with production credentials

2. **Configure Gemini API**
   - Get production API key
   - Set rate limits appropriately

3. **Build the app**
   ```bash
   npm run build
   ```

4. **Deploy to Vercel/Netlify**
   - Connect your GitHub repo
   - Add environment variables
   - Deploy!

### Recommended: Set up email service
- Configure Supabase Auth email templates
- Enable email confirmations
- Set up password reset flow

## Support

For issues or questions:
- Check browser console for errors
- Check Supabase logs for database issues
- Review RLS policies if access is denied

## Next Steps

1. Add your Gemini API key for AI generation
2. Customize the help articles
3. Set up email notifications
4. Configure Stripe for payments (placeholder currently)
5. Add more sample documents
6. Customize branding and colors

Enjoy using OPOR8!

# Admin CMS Guide

This guide explains how to use the Admin Content Management System (CMS) for Euro Talent Travels.

## Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Login with the default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in production! Edit `lib/auth.ts` to update the `ADMIN_CREDENTIALS`.

## Features

### 1. Dashboard (`/admin/dashboard`)
- Overview of all CMS features
- Quick links to different sections
- Links to view the live website

### 2. Homepage Editor (`/admin/homepage`)
Edit your homepage content:
- **Hero Title** - Main heading on the homepage
- **Hero Subtitle** - Subheading text
- **Background Image URL** - Full URL to the hero background image
- **Page Title (SEO)** - Meta title for search engines
- **Meta Description (SEO)** - Meta description for search engines

**Tips:**
- Use high-quality images from Unsplash, your own hosting, or any image URL
- Preview changes before saving
- Changes are saved to `data/homepage.json`

### 3. Visa Data Manager (`/admin/visa`)
Manage visa requirements, prices, and documents:
- Select nationality and destination country
- Edit visa types (Tourist, Business, etc.)
- Update:
  - Duration
  - Processing time
  - Cost/Price
  - Validity
  - Required documents
  - Notes
- Add new visa entries
- Add/remove documents dynamically

**How to Add a New Visa Entry:**
1. Enter the nationality (e.g., "India")
2. Select the destination country from the dropdown
3. Click "Add Entry"
4. Fill in all visa type details
5. Click "Save All Changes"

**How to Edit Documents:**
- Click on a document field to edit
- Click "Remove" to delete a document
- Click "+ Add Document" to add a new one

### 4. Settings (`/admin/settings`)
- View current admin credentials
- Information about data storage
- Backup and restore instructions
- Production recommendations

## Data Storage

All content is stored in JSON files in the `data/` directory:
- `data/homepage.json` - Homepage content
- `data/visa.json` - Visa data

These files are automatically created when you first save content.

## Backup & Restore

**To Backup:**
1. Copy the entire `data/` directory
2. Store it in a safe location

**To Restore:**
1. Replace the `data/` directory with your backup
2. Restart the Next.js server

## Security Notes

1. **Change Default Credentials:** Edit `lib/auth.ts` before deploying to production
2. **Session Management:** Current implementation uses in-memory sessions. For production, consider:
   - Using NextAuth.js
   - Implementing secure cookies
   - Adding session expiration
3. **API Protection:** All save endpoints require authentication
4. **File Permissions:** Ensure the `data/` directory has proper write permissions

## Troubleshooting

### Can't Save Content
- Check that the `data/` directory exists and is writable
- Check browser console for errors
- Verify you're logged in (check `/admin/login`)

### Changes Not Appearing
- Clear browser cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check that the API is returning the correct data

### Login Not Working
- Verify credentials in `lib/auth.ts`
- Check browser console for errors
- Ensure the API routes are accessible

## Production Recommendations

Before deploying to production:

1. ✅ Change admin credentials
2. ✅ Use a proper database (PostgreSQL, MongoDB) instead of JSON files
3. ✅ Implement secure session management with cookies
4. ✅ Add rate limiting to API routes
5. ✅ Set up proper image hosting (Cloudinary, AWS S3)
6. ✅ Add user roles and permissions for multiple admins
7. ✅ Implement audit logging for content changes
8. ✅ Add backup automation
9. ✅ Set up environment variables for sensitive data
10. ✅ Enable HTTPS

## Support

For issues or questions, check:
- The main README.md
- SETUP_INSTRUCTIONS.md
- Code comments in the admin components

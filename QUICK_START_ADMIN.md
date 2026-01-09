# Quick Start: Admin CMS

## 🚀 Getting Started in 3 Steps

### 1. Start Your Development Server
```bash
npm run dev
```

### 2. Access Admin Panel
Navigate to: **http://localhost:3000/admin/login**

### 3. Login
- **Username:** `admin`
- **Password:** `admin123`

## ✨ What You Can Do

### Edit Homepage
1. Go to **Homepage** in the admin sidebar
2. Edit:
   - Hero title and subtitle
   - Background image (paste any image URL)
   - SEO meta tags
3. Click **Save Changes**
4. View your changes on the homepage!

### Manage Visa Data
1. Go to **Visa Data** in the admin sidebar
2. Select nationality and destination
3. Edit prices, costs, documents, processing times
4. Add new visa entries
5. Click **Save All Changes**

### View Your Changes
- Click **View Website** in the dashboard to see your changes live
- Changes are saved to `data/` directory automatically

## 📝 Important Notes

- **Change default password** before production (edit `lib/auth.ts`)
- All content is saved in `data/` folder as JSON files
- Images: Use any image URL (Unsplash, your hosting, etc.)
- No database needed - everything is file-based

## 🆘 Need Help?

See `ADMIN_CMS_GUIDE.md` for detailed documentation.

# WhatsApp Integration Setup

## ✅ What's Been Done

The visa query form now sends queries directly to WhatsApp! When users fill out the form and click "Send via WhatsApp", it will:

1. Format all the form data into a nice WhatsApp message
2. Open WhatsApp (web or app) with the pre-filled message
3. User can review and send the message

## 🔧 How to Configure Your WhatsApp Number

### Step 1: Open the Configuration File
Edit the file: `lib/whatsappConfig.ts`

### Step 2: Update the Number
Change this line:
```typescript
export const WHATSAPP_NUMBER = '+1234567890' // ⚠️ CHANGE THIS
```

To your actual WhatsApp number, for example:
```typescript
export const WHATSAPP_NUMBER = '+919876543210' // India
export const WHATSAPP_NUMBER = '+12345678900'  // USA
export const WHATSAPP_NUMBER = '+447911123456'  // UK
```

### Step 3: Format Requirements
- Include country code (with +)
- No spaces, dashes, or parentheses needed (they'll be removed automatically)
- Example formats that work:
  - `+919876543210`
  - `+1 234 567 8900` (spaces will be removed)
  - `+44-7911-123456` (dashes will be removed)

## 📱 How It Works

### Message Format
The WhatsApp message will be formatted like this:

```
🛂 Visa Query - Euro Talent Travels

Route: India → United States

Personal Information:
👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: +1 234 567 8900

Visa Type: Tourist Visa
Expected Travel Date: January 15, 2024

Message/Questions:
I need information about visa requirements...

This query was sent from Euro Talent Travels website
```

### User Experience
1. User fills out the form
2. Clicks "Send via WhatsApp"
3. WhatsApp opens (web or app) with the formatted message
4. User reviews and sends the message
5. Success message shows in the form

## 🎯 Features

- ✅ Automatic message formatting
- ✅ Opens WhatsApp web/app automatically
- ✅ All form data included in message
- ✅ Easy to configure (just one file)
- ✅ Works on desktop and mobile

## 🔄 Future Enhancements

You can later:
- Add WhatsApp number to CMS (Site Content Manager)
- Add multiple WhatsApp numbers for different departments
- Add WhatsApp Business API integration
- Add message templates

## ⚠️ Important Notes

1. **Test the number**: Make sure your WhatsApp number is correct and active
2. **International format**: Always include country code with +
3. **Privacy**: The message opens in user's WhatsApp, so they can edit before sending
4. **Mobile vs Desktop**: Works on both - opens WhatsApp web on desktop, app on mobile

## 🆘 Troubleshooting

**WhatsApp doesn't open?**
- Check if the number format is correct
- Make sure there are no special characters (only + and numbers)
- Test the number manually: `https://wa.me/YOURNUMBER`

**Message not formatted correctly?**
- Check the `formatWhatsAppMessage()` function in `VisaQueryForm.tsx`
- WhatsApp supports basic formatting (bold with *)

**Need help?**
- Check `lib/whatsappConfig.ts` for configuration
- Check `components/VisaQueryForm.tsx` for the form logic

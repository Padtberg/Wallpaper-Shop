# 🎨 WallpaperHub - Premium Wallpaper Website

A stunning, modern wallpaper website with email collection, download tracking, and admin dashboard. Built with HTML, CSS, JavaScript, and Node.js.

## ✨ Features

### 🎯 Main Features
- **Beautiful UI/UX**: Modern gradient design with smooth animations
- **Email Collection**: Users must provide email to get download links
- **Email Delivery**: Automatic email sending with download links
- **Download Tracking**: Track who downloads what wallpapers
- **Admin Dashboard**: Complete analytics and user management
- **Responsive Design**: Works perfectly on all devices
- **4K Wallpapers**: High-quality wallpaper generation

### 🔧 Technical Features
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: Node.js with Express
- **Email Service**: Nodemailer integration
- **Data Storage**: JSON-based (easily upgradeable to database)
- **Admin Authentication**: Secure login system
- **CSV Export**: Download user data as CSV

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Email account for sending emails (Gmail recommended)

### Installation

1. **Clone or download the project**
   ```bash
   cd "Wallpaper Webside"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure email (Optional for development)**
   - For Gmail: Enable 2-factor authentication and create an app password
   - Set environment variables:
   ```bash
   export EMAIL_USER="your-email@gmail.com"
   export EMAIL_PASS="your-app-password"
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔐 Admin Access

**Login Credentials:**
- **Username:** `Admin`
- **Password:** `123`

**Admin URL:** `http://localhost:3000/admin.html`

### Admin Features
- View email collection statistics
- Track download analytics
- Export user data as CSV
- Monitor conversion rates
- Filter and search user data

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password as `EMAIL_PASS`

### Other Email Providers
Edit `server.js` and modify the transporter configuration:

```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## 🎨 Customization

### Adding New Wallpapers
Edit the `wallpapers` array in both `script.js` and `server.js`:

```javascript
{
    id: 7,
    title: "Your Wallpaper Title",
    description: "Description of your wallpaper",
    resolution: "4K (3840x2160)",
    category: "Category",
    gradient: "linear-gradient(45deg, #color1, #color2)"
}
```

### Styling
- Main styles: `styles.css`
- Colors: Modify CSS custom properties
- Animations: Adjust keyframes in CSS
- Layout: Modify grid and flexbox properties

### Branding
- Logo: Replace favicon and update brand name in HTML
- Colors: Update gradient colors throughout CSS
- Fonts: Change font imports in HTML head

## 📊 Data Management

### Development Mode
- Data stored in browser localStorage
- Email sending is simulated (logged to console)
- No actual emails sent

### Production Mode
- Data stored in server memory
- Real emails sent via configured SMTP
- Set `NODE_ENV=production` for production mode

### Database Integration
To integrate with a database:
1. Install database driver (e.g., `mongoose` for MongoDB)
2. Replace in-memory arrays with database operations
3. Update API endpoints to use database queries

## 🔒 Security Considerations

### Current Implementation
- Basic admin authentication
- Input validation on email addresses
- CORS protection
- Rate limiting recommended for production

### Production Recommendations
- Use environment variables for all secrets
- Implement proper session management
- Add rate limiting middleware
- Use HTTPS in production
- Implement proper database with encryption
- Add CSRF protection

## 📱 Responsive Design

The website is fully responsive and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🎭 Animations

- **Hero Section**: Floating cards with rotation
- **Gallery**: Fade-in animations on scroll
- **Modals**: Slide-up animations
- **Buttons**: Hover effects with transforms
- **Loading**: Spinner animations
- **Success**: Checkmark animations

## 📈 Analytics

The admin dashboard provides:
- Total email requests
- Actual download count
- Unique user count
- Conversion rate percentage
- Per-wallpaper statistics
- Download timeline

## 🛠️ Development

### File Structure
```
Wallpaper Webside/
├── index.html          # Main homepage
├── admin.html          # Admin dashboard
├── download.html       # Download page
├── styles.css          # All styles
├── script.js           # Frontend JavaScript
├── server.js           # Backend server
├── package.json        # Dependencies
└── README.md           # This file
```

### Adding Features
1. **New wallpaper categories**: Update filter system
2. **User accounts**: Add authentication system
3. **Payment integration**: Add premium wallpapers
4. **Social sharing**: Add share buttons
5. **Search functionality**: Add search bar

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. **Environment Variables**:
   ```bash
   NODE_ENV=production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3000
   ```

2. **Deploy to platforms**:
   - **Heroku**: `git push heroku main`
   - **Vercel**: `vercel --prod`
   - **DigitalOcean**: Use App Platform
   - **AWS**: Use Elastic Beanstalk

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check email credentials
   - Verify app password for Gmail
   - Check firewall/network settings

2. **Server won't start**
   - Check if port 3000 is available
   - Verify Node.js installation
   - Run `npm install` again

3. **Admin login not working**
   - Username: `Admin` (case-sensitive)
   - Password: `123`
   - Clear browser cache

4. **Wallpapers not loading**
   - Check browser console for errors
   - Verify JavaScript is enabled
   - Check network connectivity

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
1. Check this README first
2. Look at the browser console for errors
3. Check the server logs
4. Create an issue with detailed information

---

**Made with ❤️ for wallpaper enthusiasts**

*Enjoy your beautiful new wallpaper website!* 🎨✨
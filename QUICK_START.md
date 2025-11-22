# 🚀 Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

```bash
cd d:\charusat\hackathon\spit\copilot
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- All UI dependencies

### Step 2: Run Development Server

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

You'll be automatically redirected to the login page.

### Step 3: Login (Demo Mode)

Use any of these demo credentials:

**Admin:**
- Email: `admin@ims.com`
- Password: any 6+ characters

**Inventory Manager:**
- Email: `manager@ims.com`
- Password: any 6+ characters

**Warehouse Staff:**
- Email: `staff@ims.com`
- Password: any 6+ characters

### Step 4: Explore the System

After login, you'll see the Dashboard with:

✅ **Dashboard** - KPI cards, charts, recent activity  
✅ **Products** - Product management  
✅ **Receipts** - Incoming stock  
✅ **Deliveries** - Outgoing orders *(coming soon)*  
✅ **Transfers** - Internal movements *(coming soon)*  
✅ **Adjustments** - Stock corrections *(coming soon)*  
✅ **Ledger** - Complete audit trail  
✅ **Settings** - Warehouse & profile management  

---

## 🎨 View Components in Storybook

```bash
npm run storybook
```

Open: **http://localhost:6006**

Browse all UI components with interactive controls.

---

## 📱 Test Responsive Design

### Chrome DevTools:
1. Press `F12`
2. Click device toolbar icon (or `Ctrl+Shift+M`)
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

Your optimized production build will be at: **http://localhost:3000**

---

## 📂 Key Files to Know

```
src/
├── app/
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── products/page.tsx       # Product management
│   ├── login/page.tsx          # Authentication
│   └── ...
├── components/ui/              # Reusable components
├── lib/
│   ├── api-contracts.ts        # API documentation
│   └── mock-data.ts            # Sample data
└── types/index.ts              # TypeScript types
```

---

## 🔧 Common Tasks

### Add a New Component

1. Create `src/components/ui/MyComponent.tsx`
2. Create `src/components/ui/MyComponent.stories.tsx`
3. Import and use in your pages

### Modify Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#117A65',  // Change this
    hover: '#0E6251',
  },
  // ...
}
```

### Change Mock Data

Edit `src/lib/mock-data.ts`:
```typescript
export const mockProducts: Product[] = [
  // Add/edit your data here
];
```

---

## ⚡ Quick Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check for errors |
| `npm run storybook` | View component library |
| `npm run build-storybook` | Build static Storybook |

---

## 🐛 Troubleshooting

### Port Already in Use?

```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Then run again
npm run dev
```

### Dependencies Not Installing?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors?

The project uses strict TypeScript. Build-time errors are expected until you:
1. Run `npm install` to install dependencies
2. Integrate with a real backend API

---

## 📚 Next Steps

1. ✅ **Explore the UI** - Click around and test workflows
2. ✅ **Check Storybook** - See all components
3. ✅ **Read Documentation:**
   - `README.md` - Project overview
   - `COMPONENTS.md` - Component library
   - `DEVELOPER_HANDOFF.md` - Complete guide
4. ✅ **Integrate Backend** - Replace mock data with real APIs

---

## 🎯 What You Can Do Right Now

- ✅ Create products
- ✅ View dashboard KPIs
- ✅ Browse stock ledger
- ✅ Test responsive design
- ✅ Explore UI components
- ✅ View activity timeline
- ✅ Manage warehouses
- ✅ Update user profile

---

## 💡 Pro Tips

1. **Use TypeScript** - Get autocomplete and type safety
2. **Check Storybook** - Before creating new components
3. **Follow the structure** - Keep code organized
4. **Use design tokens** - Import from `lib/design-tokens.ts`
5. **Test responsively** - Always check mobile view

---

## 🆘 Need Help?

- **Component docs:** See `COMPONENTS.md`
- **API reference:** See `src/lib/api-contracts.ts`
- **Full guide:** See `DEVELOPER_HANDOFF.md`
- **Project info:** See `README.md`

---

**You're all set! Happy coding! 🎉**

The system is ready to use. Just run `npm install` and `npm run dev` to get started.

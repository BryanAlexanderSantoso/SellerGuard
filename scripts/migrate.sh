#!/bin/bash

# EcomGuard Database Migration Script
# This script helps you run database migrations

echo "🚀 EcomGuard Database Migration"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    exit 1
fi

echo "📋 Migration file: supabase/migrations/20260115000000_fix_schema.sql"
echo ""
echo "Please choose migration method:"
echo "1. Manual (Copy SQL to Supabase Dashboard)"
echo "2. Supabase CLI (Recommended if installed)"
echo "3. Show SQL content"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📝 Manual Migration Steps:"
        echo "1. Open Supabase Dashboard: https://app.supabase.com"
        echo "2. Go to SQL Editor"
        echo "3. Copy content from: supabase/migrations/20260115000000_fix_schema.sql"
        echo "4. Paste and run in SQL Editor"
        echo ""
        read -p "Press Enter to open migration file..."
        cat supabase/migrations/20260115000000_fix_schema.sql
        ;;
    2)
        echo ""
        echo "🔧 Running Supabase CLI migration..."
        if ! command -v supabase &> /dev/null; then
            echo "❌ Supabase CLI not found!"
            echo "Install with: npm install -g supabase"
            exit 1
        fi
        
        echo "Pushing migrations to Supabase..."
        supabase db push
        
        if [ $? -eq 0 ]; then
            echo "✅ Migration completed successfully!"
        else
            echo "❌ Migration failed. Please check errors above."
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "📄 SQL Content:"
        echo "=============="
        cat supabase/migrations/20260115000000_fix_schema.sql
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Next steps:"
echo "1. Verify migration in Supabase Dashboard"
echo "2. Check if stats table has initial data"
echo "3. Test the application: npm run dev"
echo ""
echo "📚 For more info, read: DATABASE_INTEGRATION.md"

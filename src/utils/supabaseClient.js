import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vuqgnajvtllbiflnclzl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1cWduYWp2dGxsYmlmbG5jbHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NjU0NjUsImV4cCI6MjA1MDQ0MTQ2NX0.D8oOCZMIhlZUN7eRlhp9P0L1MslE0tZsMcJO7NIk_jQ'

export const supabase = createClient(supabaseUrl, supabaseKey) 
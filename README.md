Frontend Setup:

Step 1: npm create vite@latest cd frontend npm install npm run dev

Step 2 (tailwind setup): npm install tailwindcss @tailwindcss/vite

Step 3: Paste following code in vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
Step 4: delete the App.css file

Step 5: delete code of index.css and paste following code: @import "tailwindcss"

Backend Setup:

npm init -y
npm install express mongoose multer cors dotenv nanoid nodemailer bcrypt fs

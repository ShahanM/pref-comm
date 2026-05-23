import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react(), tailwindcss()],
        build: {
            outDir: 'dist',
        },
        server: {
            port: 3340,
        },
    };
});

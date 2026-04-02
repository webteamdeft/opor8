
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://54.195.90.161:3000';
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://522cc191dce7.ngrok-free.app';

// Ensure the base URL includes /api/v1 for standard routing
const API_BASE_URL = BASE_URL.endsWith('/api/v1') ? BASE_URL : `${BASE_URL}/api/v1`;

export const api = {
    async get(endpoint: string, customHeaders: Record<string, string> = {}) {
        const token = localStorage.getItem('op8_token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...customHeaders
        };

        if (!headers['Authorization'] && token && token !== 'undefined' && token !== 'null') {
            const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
            headers['Authorization'] = `Bearer ${cleanToken}`;
            headers['token'] = cleanToken;
        }

        const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            console.error('[API] GET Request failed:', error);
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    },

    async post(endpoint: string, body: any, customHeaders: Record<string, string> = {}) {
        const token = localStorage.getItem('op8_token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...customHeaders
        };

        if (!headers['Authorization'] && token && token !== 'undefined' && token !== 'null') {
            const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
            headers['Authorization'] = `Bearer ${cleanToken}`;
            headers['token'] = cleanToken;
        }

        const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    },

    async put(endpoint: string, body: any, customHeaders: Record<string, string> = {}) {
        const token = localStorage.getItem('op8_token');
        const isFormData = body instanceof FormData;

        const headers: Record<string, string> = {
            'ngrok-skip-browser-warning': 'true',
            ...customHeaders
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (!headers['Authorization'] && token && token !== 'undefined' && token !== 'null') {
            const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
            headers['Authorization'] = `Bearer ${cleanToken}`;
            headers['token'] = cleanToken;
        }

        const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: isFormData ? body : JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    },

    async delete(endpoint: string, customHeaders: Record<string, string> = {}) {
        const token = localStorage.getItem('op8_token');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...customHeaders
        };

        if (!headers['Authorization'] && token && token !== 'undefined' && token !== 'null') {
            const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
            headers['Authorization'] = `Bearer ${cleanToken}`;
            headers['token'] = cleanToken;
        }

        const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    }
};

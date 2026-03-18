import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NetworkDebug() {
  const [results, setResults] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const testConnection = async () => {
    setResults([]);
    addLog('Starting network tests...');
    
    const baseUrl = import.meta.env.VITE_BASE_API_URL || "http://localhost:8090";
    addLog(`Base URL: ${baseUrl}`);
    
    // Test 1: Basic fetch
    try {
      addLog('Testing basic fetch...');
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      addLog(`Fetch response: ${response.status} ${response.statusText}`);
    } catch (error) {
      addLog(`Fetch error: ${error}`);
    }
    
    // Test 2: Test with different IPs
    const testUrls = [
      'http://10.0.2.2:8090/health',
      'http://localhost:8090/health', 
      'http://127.0.0.1:8090/health'
    ];
    
    for (const url of testUrls) {
      try {
        addLog(`Testing ${url}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        addLog(`✓ ${url}: ${response.status}`);
      } catch (error) {
        addLog(`✗ ${url}: ${error}`);
      }
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Network Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection}>Test API Connection</Button>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Environment:</h3>
            <p>VITE_BASE_API_URL: {import.meta.env.VITE_BASE_API_URL || 'undefined'}</p>
            <p>VITE_KEYCLOAK_URL: {import.meta.env.VITE_KEYCLOAK_URL || 'undefined'}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-64 overflow-y-auto">
              {results.length === 0 ? 'No tests run yet...' : results.map((result, i) => (
                <div key={i}>{result}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
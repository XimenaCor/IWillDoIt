import { Controller, Post } from '@nestjs/common';

@Controller('logs')
export class LogsDemoController {
    @Post('demo')
    async demo() {
        const baseUrl = process.env.LOG_SERVICE_URL;
        if (!baseUrl) {
            return {
                ok: false,
                error: 'LOG_SERVICE_URL is not configured',
            };
        }

        const payload = {
            service: 'api',
            event: 'demo_log',
            timestamp: new Date().toISOString(),
            message: 'Hello from API -> log-service',
        };

        const res = await fetch(`${baseUrl}/logs`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return {
            ok: res.ok,
            status: res.status,
            sent: payload,
        };
    }
}

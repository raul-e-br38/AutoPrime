const { URL } = require('url');
const http = require('http');
const https = require('https');

function parseArg(name) {
	// aceita --name=valor ou --name valor
	for (let i = 0; i < process.argv.length; i++) {
		const a = process.argv[i];
		if (a.startsWith(`--${name}=`)) return a.split('=')[1];
		if (a === `--${name}` && process.argv[i + 1]) return process.argv[i + 1];
	}
	return null;
}

function hasFlag(...names) {
	return names.some(n => process.argv.includes(n));
}

function postJson(urlString, bodyObj) {
	return new Promise((resolve, reject) => {
		try {
			const url = new URL(urlString);
			const data = JSON.stringify(bodyObj);
			const opts = {
				hostname: url.hostname,
				port: url.port || (url.protocol === 'https:' ? 443 : 80),
				path: url.pathname + (url.search || ''),
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(data)
				}
			};
			const lib = url.protocol === 'https:' ? https : http;
			const req = lib.request(opts, (res) => {
				let chunks = '';
				res.setEncoding('utf8');
				res.on('data', (c) => chunks += c);
				res.on('end', () => {
					const status = res.statusCode;
					let parsed;
					try { parsed = JSON.parse(chunks); } catch (e) { parsed = chunks; }
					resolve({ status, body: parsed });
				});
			});
			req.on('error', (err) => reject(err));
			req.write(data);
			req.end();
		} catch (err) {
			reject(err);
		}
	});
}

async function finalizarCarrinhoCli() {
	const email = parseArg('email') || parseArg('e');
	if (!email) {
		console.error('Erro: informe --email=cliente@exemplo.com');
		process.exitCode = 2;
		return;
	}
	const baseUrl = parseArg('url') || 'http://localhost:5000';
	const endpoint = (baseUrl.replace(/\/+$/, '') + '/carrinho/finalizar');
	console.log(`Enviando requisição para ${endpoint} { email_cliente: "${email}" }`);
	try {
		const res = await postJson(endpoint, { email_cliente: email });
		console.log('Status:', res.status);
		console.log('Resposta:', typeof res.body === 'object' ? JSON.stringify(res.body, null, 2) : res.body);
		if (res.status >= 200 && res.status < 300) process.exitCode = 0;
		else process.exitCode = 1;
	} catch (err) {
		console.error('Falha na requisição:', err.message || err);
		process.exitCode = 1;
	}
}

// substitui a chamada direta por um pequeno CLI para diagnosticar sintaxes
if (process.argv.includes('--check-syntax')) {
	// chama o verificador que percorre o projeto e reporta erros de sintaxe
	require('../tools/check-syntax');
} else if (process.argv.includes('--disable-retries')) {
	// executa o utilitário que tenta desativar logs/reatentativas automáticas
	require('../tools/disable-retry')();
} else if (hasFlag('finalizar', 'finalize')) {
	// CLI para finalizar carrinho: --finalizar --email=cliente@exemplo.com [--url=http://api:5000]
	finalizarCarrinhoCli();
} else {
	someFunction();
}